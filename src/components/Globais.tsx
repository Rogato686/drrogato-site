import { useEffect, useRef, useState } from 'react'
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
      className="fixed bottom-[calc(var(--altura-cookies,0px)+1.25rem)] right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1F8F4E] text-white shadow-suave transition-[transform,bottom] hover:scale-105 md:bottom-[calc(var(--altura-cookies,0px)+1.5rem)] md:right-6 md:h-16 md:w-16"
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
      className="fixed bottom-[calc(var(--altura-cookies,0px)+6rem)] right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-marinho shadow-suave ring-1 ring-lilas hover:bg-lilas-100 md:bottom-[calc(var(--altura-cookies,0px)+7rem)] md:right-8"
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

  // Expõe a altura da barra para o botão flutuante do WhatsApp e o "voltar ao topo" subirem enquanto ela aparece
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const raiz = document.documentElement
    const el = ref.current
    if (!mostrar || !el) {
      raiz.style.removeProperty('--altura-cookies')
      return
    }
    const medir = () => raiz.style.setProperty('--altura-cookies', `${el.offsetHeight}px`)
    medir()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(medir) : null
    ro?.observe(el)
    return () => {
      ro?.disconnect()
      raiz.style.removeProperty('--altura-cookies')
    }
  }, [mostrar, prefs])

  if (!mostrar) return null
  return (
    <div
      ref={ref}
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-lilas-300 bg-white/[0.97] shadow-[0_-6px_24px_-12px_rgba(20,47,90,0.25)] backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="container-site py-2 md:py-3">
        {prefs && (
          <div className="mx-auto max-w-2xl pb-3 pt-2">
            <div className="flex items-center justify-between gap-3">
              <p className="font-display text-base text-marinho">Preferências de cookies</p>
              <button type="button" aria-label="Fechar preferências" onClick={() => setPrefs(false)} className="-m-2 p-2 text-marinho">
                <IconeX tamanho={18} />
              </button>
            </div>
            <fieldset className="mt-3 space-y-3 text-sm">
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
            <button type="button" className="btn-primario mt-4 !min-h-[42px] w-full sm:w-auto" onClick={() => salvar(analise, marketing)}>Salvar preferências</button>
          </div>
        )}
        {!prefs && (
          <div className="flex items-center gap-2.5 md:justify-between md:gap-6">
            <p className="flex-1 text-[13px] leading-snug text-grafite/85 md:text-sm">
              <span className="md:hidden">
                Usamos <Link to="/politica-de-cookies" className="link" aria-label="Política de Cookies">cookies</Link> opcionais só com a sua permissão.{' '}
                <button type="button" className="link" onClick={() => setPrefs(true)}>Ajustar</button>
              </span>
              <span className="hidden md:inline">
                Usamos cookies essenciais para o site funcionar e, com a sua permissão, cookies de análise e marketing para entender as visitas e medir anúncios. Saiba mais na{' '}
                <Link to="/politica-de-cookies" className="link">Política de Cookies</Link>
                {' · '}
                <button type="button" className="link" onClick={() => setPrefs(true)}>Preferências</button>
              </span>
            </p>
            <div className="flex shrink-0 gap-2">
              <button type="button" className="btn-primario !min-h-[40px] !px-3 !py-2 !text-xs !tracking-wide md:!px-5" onClick={() => salvar(true, true)}>Aceitar</button>
              <button type="button" className="btn-contorno !min-h-[40px] !px-3 !py-2 !text-xs !tracking-wide md:!px-5" onClick={() => salvar(false, false)}>Rejeitar</button>
            </div>
          </div>
        )}
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
