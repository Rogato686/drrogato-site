import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import rotas from '../seo-rotas.json'
import { SITE_URL } from '../lib/constantes'

type Meta = { titulo: string; descricao: string }
const R = rotas as Record<string, Meta>

function setMeta(sel: string, attr: 'name' | 'property', chave: string, valor: string) {
  let el = document.head.querySelector<HTMLMetaElement>(sel)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, chave)
    document.head.appendChild(el)
  }
  el.content = valor
}

/** Atualiza título, descrição, canonical e Open Graph ao navegar (o build também gera HTML estático por rota). */
export function Seo({ titulo, descricao, noindex }: Partial<Meta> & { noindex?: boolean }) {
  const { pathname } = useLocation()
  useEffect(() => {
    const base = R[pathname] || R['/']
    const t = titulo || base.titulo
    const d = descricao || base.descricao
    const url = SITE_URL + (pathname === '/' ? '/' : pathname)
    document.title = t
    setMeta('meta[name="description"]', 'name', 'description', d)
    setMeta('meta[property="og:title"]', 'property', 'og:title', t)
    setMeta('meta[property="og:description"]', 'property', 'og:description', d)
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', t)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', d)
    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = url
  }, [pathname, titulo, descricao, noindex])
  return null
}
