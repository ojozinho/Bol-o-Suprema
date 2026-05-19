# Bolão Suprema

Aplicação web interna para gerenciamento de palpites da Copa do Mundo 2026, desenvolvida para os colaboradores da Suprema Gaming.

## Visão geral

O Bolão Suprema permite que participantes façam palpites de partidas e do chaveamento eliminatório, acompanhem o ranking geral, troquem mensagens em tempo real na Resenha e recebam comunicados da empresa via Boletim. O painel administrativo permite controlar mercados, registrar resultados, gerenciar participantes e acionar o recálculo de pontuação.

O deploy é feito via GitHub Actions para GitHub Pages. O back-end de autenticação, banco de dados e armazenamento de arquivos é provido pelo Supabase.

## Funcionalidades

- Autenticação por OTP via e-mail corporativo (@suprema.group)
- Palpites de placar por partida com controle de mercado (aberto/bloqueado/encerrado)
- Palpites de chaveamento eliminatório
- Ranking em tempo real com pontuação configurável
- Resenha: chat ao vivo com suporte a texto, imagens, GIFs e áudio
- Boletim: mural de comunicados interno (escrita restrita a admin/marketing)
- Notificações internas
- Perfil personalizado com foto, banner, bio, seleção favorita e jogador favorito
- Painel admin: controle de mercados, apuração de resultados, gestão de participantes, exportação CSV
- Auditoria de ações administrativas

## Stack técnica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Estilo | Tailwind CSS |
| Animações | Framer Motion |
| Roteamento | React Router v6 (HashRouter — necessário para GitHub Pages) |
| Estado | Zustand |
| Backend / DB | Supabase (PostgreSQL + Realtime + Storage) |
| Deploy | GitHub Actions → GitHub Pages |

## Arquitetura

Documentação detalhada: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

Resumo:

- SPA estática publicada no GitHub Pages — sem servidor de aplicação.
- HashRouter (`/#/rota`) garante compatibilidade com GitHub Pages sem reescritas de URL.
- Supabase fornece autenticação, banco de dados com Row Level Security e armazenamento de arquivos.
- Zustand gerencia estado local e sincroniza com Supabase via Realtime.

## Segurança

Documentação completa: [docs/SECURITY.md](docs/SECURITY.md)

Pontos principais:

- Apenas a chave `anon` (publishable) do Supabase está presente no front-end. Chaves secretas nunca são expostas.
- Row Level Security (RLS) habilitado em todas as tabelas sensíveis.
- Ações administrativas protegidas por RPCs com verificação de permissão no banco.
- Trigger impede autoelevação de privilégios via update direto na tabela `users`.
- Trigger impede criação ou alteração de palpites após o fechamento do mercado.
- URLs de mídia externa validadas para aceitar apenas `https://`.

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `VITE_SUPABASE_URL` | Sim | URL pública do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Sim | Chave anon/publishable do Supabase |
| `VITE_TENOR_KEY` | Não | Chave da API Tenor para GIFs na Resenha |
| `VITE_THESPORTSDB_KEY` | Não | Chave da TheSportsDB para busca de jogadores |
| `VITE_FNEWS_URL` | Não | URL da API de notícias (RapidAPI) |
| `VITE_FNEWS_KEY` | Não | Chave da API de notícias |
| `VITE_FNEWS_HOST` | Não | Host da API de notícias |
| `VITE_MOCK_AUTH` | Não | `true` apenas para desenvolvimento local sem Supabase |

Nunca commite `.env` ou `.env.local`. Use `.env.example` como referência.

## Desenvolvimento local

```bash
git clone https://github.com/ojozinho/Bolao-Suprema.git
cd Bolao-Suprema
npm install
cp .env.example .env.local
# Preencher VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY, ou usar VITE_MOCK_AUTH=true
npm run dev
```

Com `VITE_MOCK_AUTH=true`, o app funciona sem Supabase usando dados de `src/data/mock.ts`.

## Build

```bash
npm run build
```

O artefato de produção é gerado em `dist/`.

## Deploy

Documentação completa: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

O deploy é automático via GitHub Actions ao fazer push para `main`. O workflow em `.github/workflows/deploy.yml` executa o build e publica o conteúdo de `dist/` na branch `gh-pages`.

URL de produção: `https://ojozinho.github.io/Bolao-Suprema/`

## Supabase

Documentação de setup: [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)

As migrations estão em `supabase/migrations/` e devem ser aplicadas em ordem pelo Supabase SQL Editor ou Supabase CLI.

## Uso interno

Este repositório é público exclusivamente para viabilizar o deploy via GitHub Pages. O acesso funcional ao app requer credenciais corporativas e aprovação de administrador. Nenhum dado sensível de negócio está presente no código-fonte.
