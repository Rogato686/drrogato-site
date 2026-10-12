import { useEffect } from 'react'
import { useSite } from '../lib/SiteDataContext'
import { gerarSchema } from '../lib/schema'
import { SITE_URL } from '../lib/constantes'

/** Mantém os dados estruturados em dia com o banco (o build já grava uma versão inicial no HTML). */
export function SchemaOrg() {
  const { locais, redes, carregando } = useSite()
  useEffect(() => {
    if (carregando) return
    let el = document.getElementById('schema-org') as HTMLScriptElement | null
    if (!el) {
      el = document.createElement('script')
      el.type = 'application/ld+json'
      el.id = 'schema-org'
      document.head.appendChild(el)
    }
    el.textContent = JSON.stringify(gerarSchema({ locais, redes }, SITE_URL))
  }, [locais, redes, carregando])
  return null
}
