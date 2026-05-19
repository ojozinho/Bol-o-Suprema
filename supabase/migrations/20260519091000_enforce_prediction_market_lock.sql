-- ============================================================================
-- Bolão Suprema · Hardening: bloqueio de palpites fora do mercado aberto
-- ============================================================================
-- Contexto:
--   A função ensure_prediction_market_open (migration 20260515130000) já
--   bloqueia inserção/atualização de palpites quando o mercado está fechado.
--   Esta migration a substitui por uma versão mais robusta que:
--   - verifica market_status explicitamente;
--   - verifica kickoff_utc diretamente para evitar race condition;
--   - ignora alterações administrativas de pontuação (points_earned);
--   - possui search_path fixo e revoke de execução direta.
-- ============================================================================

create or replace function public.ensure_prediction_market_open()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  match_row public.matches%rowtype;
begin
  -- Allow admin scoring updates: only points_earned changed, no score change.
  if tg_op = 'UPDATE'
    and new.match_code       is not distinct from old.match_code
    and new.home_score       is not distinct from old.home_score
    and new.away_score       is not distinct from old.away_score
    and new.points_earned    is distinct from old.points_earned
  then
    return new;
  end if;

  select * into match_row
  from public.matches
  where match_code = new.match_code;

  if not found then
    raise exception 'Partida não encontrada: %', new.match_code;
  end if;

  if coalesce(match_row.market_status, 'open') <> 'open'
    or match_row.status in ('locked', 'live', 'finished')
    or (match_row.kickoff_utc is not null and match_row.kickoff_utc <= now())
  then
    raise exception 'Mercado fechado. Palpite não pode ser criado ou alterado.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_predictions_market_open on public.predictions;

create trigger trg_predictions_market_open
before insert or update on public.predictions
for each row
execute function public.ensure_prediction_market_open();

-- Deny direct execution — only invoked internally by the trigger engine.
revoke execute on function public.ensure_prediction_market_open()
  from public, anon, authenticated;
