# drrogato.com.br

Site institucional do Dr. Rogato Abrantes de Quadros Filho (CRM-MG 83269), médico pós-graduado em Endocrinologia pelo IPEMED, NÃO ESPECIALISTA.

React 18 + TypeScript + Tailwind + Vite, banco e login com Supabase, hospedagem na Vercel. Sem Supabase configurado, o site usa os dados reais embutidos (`src/lib/seed.ts`); o painel `/admin` exige o Supabase.

## Rodar

```
npm ci
npm run dev      # desenvolvimento
npm run check    # lint, tipos, autoteste das regras, testes e build
```

`npm run build` checa os termos proibidos pelo CFM, compila e gera HTML por rota, `sitemap.xml` e `robots.txt`.

## Documentação

| Arquivo | Conteúdo |
|---|---|
| `PRODUCT.md` | O que o site faz, regras CFM/LGPD e critérios de aceite |
| `AGENTS.md` / `CLAUDE.md` | Instruções para agentes de IA |
| `docs/architecture.md` | Mapa do código, dados e decisões |
| `docs/design.md` | Marca, componentes e acessibilidade |
| `docs/onboarding.md` | Como preparar contas, publicar e rodar localmente |
| `docs/quality.md` | O que cada checagem prova, dívida medida e avaliações |
| `docs/setup.md` | Kit de desenvolvimento com IA: decisões e evidências |

## Próxima entrega
Ver as pendências em `docs/setup.md`.
