import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { IconeWhatsApp, IconeSetaCima, IconeX } from './Icones'
import { linkWhatsApp } from '../lib/whatsapp'
import { aplicar, lerConsentimento, rastrearWhatsApp, salvarConsentimento } from '../lib/analytics'
import { Link } from 'react-router-dom'
import { useSite } from '../lib/SiteDataContext'

const MSG_POR_PAGINA: [RegExp, string][] = [
  [/^\/telemedicina/, 'Olá! Vim pelo site e gostaria de agendar uma teleconsulta.'],
  [/^\/consultorio/, 'Olá! Vim pelo site e gostaria de agendar uma consulta presencial.'],
  [/^\/tratamentos\/emagrecimento/, 'Olá! Vim pelo site, pela página de emagrecimento, e gostaria de agendar uma consulta.'],
  [/^\/tratamentos\/performance/, 'Olá! Vim pelo site, pela página de performance e composição corporal, e gostaria de agendar uma consulta.'],
  [/^\/tratamentos\/longevidade/, 'Olá! Vim pelo site, pela página de longevidade, e gostaria de agendar uma consulta.'],
  [/^\/tratamentos\/endocrinologia/, 'Olá! Vim pelo site, pela página de endocrinologia, e gostaria de agendar uma consulta.'],
  [/^\/sobre/, 'Olá! Vim pelo site e gostaria de agendar uma consulta com o Dr. Rogato.'],
]

export function WhatsAppFlutuante() {
  const { pathname } = useLocation()
  const msg = MSG_POR_PAGINA.find(([r]) => r.test(pathname))?.[1] || 'Olá! Vim pelo site e gostaria de agendar uma consulta.'
  return (
    <a
      href={linkWhatsApp(msg)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar pelo WhatsApp"
      onClick={() => rastrearWhatsApp('botao-flutuante:' + pathname)}
      className="fixed bottom-5 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1F8F4E] text-white shadow-suave transition-transform hover:scale-105 md:bottom-6 md:right-6 md:h-16 md:w-16"
    >
      <IconeWhatsApp tamanho={30} />
    </a>
  )
}

export function VoltarAoTopo() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const f = () => setVisivel(window.scrollY > 800)
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  if (!visivel) return null
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Voltar ao topo"
      className="fixed bottom-24 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-marinho shadow-suave ring-1 ring-lilas hover:bg-lilas-100 md:bottom-28 md:right-8"
    >
      <IconeSetaCima tamanho={20} />
    </button>
  )
}

export function BannerCookies() {
  const [mostrar, setMostrar] = useState(false)
  const [prefs, setPrefs] = useState(false)
  const [analise, setAnalise] = useState(true)
  const [marketing, setMarketing] = useState(true)

  useEffect(() => {
    const c = lerConsentimento()
    if (!c) setMostrar(true)
    else {
      setAnalise(c.analise)
      setMarketing(c.marketing)
    }
    const abrir = () => {
      setMostrar(true)
      setPrefs(true)
    }
    window.addEventListener('drr:abrir-cookies', abrir)
    return () => window.removeEventListener('drr:abrir-cookies', abrir)
  }, [])

  const salvar = (a: boolean, m: boolean) => {
    aplicar(salvarConsentimento({ analise: a, marketing: m }))
    setMostrar(false)
    setPrefs(false)
    if ((!a || !m) && lerConsentimento()) {
      // Ao retirar consentimento, recarrega para descarregar scripts já ativos
      const antes = (window as Window & { gtag?: unknown; fbq?: unknown }).gtag || (window as Window & { fbq?: unknown }).fbq
      if (antes) window.location.reload()
    }
  }

  if (!mostrar) return null
  return (
    <div role="dialog" aria-live="polite" aria-label="Aviso de cookies" className="fixed inset-x-3 bottom-3 z-50 md:inset-x-auto md:left-6 md:bottom-6 md:max-w-md">
      <div className="rounded-3xl bg-white p-4 text-[13px] shadow-suave ring-1 ring-lilas md:p-6 md:text-sm">
        <div className="flex items-start justify-between gap-3">
          <p className="sr-only md:not-sr-only md:font-display md:text-base md:text-marinho">Sua privacidade</p>
          {prefs && (
            <button type="button" aria-label="Fechar preferências" onClick={() => setPrefs(false)} className="-m-2 p-2 text-marinho">
              <IconeX tamanho={18} />
            </button>
          )}
        </div>
        <p className="leading-relaxed text-grafite/80 md:mt-2">
          Usamos cookies essenciais para o site funcionar e, com a sua permissão, cookies de análise e marketing para entender as visitas e medir anúncios. Saiba mais na{' '}
          <Link to="/politica-de-cookies" className="link">Política de Cookies</Link>.
        </p>
        {prefs && (
          <fieldset className="mt-4 space-y-3">
            <legend className="sr-only">Preferências de cookies</legend>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked disabled className="mt-1 h-4 w-4 accent-marinho" />
              <span><strong className="font-medium">Essenciais</strong> (sempre ativos): funcionamento e segurança do site.</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked={analise} onChange={(e) => setAnalise(e.target.checked)} className="mt-1 h-4 w-4 accent-marinho" />
              <span><strong className="font-medium">Análise</strong>: Google Analytics e Tag Manager, para medir visitas.</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1 h-4 w-4 accent-marinho" />
              <span><strong className="font-medium">Marketing</strong>: Meta Pixel, para medir anúncios no Instagram e Facebook.</span>
            </label>
          </fieldset>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {prefs ? (
            <button type="button" className="btn-primario !min-h-[42px] flex-1" onClick={() => salvar(analise, marketing)}>Salvar preferências</button>
          ) : (
            <>
              <button type="button" className="btn-primario !min-h-[44px] flex-1 !px-4" onClick={() => salvar(true, true)}>Aceitar</button>
              <button type="button" className="btn-contorno !min-h-[44px] flex-1 !px-4" onClick={() => salvar(false, false)}>Rejeitar</button>
              <button type="button" className="min-h-[44px] px-2 text-center text-sm font-medium text-marinho underline underline-offset-4" onClick={() => setPrefs(true)}>Preferências</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function BarraAvisos() {
  const { avisos, locais } = useSite()
  const [fechado, setFechado] = useState(false)
  const itens = [
    ...avisos.map((a) => ({ id: a.id, texto: a.texto, link: a.link })),
    ...locais.flatMap((l) =>
      l.excecoes.map((e, i) => ({
        id: `${l.id}-${i}`,
        texto: `${l.cidade} (${l.nome}): ${textoCurto(e.data_inicio, e.data_fim, e.motivo)}`,
        link: '/consultorio',
      })),
    ),
  ]
  if (!itens.length || fechado) return null
  return (
    <div className="relative z-30 bg-lilas text-marinho">
      <div className="container-site flex items-start justify-between gap-3 py-2.5 text-sm">
        <ul className="space-y-1">
          {itens.map((a) => (
            <li key={a.id}>
              {a.link ? (
                a.link.startsWith('/') ? <Link to={a.link} className="hover:underline">{a.texto}</Link> : <a href={a.link} className="hover:underline">{a.texto}</a>
              ) : (
                a.texto
              )}
            </li>
          ))}
        </ul>
        <button type="button" aria-label="Fechar aviso" className="-m-1 p-1" onClick={() => setFechado(true)}>
          <IconeX tamanho={16} />
        </button>
      </div>
    </div>
  )
}

function textoCurto(i: string, f: string, motivo: string) {
  const br = (s: string) => s.split('-').reverse().slice(0, 2).join('/')
  return (i === f ? `sem atendimento em ${br(i)}` : `sem atendimento de ${br(i)} a ${br(f)}`) + (motivo ? ` (${motivo})` : '')
}
