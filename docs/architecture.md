# Código e arquitetura

## Stack real
- Vite 6 com o plugin React. React 18, TypeScript 5 (strict), Tailwind 3, react-router 7 e `@supabase/supabase-js` 2.
- Supabase (Postgres 15+, Auth, Edge Function em Deno), projeto `qksctznipxugqixcogvy`, região sa-east-1.
- Vercel: build `npm run build`, saída `dist/`, cabeçalhos e redirecionamentos em `vercel.json`.

## Mapa do código
| Caminho | Papel |
|---|---|
| `src/main.tsx`, `src/App.tsx` | Entrada e rotas; páginas carregadas sob demanda (`lazy`) |
| `src/pages/` | Páginas públicas |
| `src/components/` | Layout, cabeçalho, rodapé, SEO, schema.org, botões de agendamento, aviso de cookies |
| `src/admin/` | Painel `/admin`, pacote separado carregado só nessa rota |
| `src/lib/dados.ts` | Carrega os dados públicos do Supabase e cai para `seed.ts` se falhar |
| `src/lib/textoSeguro.ts` | Descarta links `javascript:`/`data:` vindos do banco |
| `src/lib/analytics.ts` | GA4, GTM e Meta Pixel condicionados ao consentimento |
| `src/lib/constantes.ts` | Nome, títulos aprovados pelo CFM, dados da clínica |
| `src/seo-rotas.json` | Títulos e descrições por rota, usados também no prerender |
| `scripts/checar-termos.mjs` + `termos-cfm.mjs` | Trava de ética médica no build |
| `scripts/prerender.mjs` | Gera HTML por rota, sitemap e robots |
| `vite.config.ts` | Plugin `tag-google`: gera `/consentimento.js` e a tag do GA4 |
| `supabase/migrations/` | Histórico do schema (0001 a 0006) |
| `supabase/functions/notificar-contato/` | Aviso por e-mail (Resend) a partir do id da mensagem |
| `eslint-rules/`, `eslint*.config.mjs` | Regras de lint do kit adaptadas |

## Fronteiras e fluxo
- O site público (`pages`, `components`, `lib`) não importa nada de `src/admin`. Componentes não importam o cliente Supabase; leem via `SiteDataContext`/`dados.ts`. O lint garante as duas regras.
- A única escrita pública é o formulário de contato: insere com um id gerado no navegador e chama a função `notificar-contato` com esse id. A função lê o resto com a service key.
- O painel usa o cliente Supabase direto, protegido por RLS com `privado.is_admin()`.

## Dados e migrações
- Tabelas públicas (só leitura para `anon`): `locais`, `horarios_local`, `excecoes`, `config_telemedicina`, `redes_sociais`, `faq`, `avisos`, `conteudo_site`.
- `mensagens_contato`: `anon` só insere colunas permitidas. O gatilho `privado.guardar_mensagem` fixa data e flags e limita os envios.
- `admins` e `admins_autorizados`: um usuário vira admin só depois de confirmar o e-mail (gatilho em `auth.users`).
- Migrações são aplicadas pelo dono ou com o pedido dele. Nunca no build.

## Decisões
- Vite em vez de Next.js: site pequeno, prerender próprio, hospedagem estática.
- Dados reais embutidos como plano B, para o site nunca ficar em branco.
- O script de consentimento fica num arquivo próprio, para a CSP não precisar de `unsafe-inline` em scripts.

## Manutenção
Atualize este arquivo quando mudar rotas, fronteiras, tabelas ou integrações.
