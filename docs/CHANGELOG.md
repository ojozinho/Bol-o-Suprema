# Changelog — Bolão Suprema

## 2026-05-19 — Security hardening e handoff T.I.

### Segurança

- Adicionada migration `20260519090000_lock_user_privileged_columns.sql`:
  trigger `trg_prevent_user_privilege_escalation` bloqueia qualquer tentativa
  de usuário comum alterar campos privilegiados (`is_admin`, `is_owner`,
  `is_marketing`, `user_role`, `participant_status`, `approved_at`,
  `approved_by`, `blocked_at`, `removed_at`) via update direto na tabela `users`.
- Adicionada migration `20260519091000_enforce_prediction_market_lock.sql`:
  substitui a trigger `ensure_prediction_market_open` por versão mais robusta
  que bloqueia palpites após `kickoff_utc`, permite updates de pontuação pelo
  admin e tem `revoke execute` explícito.
- Criado `src/lib/security.ts` com `isSafeHttpUrl` e `clampText`.
- GIFs e imagens na Resenha agora são validados por `isSafeHttpUrl` antes de
  renderizar — rejeita qualquer URL não-`https://`.
- Removido fallback de direct update em `Admin/index.tsx` para
  `participant_status` — ação passa obrigatoriamente pela RPC `update_participant_status`.

### Documentação

- `README.md` reescrito com visão geral, stack, segurança e instruções de deploy.
- `docs/SECURITY.md` criado: modelo de autenticação, RLS, RPCs, proteções, XSS, resposta a incidente.
- `docs/TI_HANDOFF.md` criado: guia completo para o time de T.I.
- `docs/ARCHITECTURE.md` criado: arquitetura do sistema com diagrama Mermaid.
- `docs/DEPLOYMENT.md` criado: processo de deploy, checklist pós-deploy, rollback.
- `docs/SUPABASE_SETUP.md` criado: passo a passo de setup do Supabase.

### Organização

- Arquivos legados movidos para `docs/archive/` (migrate.sql, migrate-v4.sql,
  migrate-v5.sql, supabase-setup.js, supabase-setup.cjs, CLAUDE.md).
- `.gitignore` atualizado para incluir `uploads/` e garantir exclusão de todos
  os padrões de `.env`.

---

## 2026-05-17 — Setup wizard para novos usuários + TeamSearchPicker

- Criada tela `/setup` com wizard de 3 etapas para onboarding de novos usuários
  (nome obrigatório, foto obrigatória, dados opcionais).
- `RequireAuth` redireciona usuários sem perfil completo para `/setup`.
- Criado componente `TeamSearchPicker` com autocomplete para seleção da equipe
  favorita (substitui o grid agrupado por grupo).
- `Profile` atualizado para usar `TeamSearchPicker`.

---

## 2026-05-15 — Productização e hardening inicial

- Migrations de productização: tabelas de governança, RPC permissions, storage
  hardening, índices de foreign keys, privacidade de perfil.
- Suporte a `market_status` nas partidas.
- Novo modelo de roles: `user`, `marketing`, `admin`, `owner`.
- Audit logs, notificações, scoring rules, ranking_breakdowns, bracket_round_locks.
- Convites de participantes.

---

## 2026-05-08 — Lançamento interno

- Versão inicial com palpites, ranking, Resenha, Boletim e painel admin.
