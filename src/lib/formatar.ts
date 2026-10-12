import { DIAS } from './constantes'
import type { Horario, Local, Excecao } from './types'

export function enderecoCompleto(l: Local) {
  const linha1 = [l.endereco, l.numero].filter(Boolean).join(', ')
  const comp = l.complemento ? `, ${l.complemento}` : ''
  const bairro = l.bairro ? `, ${l.bairro}` : ''
  return `${linha1}${comp}${bairro}, ${l.cidade}/${l.uf}${l.cep ? `, CEP ${l.cep}` : ''}`
}

export function enderecoBusca(l: Local) {
  return `${l.endereco}, ${l.numero}, ${l.cidade} - ${l.uf}, ${l.cep}`
}

export const linkMaps = (l: Local) =>
  l.maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoBusca(l))}`
export const linkWaze = (l: Local) => `https://waze.com/ul?q=${encodeURIComponent(enderecoBusca(l))}&navigate=yes`
export const linkEmbedMaps = (l: Local) => `https://maps.google.com/maps?q=${encodeURIComponent(enderecoBusca(l))}&output=embed`

/** Agrupa horários por dia: [{ dia: 'Segunda', faixas: '08:00–14:00' }] */
export function horariosPorDia(hs: Horario[]) {
  const m = new Map<number, string[]>()
  for (const h of [...hs].sort((a, b) => a.dia_semana - b.dia_semana || a.inicio.localeCompare(b.inicio))) {
    if (!m.has(h.dia_semana)) m.set(h.dia_semana, [])
    m.get(h.dia_semana)!.push(`${h.inicio}–${h.fim}`)
  }
  // Segunda primeiro, domingo por último
  return [...m.entries()]
    .sort(([a], [b]) => ((a + 6) % 7) - ((b + 6) % 7))
    .map(([d, f]) => ({ dia: DIAS[d], diaNum: d, faixas: f.join(' e ') }))
}

export const dataBR = (iso: string) => {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}${y && new Date().getFullYear().toString() !== y ? `/${y}` : ''}`
}

export function textoExcecao(e: Excecao) {
  if (e.data_inicio === e.data_fim) return `Sem atendimento em ${dataBR(e.data_inicio)}${e.motivo ? ` (${e.motivo})` : ''}`
  return `Sem atendimento de ${dataBR(e.data_inicio)} a ${dataBR(e.data_fim)}${e.motivo ? ` (${e.motivo})` : ''}`
}
