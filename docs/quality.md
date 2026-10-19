# Qualidade

## Comandos e o que provam
| Comando | Prova | Não prova |
|---|---|---|
| `npm run lint` | Erros de código, imports quebrados, fronteiras (site público ≠ painel; componentes sem acesso direto ao Supabase) | Comportamento |
| `npm run lint:typed` | Mede dívida de promessas e tipos `any` (só avisos) | — |
| `npm run typecheck` | Tipos TypeScript (`tsc -b`) | — |
| `npm run lint:rules` | Autoteste das regras locais (`eslint-rules/`) com RuleTester | — |
| `npm test` | Regra de termos do CFM e descarte de links perigosos (`tests/`) | Interface |
| `npm run build` | Checagem de termos CFM no código, compilação e prerender das 13 rotas | Publicação |
| `npm run check` | Todos os acima, menos `lint:typed` | Banco de produção, Vercel, função de e-mail |

## Regras de base e dívida medida (19/10/2026)
Lint: 0 erros. As regras com dívida antiga ficam em "warn". Promova para "error" quando a contagem zerar.

| Regra | Avisos | Plano |
|---|---|---|
| `@typescript-eslint/no-non-null-assertion` | 44 | Trocar `supabase!` no painel por uma guarda única em `AdminApp` |
| `react-hooks/set-state-in-effect` | 8 | Mover carregamentos para um hook `useCarregar` |
| `quality/max-lines` (350) | 3 (`admin/Conteudo` 559, `admin/Locais` 449, `pages/Contato` 396) | Dividir por responsabilidade quando cada arquivo for mexido |
| `max-lines-per-function` / `complexity` / `max-statements` | 7 / 6 / 4 | Junto com a divisão acima |
| `max-nested-callbacks` / `react-hooks/exhaustive-deps` | 2 / 1 | Revisar junto com os efeitos acima |
| `quality/no-direct-console` | 2 | Aceitável (avisos de falha de carregamento) |
| typed: `no-misused-promises` / `no-floating-promises` | 23 / 18 | Corrigir em lotes no painel; depois promover a erro |
| typed: `no-unsafe-*` | 56 | Tipar as respostas do Supabase (`generate_typescript_types`) |

Corrigidos na adoção: componente `Erro` criado dentro do render no formulário de contato (6), import duplicado (1) e regex com caractere de controle documentada (1).

## Estratégia de testes
- O runner nativo do Node (`node --test`) importa `.ts` sem dependência nova. Precisa do Node 22.18 ou mais novo.
- Teste lógica que protege regras do produto: termos do CFM e saneamento de links. Componentes visuais são verificados no navegador (Playwright em `/opt/pw-browsers/chromium`) contra o build, inclusive a CSP.
- RLS: testar por SQL com `set local role anon` dentro de `begin … rollback`.

## Revisão depois de implementar ou corrigir
Mudança não trivial recebe revisão independente, somente leitura, no diff exato. Ela olha comportamento, regressões, segurança/dados e acessibilidade, conforme o risco. Achados são verificados antes de corrigir.

## Revisão de segurança
- Prompt reutilizável: `docs/prompts/revisao-seguranca.md` (kit 790a895).
- Última revisão completa: 14/10/2026 (relatório privado em `/mnt/project-files/site/auditoria-seguranca.md`).
- Itens que só o dono altera: cadastro público desligado, senha mínima de 12 caracteres. "Senhas vazadas" não existe no plano gratuito do Supabase.

## Avaliação do harness
Veja os resultados em `docs/setup.md#evidências-de-memória-e-harness`. Para repetir:
1. Copie `templates/harness-evaluation/` do kit para uma pasta temporária por caso.
2. Rode `node <kit>/scripts/validate-harness.mjs <cópia>` (a linha de base deve falhar 2 de 7).
3. Dê a tarefa a uma sessão nova e confira de novo, de forma independente.

Melhoria do harness (Harness2, modo nativo, prompt 15 do kit): uma falha observada justifica uma única comparação de candidata, com checagem independente. Sem falha, não se muda nada.

## Dependências e entrega
- `npm audit --omit=dev`: 0 vulnerabilidades (19/10/2026). Avisos só de desenvolvimento: `braces` e `postcss-selector-parser`, via Tailwind 3.
- Atualize em grupos compatíveis. Major nova (Tailwind 4, Vite 7, React 19) é proposta separada.
- Push no `main` publica o site, então só com pedido do dono.
