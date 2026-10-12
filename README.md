# drrogato.com.br

Site institucional do Dr. Rogato Abrantes de Quadros Filho (CRM-MG 83269), médico pós-graduado em Endocrinologia pelo IPEMED.

- React 18 + TypeScript + Tailwind + Vite, banco e login com Supabase, hospedagem na Vercel.
- Sem Supabase configurado, o site funciona com os dados reais embutidos (`src/lib/seed.ts`); o painel `/admin` exige o Supabase.
- `npm run build` checa termos proibidos (CFM), compila e gera HTML por rota, `sitemap.xml` e `robots.txt`.

Como publicar: veja [LEIA-ME-PUBLICACAO.md](LEIA-ME-PUBLICACAO.md).
