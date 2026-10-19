# Design e acessibilidade

## Direção
Sóbrio, clínico e acolhedor, em português do Brasil. Feito primeiro para o celular. O texto segue o CFM: informativo, sem promessa de resultado.

## Sistema existente
- Cores (`tailwind.config.js`): `marinho` (#142F5A), `lilas` (#D0D2E3) e `grafite` (#2B2B2D), com escalas.
- Fontes: Jost (títulos, `font-display`) e Inter (texto), servidas pelo próprio site via `@fontsource` (importadas em `src/main.tsx`).
- Logo: `public/logo/`, versões horizontal, vertical e símbolo, em azul e branco. Use a versão sem tagline.
- Classes utilitárias em `src/index.css`: `btn-primario`, `btn-contorno`, `link`, `shadow-card`, `shadow-suave`.
- Componentes: `Header`, `Footer`, `Secoes`, `Hexagono` (foto), `BotaoAgendar`, `RedesSociais`. O painel tem os seus em `src/admin/ui.tsx`.

## Interação
- Ações principais abrem o WhatsApp em nova aba (`rel="noopener noreferrer"`).
- O formulário mostra os erros ligados aos campos com `aria-describedby`.
- O aviso de cookies aparece até a pessoa escolher, e a escolha pode ser revista.

## Layout e revisão
- Largura máxima de 1200px. Celular a partir de 360px.
- Antes de entregar uma mudança visual, use a skill `web-design-guidelines` e abra o build no Playwright em 390px e 1280px.
- Lighthouse de referência (12/10/2026, celular): 98/100/100/100.

## Manutenção
Registre aqui cores, componentes ou padrões novos.
