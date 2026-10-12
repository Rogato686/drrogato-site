import { supabase } from './supabase'
import { DADOS_PADRAO } from './seed'
import type { SiteData, Local, Horario } from './types'

const hm = (t: string) => (t || '').slice(0, 5)

/** Carrega tudo o que o site público precisa. Sem Supabase, devolve os dados padrão reais. */
export async function carregarDadosSite(): Promise<SiteData> {
  if (!supabase) return DADOS_PADRAO
  const [locais, horarios, excecoes, tele, redes, faq, avisos, conteudo] = await Promise.all([
    supabase.from('locais').select('*').eq('ativo', true).order('ordem'),
    supabase.from('horarios_local').select('*').order('dia_semana').order('inicio'),
    supabase.from('excecoes').select('*').gte('data_fim', new Date().toISOString().slice(0, 10)).order('data_inicio'),
    supabase.from('config_telemedicina').select('*').eq('id', 1).maybeSingle(),
    supabase.from('redes_sociais').select('*').eq('id', 1).maybeSingle(),
    supabase.from('faq').select('*').eq('ativo', true).order('ordem'),
    supabase.from('avisos').select('*').eq('ativo', true),
    supabase.from('conteudo_site').select('*').eq('id', 1).maybeSingle(),
  ])
  if (locais.error || redes.error || conteudo.error) {
    console.warn('Supabase indisponível, usando dados padrão', locais.error || redes.error || conteudo.error)
    return DADOS_PADRAO
  }
  const ls: Local[] = (locais.data || []).map((l) => ({
    ...DADOS_PADRAO.locais[0],
    ...nulos(l),
    horarios: (horarios.data || [])
      .filter((h) => h.local_id === l.id)
      .map((h): Horario => ({ dia_semana: h.dia_semana, inicio: hm(h.inicio), fim: hm(h.fim) })),
    excecoes: (excecoes.data || []).filter((e) => e.local_id === l.id || e.local_id === null),
  }))
  const t = tele.data ? nulos(tele.data) : null
  return {
    locais: ls,
    telemedicina: t
      ? {
          ativo: t.ativo,
          observacoes: t.observacoes,
          agenda_url: t.agenda_url,
          horarios: (t.horarios || []).map((h: Horario) => ({ ...h, inicio: hm(h.inicio), fim: hm(h.fim) })),
        }
      : DADOS_PADRAO.telemedicina,
    redes: redes.data ? { ...DADOS_PADRAO.redes, ...nulos(redes.data) } : DADOS_PADRAO.redes,
    faq: faq.data && faq.data.length ? faq.data : DADOS_PADRAO.faq,
    avisos: (avisos.data || []).filter((a) => vigente(a.inicio, a.fim)),
    conteudo: conteudo.data ? { ...DADOS_PADRAO.conteudo, ...nulos(conteudo.data) } : DADOS_PADRAO.conteudo,
  }
}

function nulos<T extends Record<string, unknown>>(o: T): T {
  const r: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(o)) r[k] = v === null ? '' : v
  return r as T
}

function vigente(inicio: string | null, fim: string | null) {
  const hoje = new Date().toISOString().slice(0, 10)
  return (!inicio || inicio <= hoje) && (!fim || fim >= hoje)
}
