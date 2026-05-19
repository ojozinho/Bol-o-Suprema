-- Bolão Suprema · Migration v4
-- Corrige check constraints e adiciona suporte a round_of_32, third_place, r32
-- Execute no SQL Editor do Supabase Dashboard ou via psql
-- É idempotente — pode ser executado múltiplas vezes sem efeito colateral

-- ── 1. matches.stage: adicionar round_of_32 e third_place ─────────────────────
alter table public.matches drop constraint if exists matches_stage_check;
alter table public.matches add constraint matches_stage_check
  check (stage in ('group','round_of_32','round_of_16','quarter_final','semi_final','third_place','final'));

-- ── 2. bracket_picks.round: adicionar r32 e third ───────────────────────────
alter table public.bracket_picks drop constraint if exists bracket_picks_round_check;
alter table public.bracket_picks add constraint bracket_picks_round_check
  check (round in ('r32','r16','qf','sf','third','final'));

-- ── 3. poll_votes: adicionar voted_at (compatibilidade com o store) ───────────
alter table public.poll_votes add column if not exists voted_at timestamptz;

-- ── 4. predictions: garantir índice único por user_id + match_code ───────────
-- (Já existe no schema original, mas garantimos aqui)
create unique index if not exists predictions_user_match_code
  on public.predictions (user_id, match_code)
  where match_code is not null;

-- ── 5. channel_pins: pinned_by pode ser null em registros legados ─────────────
-- Não há mudança de schema, mas garantimos que a coluna existe
alter table public.channel_pins add column if not exists pinned_by uuid references public.users(id) on delete cascade;

\echo '✓ Migration v4 concluída com sucesso!'
