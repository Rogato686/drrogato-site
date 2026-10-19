# drrogato.com.br

Site institucional do Dr. Rogato Abrantes de Quadros Filho (médico, CRM-MG 83269), com painel administrativo.
O dono do projeto não é programador e conversa em português: explique resultados em linguagem simples.

## Produto e stack

- Escopo e regras do produto: `PRODUCT.md`. Arquitetura: `docs/architecture.md`. Kit e evidências: `docs/setup.md`.
- Vite 6 + React 18 + TypeScript 5 + Tailwind 3 + react-router 7 + supabase-js 2 (npm, Node 22.18+).
- Banco, login e função de e-mail no Supabase (projeto `qksctznipxugqixcogvy`, região sa-east-1). Hospedagem na Vercel.

## Comandos

- Instalar: `npm ci`
- Desenvolver: `npm run dev`
- Lint: `npm run lint` (rápido) e `npm run lint:typed` (com tipos; só avisos, mede dívida)
- Tipos: `npm run typecheck`
- Regras locais de lint (autoteste): `npm run lint:rules`
- Testes: `npm test`
- Build (inclui checagem de termos CFM e prerender): `npm run build`
- Tudo junto: `npm run check`. Não publica, não acessa produção e não aplica migrações.

## Regras que não podem quebrar

- **Ética médica (CFM 2.336/2023).** O médico não tem RQE. Nunca escreva "endocrinologista", "especialista", "especializado" ou "especialidade". A pós-graduação aparece só como "Médico pós-graduado em Endocrinologia pelo IPEMED, NÃO ESPECIALISTA". Não anuncie tratamento de órgãos ou doenças, não prometa resultado, não use antes e depois nem depoimentos. `scripts/checar-termos.mjs` bloqueia o build.
- **LGPD.** Análise e marketing só depois do aceite de cookies (Consent Mode v2 em `/consentimento.js`). Dados de pacientes ficam só no Supabase, com RLS.
- **Segurança.** `anon` só lê as tabelas públicas e insere em `mensagens_contato`. `is_admin()` mora no schema `privado`. A CSP está em `vercel.json`: um novo script ou iframe de terceiros precisa entrar lá. Não coloque a service key no código.
- **Publicação.** Todo push para `main` publica o site na Vercel. Push, migração no banco de produção e deploy de função só com pedido explícito do dono.

## Como trabalhar

- Leia as instruções e o código relevante antes de editar. Separe fato, suposição e decisão.
- Faça a menor mudança completa. Reaproveite componentes, padrões e dependências que já existem.
- Defina antes como provar que deu certo. Corrija bug com reprodução e teste de regressão quando possível.
- Rode `npm run check` antes de entregar. Para mudanças visuais, abra o site compilado no Playwright do contêiner (`/opt/pw-browsers/chromium`).
- Mantenha o documento responsável em dia: produto em `PRODUCT.md`, estrutura em `docs/architecture.md`, interface em `docs/design.md`, preparo em `docs/onboarding.md`, checagens em `docs/quality.md`.
- Trabalho que atravessa sessões: use `docs/task-handoff.md` e confira arquivos, git e checagens reais antes de confiar nele.
- Um bloqueio para só o que depende dele; continue o resto. Não apresente pendência como resultado.

## Ferramentas

- **Superpowers** (`.claude/settings.json`): use as skills de brainstorming, plano e revisão proporcionais ao tamanho da tarefa. Trabalhe direto no `main` local (não é preciso criar branch). Se uma skill oferecer "push + PR" ao terminar, recuse sem pedido do dono.
- **Context7** (`.mcp.json`): consulte a documentação atual de bibliotecas, um conceito por vez, sem enviar código privado. Se não responder, use a documentação oficial e registre isso.
- **Skills do projeto** (`.claude/skills/`, travadas em `skills-lock.json`):
  - `vercel-react-best-practices`, `vercel-composition-patterns`: código React.
  - `web-design-guidelines`: revisão de interface e acessibilidade.
  - `writing-guidelines`: textos e documentação.
  - `supabase-postgres-best-practices`: carregue antes de mexer em SQL, RLS ou migrações.
  - `find-skills`: só quando faltar uma capacidade concreta.
- **Revisão de segurança:** `docs/prompts/revisao-seguranca.md`. É somente leitura, e o relatório fica fora do repositório.
- **Melhoria do harness:** `docs/quality.md#avaliação-do-harness`.

## Delegação e revisão

- Delegue só quando isolar contexto, especializar ou paralelizar compensar. Para buscas e trocas mecânicas, use um modelo leve. Para segurança, dados, RLS e revisão crítica, use capacidade suficiente.
- Cada subagente recebe objetivo, arquivos permitidos, critério de aceite e checagens. Cada arquivo tem um só escritor. O coordenador cuida de lockfile, configuração e git.
- Confira o diff e rode as checagens antes de aceitar o trabalho de um subagente. Mudanças não triviais recebem revisão independente, somente leitura.

## Git

- Sem hooks de git, sem bloqueio de `main` e sem exigência de branch. Lint, tipos, testes e build são checagens explícitas.
