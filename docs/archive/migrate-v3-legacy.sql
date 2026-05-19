-- Bolão Suprema · Migration v3
-- Execute: psql "postgresql://postgres:SENHA@db.mklmnxquvslflgljhgqn.supabase.co:5432/postgres" -f migrate.sql

\echo '==> Adicionando colunas de apostas gerais nos usuários...'
alter table public.users add column if not exists vice_pick            text;
alter table public.users add column if not exists scorer_pick          text;
alter table public.users add column if not exists favorite_player_img  text;

\echo '==> Adicionando suporte a GIF e enquete no chat...'
alter table public.chat_messages add column if not exists type      text not null default 'text';
alter table public.chat_messages add column if not exists gif_url   text;
alter table public.chat_messages add column if not exists poll_data jsonb;

\echo '==> Adicionando match_code para palpites...'
alter table public.predictions add column if not exists match_code text;

\echo '==> Criando índice único de palpites por jogo...'
create unique index if not exists predictions_user_match_code
  on public.predictions (user_id, match_code)
  where match_code is not null;

\echo ''
\echo '✓ Migração concluída com sucesso!'
