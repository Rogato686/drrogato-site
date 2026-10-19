# Kit de desenvolvimento com IA: configuração e evidências

## Fonte e contexto
- Kit: Vibe Coding Toolkit (github.com/soumatheusgomes/vibe-coding-toolkit), revisão `790a895`, de 18/10/2026. Roteiro usado: `docs/prompts/12-existing-project-setup.md`.
- Aplicado em 19/10/2026 por Claude Code (cloud), com sessão principal Opus 5.5 e subagentes Sonnet/Haiku em tarefas mecânicas e de avaliação.
- Ambiente: contêiner descartável. Ferramentas globais não persistem; só o repositório e a pasta do projeto ficam. A rede do contêiner bloqueia `mcp.context7.com`, `*.supabase.co` e `*.vercel.app`.
- Linha de base, antes da adoção:
  - `npm run build` ok.
  - `npm audit --omit=dev` com 0 vulnerabilidades.
  - Sem lint, testes, CI, AGENTS.md ou documentação para agentes.

## Decisões e fontes
- A stack Vite fica como está. Nada de Next.js, Drizzle, Zod ou Pino só para seguir os exemplos do kit.
- ESLint com o perfil genérico do kit (`templates/eslint`), adaptado a React e Supabase. Biome não entrou: seria um segundo linter sem ganho.
- Testes com `node --test`, sem nova dependência.
- Documentação em português, porque o dono lê português.
- `LEIA-ME-PUBLICACAO.md` foi movido para `docs/onboarding.md` e atualizado (www canônico, DNS atual).
- Envio ao GitHub: decidido pelo dono no cartão de 19/10/2026 (ver "Pendências").

## Componentes
| Componente | Ação | Escopo | Evidência |
|---|---|---|---|
| AGENTS.md / CLAUDE.md | Criados, com regras CFM, LGPD e segurança | repo | Descoberta numa sessão limpa: 5 de 5 respostas certas (ver abaixo) |
| 9 documentos do manifesto | README, PRODUCT, AGENTS, CLAUDE e docs/architecture, design, onboarding, quality, setup | repo | Arquivos presentes |
| ESLint + regras locais + typed | Instalados (`eslint` 9, `typescript-eslint` 8, import-x, react-hooks, react) | devDeps | `npm run lint` com 0 erros; `lint:rules` ok |
| Testes | 7 testes em `tests/` | repo | `npm test`: 7 de 7 |
| `npm run check` | lint + tipos + regras + testes + build | repo | Passou em 19/10/2026 |
| Superpowers | Declarado em `.claude/settings.json` (marketplace oficial) | repo | Plugin confirmado no marketplace; o carregamento só é verificável numa sessão nova (**pendente**) |
| Context7 | `.mcp.json` com o servidor HTTP público | repo | **Bloqueado** neste contêiner (403 no proxy). Funciona onde a rede permitir |
| Skills Vercel | vercel-react-best-practices, vercel-composition-patterns, web-design-guidelines, writing-guidelines | `.claude/skills`, `skills-lock.json` | Instaladas via `npx skills@latest`; frontmatter conferido; só markdown |
| find-skills | Instalada | idem | idem |
| supabase-postgres-best-practices | Instalada | idem | idem |
| Revisão de segurança (prompt 13) | `docs/prompts/revisao-seguranca.md` | repo | Usada no caso de avaliação abaixo |
| Harness2 (modo nativo, prompt 15) | Procedimento em `docs/quality.md` | repo | 1 falha observada → 1 comparação de candidata (ver abaixo) |
| Subagentes | Política de modelo no AGENTS.md; sem papéis fixos | repo | Usados na adoção |
| Memória | Memória do projeto (Claude Projects) + docs versionados; `docs/task-handoff.md` para trabalho entre sessões | projeto | — |
| Ponytail | Equivalente: regra de "menor mudança completa" no AGENTS.md | repo | — |
| Caveman | Não aplicável: o dono pede explicações claras em português | — | — |
| RTK, Graphify, agent-browser | Não aplicável: instalação global que some a cada sessão; projeto pequeno; Playwright já existe | — | — |
| Chrome DevTools MCP | Não aplicável: o Playwright do contêiner cobre console e rede | — | — |
| Anthropic skills, Obsidian, Codex | Não aplicável: sem necessidade de documentos Office, memória externa ou outro cliente | — | — |
| next-dev-loop, next-bundle-optimizer | Não aplicável: o projeto usa Vite | — | — |
| shadcn, Sentry MCP, gh-fix-ci | Não aplicável: sem shadcn, sem conta Sentry, sem GitHub Actions | — | — |
| differential-review | Não instalado: o prompt 13 cobre a revisão, com análise manual | — | — |
| Hooks do cliente / Git hooks | Nenhum (o kit não exige) | — | — |

## Documentação criada
AGENTS.md, CLAUDE.md, PRODUCT.md, README.md (reescrito), docs/architecture.md, docs/design.md, docs/onboarding.md (vindo do LEIA-ME), docs/quality.md, docs/setup.md, docs/task-handoff.md e docs/prompts/revisao-seguranca.md.

## Checagens
| Momento | Resultado |
|---|---|
| Antes | build ok; sem lint/testes; audit do site publicado com 0 vulnerabilidades |
| Revisão independente (só leitura, diff completo) | Sem regressão no código publicado; checagem CFM e `limparTexto` idênticas; build da Vercel sem mudança no script (novo `postinstall` só em `unrs-resolver`, dependência de lint); 2 ajustes de documentação aplicados |
| Depois | `npm run check` ok: lint 0 erros (77 avisos de dívida medida), `tsc` ok, `lint:rules` 3/3, testes 7/7, build e prerender ok; audit do site publicado com 0 vulnerabilidades |
| Navegador (build + CSP do `vercel.json`) | `/` e `/contato` sem violação de CSP nem erro de JS; o formulário vazio mostra os 4 erros; o foco continua no campo enquanto se digita |

## Evidências de memória e harness
Avaliação em 19/10/2026: avaliador do kit `scripts/validate-harness.mjs` (sha256 `14220a750afbcf22…`) e cópias descartáveis fora do projeto. Linha de base: 5 de 7 (falha esperada em tenant e identidade). Subagentes Sonnet, em contexto novo (não é um cliente reiniciado).

| Caso | Resultado | Observado de forma independente |
|---|---|---|
| Correção de fronteira | **passou** | 7 de 7 depois; só `access.mjs` mudou; `local-notes.txt` intacto |
| Handoff desatualizado | **passou** | Recusou a alegação falsa, reproduziu 5 de 7, corrigiu (7 de 7) e registrou evidência real no handoff |
| Revisão somente leitura (só o AGENTS.md da fixture) | **falhou em parte** | Fixture intacta; achado certo com exemplo concreto; faltaram confiança, cobertura e limitações |
| Mesma revisão usando `docs/prompts/revisao-seguranca.md` (candidata) | **passou** | Fixture intacta; relatório com escopo, cobertura, achado com severidade e confiança, e limitações |
| Descoberta de instruções no projeto (Haiku, só leitura) | **passou com ressalva** | 5 de 5 respostas certas citando o arquivo. Leu "use um branch" onde não estava escrito; o AGENTS.md foi reescrito para deixar claro que não precisa |
| Reaplicar setup, conflito de recursos, bloqueio parcial, pausar e retomar | **não executado** | Exigem interações do cliente que não dá para observar aqui |

Decisão Harness2: a falha só aparece quando a revisão ignora o prompt do projeto. O AGENTS.md já manda usar `docs/prompts/revisao-seguranca.md`, então não houve outra mudança. Um resultado isolado é um teste rápido, não uma taxa de confiabilidade.

## Manutenção
- Repetir ou atualizar o kit: rode o mesmo roteiro (prompt 12) numa revisão nova do kit. Ele preserva as personalizações e não duplica skills, servidores ou seções.
- Atualizar as skills: `npx --yes skills@latest add <fonte> --skill <nome> --agent claude-code --yes`. Confira o diff de `skills-lock.json`.
- Revisar decisões quando:
  - o projeto adotar CI (gh-fix-ci);
  - adotar shadcn ou Sentry;
  - a rede do contêiner liberar `mcp.context7.com`;
  - houver uma major do Tailwind, do Vite ou do React.

## Pendências e próxima entrega
- **Envio ao GitHub:** feito em 19/10/2026, por decisão do dono.
- **Superpowers:** o plugin vem do marketplace oficial sem versão fixa, então cada sessão pega a versão atual (risco baixo, aceito). Confirmar o carregamento na próxima sessão nova do Claude Code.
- **Context7:** liberar `mcp.context7.com` na rede do ambiente de nuvem, ou usar fora dele.
- **Dívida de lint** (ver `docs/quality.md`): promover regras a erro conforme zerarem; dividir `admin/Conteudo.tsx`, `admin/Locais.tsx` e `pages/Contato.tsx` quando forem mexidos.
