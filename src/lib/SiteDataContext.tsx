import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { carregarDadosSite } from './dados'
import { DADOS_PADRAO } from './seed'
import type { SiteData } from './types'
import { definirNumeroWhatsApp } from './whatsapp'
import { configurarAnalytics } from './analytics'
import { supabase } from './supabase'

type Ctx = SiteData & { carregando: boolean; recarregar: () => void }
const C = createContext<Ctx>({ ...DADOS_PADRAO, carregando: false, recarregar: () => {} })

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [dados, setDados] = useState<SiteData>(ordenar(DADOS_PADRAO))
  const [carregando, setCarregando] = useState(Boolean(supabase))
  const [versao, setVersao] = useState(0)

  useEffect(() => {
    let vivo = true
    carregarDadosSite()
      .then((d) => {
        if (!vivo) return
        setDados(ordenar(d))
        definirNumeroWhatsApp(d.redes.whatsapp)
        configurarAnalytics({ ga4: d.conteudo.ga4_id, gtm: d.conteudo.gtm_id, pixel: d.conteudo.meta_pixel_id })
      })
      .catch((e) => console.warn(e))
      .finally(() => vivo && setCarregando(false))
    return () => {
      vivo = false
    }
  }, [versao])

  // Mudanças salvas no painel aparecem na hora (Supabase Realtime)
  useEffect(() => {
    if (!supabase) return
    const canal = supabase
      .channel('site-publico')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => setVersao((v) => v + 1))
      .subscribe()
    return () => {
      supabase?.removeChannel(canal)
    }
  }, [])

  return <C.Provider value={{ ...dados, carregando, recarregar: () => setVersao((v) => v + 1) }}>{children}</C.Provider>
}

export const useSite = () => useContext(C)

function ordenar(d: SiteData): SiteData {
  return { ...d, locais: [...d.locais].sort((a, b) => a.ordem - b.ordem), faq: [...d.faq].sort((a, b) => a.ordem - b.ordem) }
}
