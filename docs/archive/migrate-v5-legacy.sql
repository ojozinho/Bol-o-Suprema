-- Bolão Suprema · Migration v5
-- Torna match_id opcional na tabela predictions
-- Permite salvar palpites usando match_code sem FK obrigatória para matches.id
-- Execute no SQL Editor do Supabase Dashboard
-- É idempotente — pode ser executado múltiplas vezes sem efeito colateral

alter table public.predictions alter column match_id drop not null;

\echo '✓ Migration v5 concluída com sucesso!'
