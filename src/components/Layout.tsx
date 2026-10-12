import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { BannerCookies, VoltarAoTopo, WhatsAppFlutuante } from './Globais'
import { Seo } from './Seo'
import { SchemaOrg } from './SchemaOrg'
import { rastrearPagina } from '../lib/analytics'

export function Layout() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
    rastrearPagina(pathname)
  }, [pathname, hash])
  return (
    <>
      <Seo />
      <SchemaOrg />
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFlutuante />
      <VoltarAoTopo />
      <BannerCookies />
    </>
  )
}
