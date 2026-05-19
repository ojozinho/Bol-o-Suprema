-- ============================================================================
-- Bolão Suprema · Fix: correção das RPCs de admin criadas em 112000/113000
-- ============================================================================
-- Problemas identificados em revisão:
--
--   1. `calculate_match_points` (113000) duplica `calculate_prediction_points`
--      (143000) e usa pontos hardcoded em vez da tabela scoring_rules.
--      → Remover.
--
--   2. `admin_settle_match_result` (113000) duplica `settle_match_result`
--      (143000) que já faz: update matches + scoring via scoring_rules +
--      refresh_ranking_snapshots + log_audit + is_admin check.
--      → Remover. Frontend passa a usar settle_match_result diretamente.
--
--   3. `admin_update_match_status` (112000) não preenchia `locked_by` nem
--      `status` validation.
--      → Reescrever com correções.
--
--   4. `admin_bulk_match_status` (112000): idem para locked_by.
--      → Reescrever.
-- ============================================================================

-- ── Remover duplicatas incorretas ────────────────────────────────────────────

drop function if exists public.calculate_match_points(integer, integer, integer, integer, text);
drop function if exists public.admin_settle_match_result(text, integer, integer, text, text);

-- ── admin_update_match_status (versão corrigida) ─────────────────────────────

create or replace function public.admin_update_match_status(
  p_match_code  text,
  p_status      text,
  p_home_score  integer default null,
  p_away_score  integer default null,
  p_live_minute text    default null,
  p_winner      text    default null,
  p_lock_reason text    default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_before  jsonb;
  v_market  text;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Acesso negado.';
  end if;

  if p_status not in ('open', 'scheduled', 'locked', 'live', 'finished') then
    raise exception 'Status de partida inválido: %', p_status;
  end if;

  select to_jsonb(m) into v_before
  from public.matches m
  where m.match_code = p_match_code;

  if not found then
    raise exception 'Partida não encontrada: %', p_match_code;
  end if;

  v_market := case p_status
    when 'locked'   then 'locked'
    when 'finished' then 'settled'
    when 'live'     then 'closed'
    else                 'open'
  end;

  update public.matches set
    status        = p_status,
    market_status = v_market,
    locked_at     = case
                      when p_status = 'locked'   then now()
                      when p_status = 'open'     then null
                      else locked_at
                    end,
    locked_by     = case
                      when p_status = 'locked'   then auth.uid()
                      when p_status = 'open'     then null
                      else locked_by
                    end,
    lock_reason   = case
                      when p_status = 'locked'   then coalesce(p_lock_reason, 'admin_lock')
                      when p_status = 'open'     then null
                      else lock_reason
                    end,
    unlocked_at   = case
                      when p_status = 'open'     then now()
                      else unlocked_at
                    end,
    settled_at    = case
                      when p_status = 'finished' then now()
                      when p_status = 'open'     then null
                      else settled_at
                    end,
    home_score    = coalesce(p_home_score,  home_score),
    away_score    = coalesce(p_away_score,  away_score),
    live_minute   = coalesce(p_live_minute, live_minute),
    winner        = coalesce(p_winner,      winner)
  where match_code = p_match_code;

  perform public.log_audit(
    'match_status_updated',
    'match',
    p_match_code,
    v_before,
    jsonb_build_object(
      'status',        p_status,
      'market_status', v_market,
      'home_score',    p_home_score,
      'away_score',    p_away_score,
      'winner',        p_winner
    )
  );
end;
$$;

-- ── admin_bulk_match_status (versão corrigida) ────────────────────────────────

create or replace function public.admin_bulk_match_status(
  p_status        text,
  p_from_statuses text[],
  p_match_codes   text[]  default null,
  p_lock_reason   text    default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count   integer;
  v_market  text;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Acesso negado.';
  end if;

  if p_status not in ('open', 'scheduled', 'locked', 'live', 'finished') then
    raise exception 'Status de partida inválido: %', p_status;
  end if;

  v_market := case p_status
    when 'locked'   then 'locked'
    when 'finished' then 'settled'
    when 'live'     then 'closed'
    else                 'open'
  end;

  update public.matches set
    status        = p_status,
    market_status = v_market,
    locked_at     = case
                      when p_status = 'locked' then now()
                      when p_status = 'open'   then null
                      else locked_at
                    end,
    locked_by     = case
                      when p_status = 'locked' then auth.uid()
                      when p_status = 'open'   then null
                      else locked_by
                    end,
    lock_reason   = case
                      when p_status = 'locked' then coalesce(p_lock_reason, 'bulk_admin_lock')
                      when p_status = 'open'   then null
                      else lock_reason
                    end,
    unlocked_at   = case
                      when p_status = 'open'   then now()
                      else unlocked_at
                    end,
    settled_at    = case
                      when p_status = 'finished' then now()
                      when p_status = 'open'     then null
                      else settled_at
                    end
  where status = any(p_from_statuses)
    and (p_match_codes is null or match_code = any(p_match_codes));

  get diagnostics v_count = row_count;

  perform public.log_audit(
    'bulk_match_status_updated',
    'match',
    null,
    null,
    jsonb_build_object(
      'status',        p_status,
      'from_statuses', p_from_statuses,
      'match_codes',   p_match_codes,
      'count',         v_count
    )
  );

  return v_count;
end;
$$;

-- Grants reconfirmados (create or replace não remove grants existentes,
-- mas explicitamos para garantir idempotência)
grant execute on function public.admin_update_match_status(text, text, integer, integer, text, text, text)
  to authenticated;

grant execute on function public.admin_bulk_match_status(text, text[], text[], text)
  to authenticated;
