import { DADOS_PADRAO } from './seed'
import type { Local } from './types'
import { rastrearAgendamento } from './analytics'

const CHAVE = 'drr_origem'

/** Guarda UTM e gclid da primeira página visitada, para acrescentar a origem na mensagem. */
export function capturarOrigem() {
  try {
    const p = new URLSearchParams(window.location.search)
    const utm: Record<string, string> = {}
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid']) {
      const v = p.get(k)
      if (v) utm[k] = v
    }
    if (Object.keys(utm).length) sessionStorage.setItem(CHAVE, JSON.stringify(utm))
    else if (!sessionStorage.getItem(CHAVE) && document.referrer && !document.referrer.includes(location.host)) {
      sessionStorage.setItem(CHAVE, JSON.stringify({ referrer: new URL(document.referrer).hostname }))
    }
  } catch {
    /* navegação privada */
  }
}

export function textoOrigem(): string {
  let o: Record<string, string> = {}
  try {
    o = JSON.parse(sessionStorage.getItem(CHAVE) || '{}')
  } catch {
    return ''
  }
  const fonte = (o.utm_source || '').toLowerCase()
  let nome = ''
  if (o.gclid || fonte.includes('google')) nome = 'Google'
  else if (o.fbclid || fonte.includes('instagram') || fonte === 'ig') nome = 'Instagram'
  else if (fonte.includes('facebook') || fonte === 'fb' || fonte.includes('meta')) nome = 'Facebook'
  else if (fonte) nome = o.utm_source
  else if (o.referrer) {
    const r = o.referrer
    nome = r.includes('google') ? 'Google' : r.includes('instagram') ? 'Instagram' : r.includes('facebook') ? 'Facebook' : r
  }
  if (!nome) return ''
  const camp = o.utm_campaign ? `, campanha ${o.utm_campaign}` : ''
  return ` (Vim do ${nome}${camp}.)`
}

let numero = DADOS_PADRAO.redes.whatsapp
export const definirNumeroWhatsApp = (n: string) => {
  if (n) numero = n.replace(/\D/g, '')
}

export function linkWhatsApp(mensagem: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem + textoOrigem())}`
}

export type Modalidade = 'presencial' | 'online' | 'geral'

export function mensagemAgendamento(modalidade: Modalidade, local?: Pick<Local, 'nome' | 'cidade'>) {
  if (modalidade === 'online') return 'Olá! Vim pelo site e gostaria de agendar uma teleconsulta.'
  if (modalidade === 'presencial') {
    if (local) return `Olá! Vim pelo site e gostaria de agendar uma consulta presencial em ${local.cidade} (${local.nome}).`
    return 'Olá! Vim pelo site e gostaria de agendar uma consulta presencial.'
  }
  return 'Olá! Vim pelo site e gostaria de agendar uma consulta.'
}

/** Destino de um botão "Agendar": agenda externa do local (fase 2) ou WhatsApp. */
export function destinoAgendamento(modalidade: Modalidade, opts: { local?: Local; agendaTele?: string } = {}) {
  if (modalidade === 'presencial' && opts.local?.agenda_url) return opts.local.agenda_url
  if (modalidade === 'online' && opts.agendaTele) return opts.agendaTele
  return linkWhatsApp(mensagemAgendamento(modalidade, opts.local))
}

export function aoClicarAgendar(modalidade: Modalidade, rotulo: string, local?: string) {
  rastrearAgendamento({ modalidade, rotulo, local })
}
