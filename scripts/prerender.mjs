// Gera um HTML por rota com título, descrição, canonical e Open Graph próprios,
// além de sitemap.xml e robots.txt. Roda depois do `vite build`.
import fs from 'node:fs'
import path from 'node:path'
import { gerarSchema } from '../src/lib/schema.ts'
import { DADOS_PADRAO } from '../src/lib/seed.ts'

import { loadEnv } from 'vite'

const env = { ...loadEnv('production', path.resolve(import.meta.dirname, '..'), 'VITE_'), ...process.env }
const SITE = (env.VITE_SITE_URL || 'https://drrogato.com.br').replace(/\/$/, '')
const dist = path.resolve(import.meta.dirname, '../dist')
const rotas = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../src/seo-rotas.json'), 'utf8'))
const base = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const schema = `<script type="application/ld+json" id="schema-org">${JSON.stringify(gerarSchema(DADOS_PADRAO, SITE)).replace(/</g, '\\u003c')}</script>`

function pagina(rota, { titulo, descricao }) {
  const url = SITE + (rota === '/' ? '/' : rota)
  let h = base
    .replace(/<title>.*?<\/title>/s, `<title>${esc(titulo)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(descricao)}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(titulo)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(descricao)}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${esc(titulo)}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${esc(descricao)}`)
    .replace(/https:\/\/drrogato\.com\.br/g, SITE)
    .replace('<!--SCHEMA-->', schema)
  return h
}

for (const [rota, meta] of Object.entries(rotas)) {
  const arq = rota === '/' ? 'index.html' : `${rota.slice(1)}.html`
  const destino = path.join(dist, arq)
  fs.mkdirSync(path.dirname(destino), { recursive: true })
  fs.writeFileSync(destino, pagina(rota, meta))
}

// 404 e painel: não indexar
const naoIndexar = (h) => h.replace('<meta name="theme-color"', '<meta name="robots" content="noindex, nofollow" />\n    <meta name="theme-color"')
fs.writeFileSync(path.join(dist, '404.html'), naoIndexar(pagina('/404', { titulo: 'Página não encontrada | Dr. Rogato', descricao: rotas['/'].descricao })))
fs.writeFileSync(path.join(dist, 'admin.html'), naoIndexar(pagina('/admin', { titulo: 'Painel | Dr. Rogato', descricao: 'Área restrita.' })))

const hoje = new Date().toISOString().slice(0, 10)
const prioridade = (r) => (r === '/' ? '1.0' : ['/telemedicina', '/consultorio', '/tratamentos'].includes(r) || r.startsWith('/tratamentos/') ? '0.9' : r.startsWith('/politica') || r === '/termos-de-uso' ? '0.3' : '0.7')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(rotas)
  .map((r) => `  <url><loc>${SITE}${r === '/' ? '/' : r}</loc><lastmod>${hoje}</lastmod><priority>${prioridade(r)}</priority></url>`)
  .join('\n')}
</urlset>
`
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap)
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE}/sitemap.xml\n`)
console.log(`prerender: ${Object.keys(rotas).length} rotas, sitemap.xml e robots.txt gerados`)
