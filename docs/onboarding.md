# Preparação e publicação

Este arquivo substitui o antigo `LEIA-ME-PUBLICACAO.md`. O site já está no ar. Os passos abaixo servem para recriar o ambiente ou para trabalhar no código.

## Pré-requisitos
- Node 22.18 ou mais novo (os testes importam `.ts` direto) e npm 10.
- Contas: GitHub (repositório `Rogato686/drrogato-site`), Vercel, Supabase e Registro.br. Resend é opcional.

## Primeira execução
```
npm ci
cp .env.example .env.local   # preencha com os dados do Supabase
npm run dev
```
Variáveis (nomes só; os valores públicos de produção estão em `.env.production`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (a chave anon é pública; quem protege os dados é o RLS)
- `VITE_SITE_URL` (`https://www.drrogato.com.br`)
- `VITE_GA4_ID`

## Banco (Supabase)
- As migrações ficam em `supabase/migrations/`, em ordem. Aplique só com o pedido do dono.
- Para um novo admin: `insert into public.admins_autorizados (email, nome) values (...)`. Depois crie o usuário em Authentication. Ele vira admin quando o e-mail for confirmado.
- **Authentication → URL Configuration:**
  - Site URL: `https://www.drrogato.com.br`
  - Redirect: `https://www.drrogato.com.br/admin/nova-senha`
- Cadastro público de contas desligado. Senha mínima de 12 caracteres, com todos os tipos.
- Secrets da função `notificar-contato`:
  - `RESEND_API_KEY` (opcional)
  - `NOTIFICAR_PARA`, `NOTIFICAR_DE`, `ORIGENS_PERMITIDAS`

## Publicação
- A Vercel publica automaticamente cada push no `main` (projeto importado do GitHub, framework Vite, saída `dist`).
- Domínios:
  - `www.drrogato.com.br` é o principal.
  - `drrogato.com.br` redireciona com 308.
- DNS no Registro.br (modo avançado):
  - `A @ 216.198.79.1`
  - `CNAME www → 45db708adcfb1fc1.vercel-dns-017.com`
  - TXT de verificação do Google
- Pós-publicação (Search Console, Perfil da Empresa, Instagram, GA4): `/mnt/project-files/site/guia-pos-publicacao.md`.

## Verificar
`npm run check`. O que cada parte prova está em `docs/quality.md`.

## Agentes
Instruções em `AGENTS.md`. Skills em `.claude/skills/`, servidores MCP em `.mcp.json` e plugins em `.claude/settings.json`. Os detalhes estão em `docs/setup.md`.

## Problemas conhecidos
- NXDOMAIN logo após mudar o DNS era cache local. Teste em `https://dns.google/resolve?name=www.drrogato.com.br&type=CNAME`.
- O contêiner de nuvem do Claude não alcança `*.supabase.co`, `*.vercel.app` nem `mcp.context7.com`. Os testes de RLS são feitos por SQL.
