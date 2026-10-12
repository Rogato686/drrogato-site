// GA4 usa o Modo de Consentimento v2 (padrão negado, definido no <head> do index.html): a tag carrega sempre,
// mas só grava cookies depois do aceite. GTM e Meta Pixel só carregam depois do consentimento.
type W = Window & { __ga4?: string; dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; fbq?: ((...a: unknown[]) => void) & { q?: unknown[] } }
const w = () => window as W

export type Consentimento = { analise: boolean; marketing: boolean; data: string }
const CHAVE = 'drr_cookies'

export function lerConsentimento(): Consentimento | null {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) || 'null')
  } catch {
    return null
  }
}
export function salvarConsentimento(c: Omit<Consentimento, 'data'>) {
  const v = { ...c, data: new Date().toISOString() }
  try {
    localStorage.setItem(CHAVE, JSON.stringify(v))
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent('drr:consentimento', { detail: v }))
  return v
}

let ids = { ga4: '', gtm: '', pixel: '' }
const carregados = new Set<string>()

function script(src: string) {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  document.head.appendChild(s)
}

export function configurarAnalytics(novos: { ga4: string; gtm: string; pixel: string }) {
  ids = novos
  carregarGa4()
  aplicar(lerConsentimento())
}

function gtagBase() {
  const win = w()
  win.dataLayer = win.dataLayer || []
  win.gtag =
    win.gtag ||
    function () {
      // eslint-disable-next-line prefer-rest-params
      win.dataLayer!.push(arguments)
    }
  return win.gtag
}

// Carrega o GA4 do painel quando ele não veio embutido no HTML (VITE_GA4_ID).
function carregarGa4() {
  const win = w()
  const id = ids.ga4
  if (!id || win.__ga4 === id || carregados.has('ga4')) return
  carregados.add('ga4')
  const gtag = gtagBase()
  gtag('js', new Date())
  gtag('config', id)
  script(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`)
}

export function aplicar(c: Consentimento | null) {
  if (!c) return
  const win = w()
  const sim = (v: boolean) => (v ? 'granted' : 'denied')
  gtagBase()('consent', 'update', {
    analytics_storage: sim(c.analise),
    ad_storage: sim(c.marketing),
    ad_user_data: sim(c.marketing),
    ad_personalization: sim(c.marketing),
  })
  if (c.analise && ids.gtm && !carregados.has('gtm')) {
    carregados.add('gtm')
    win.dataLayer = win.dataLayer || []
    win.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
    script(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(ids.gtm)}`)
  }
  if (c.marketing && ids.pixel && !carregados.has('pixel')) {
    carregados.add('pixel')
    type Fbq = ((...a: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue: unknown[]; loaded: boolean; version: string; push: unknown }
    const fbq = function (...a: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...a)
      else fbq.queue.push(a)
    } as Fbq
    fbq.queue = []
    fbq.loaded = true
    fbq.version = '2.0'
    fbq.push = fbq
    win.fbq = fbq
    script('https://connect.facebook.net/en_US/fbevents.js')
    fbq('init', ids.pixel)
    fbq('track', 'PageView')
  }
}

// A primeira página já é contada pelo GA4 (config) e pelo Pixel (init). As trocas de página seguintes o GA4
// conta sozinho pela "medição otimizada" (histórico do navegador), então aqui só avisamos GTM e Pixel.
let primeiraPagina = true
export function rastrearPagina(caminho: string) {
  if (primeiraPagina) {
    primeiraPagina = false
    return
  }
  const win = w()
  win.dataLayer?.push({ event: 'page_view', page_path: caminho })
  if (carregados.has('pixel')) win.fbq?.('track', 'PageView')
}

export function rastrearAgendamento(d: { modalidade: string; rotulo: string; local?: string }) {
  const win = w()
  win.gtag?.('event', 'agendar_clique', { modalidade: d.modalidade, rotulo: d.rotulo, local: d.local })
  win.gtag?.('event', 'generate_lead', { method: 'whatsapp', modalidade: d.modalidade })
  win.dataLayer?.push({ event: 'agendar_clique', modalidade: d.modalidade, rotulo: d.rotulo, local: d.local })
  win.fbq?.('track', 'Contact', { modalidade: d.modalidade })
  win.fbq?.('track', 'Lead', { content_name: d.rotulo })
}

export function rastrearWhatsApp(origem: string) {
  const win = w()
  win.gtag?.('event', 'whatsapp_clique', { origem })
  win.dataLayer?.push({ event: 'whatsapp_clique', origem })
  win.fbq?.('track', 'Contact', { origem })
}
