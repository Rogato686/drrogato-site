import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { RedesSociais } from '../lib/types'
import { Campo, Carregando, TituloPainel, emailValido, msgErro, normalizarUrl, urlValida, useToast } from './ui'

const VAZIO: RedesSociais = { whatsapp: '', email: '', instagram: '', youtube: '', tiktok: '', facebook: '', linkedin: '', doctoralia: '' }

const REDES: { k: Exclude<keyof RedesSociais, 'whatsapp' | 'email'>; rotulo: string; dominio: RegExp; ex: string }[] = [
  { k: 'instagram', rotulo: 'Instagram', dominio: /(^|\.)instagram\.com$/, ex: 'https://www.instagram.com/usuario' },
  { k: 'youtube', rotulo: 'YouTube', dominio: /(^|\.)(youtube\.com|youtu\.be)$/, ex: 'https://www.youtube.com/@canal' },
  { k: 'tiktok', rotulo: 'TikTok', dominio: /(^|\.)tiktok\.com$/, ex: 'https://www.tiktok.com/@usuario' },
  { k: 'facebook', rotulo: 'Facebook', dominio: /(^|\.)(facebook\.com|fb\.com)$/, ex: 'https://www.facebook.com/pagina' },
  { k: 'linkedin', rotulo: 'LinkedIn', dominio: /(^|\.)linkedin\.com$/, ex: 'https://www.linkedin.com/in/perfil' },
  { k: 'doctoralia', rotulo: 'Doctoralia', dominio: /(^|\.)doctoralia\.com\.br$/, ex: 'https://www.doctoralia.com.br/…' },
]

/** 5533998735429 → (33) 99873-5429 */
export function formatarWhats(d: string) {
  const n = d.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '')
  if (n.length === 11) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`
  if (n.length === 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`
  return d
}

/** Aceita o número formatado e devolve só dígitos com 55, ou null se inválido. */
export function normalizarWhats(v: string): string | null {
  let d = v.replace(/\D/g, '')
  if (!d) return ''
  if (d.length === 10 || d.length === 11) d = `55${d}`
  return /^55\d{10,11}$/.test(d) ? d : null
}

export default function Contatos() {
  const toast = useToast()
  const [f, setF] = useState<RedesSociais | null>(null)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    supabase!
      .from('redes_sociais')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) toast('erro', `Não foi possível carregar: ${msgErro(error)}`)
        const r = { ...VAZIO }
        if (data) for (const k of Object.keys(VAZIO) as (keyof RedesSociais)[]) r[k] = data[k] || ''
        r.whatsapp = formatarWhats(r.whatsapp)
        setF(r)
      })
  }, [toast])

  if (!f) return <Carregando />

  async function salvar(ev: FormEvent) {
    ev.preventDefault()
    if (!f) return
    const e: Record<string, string> = {}
    const whats = normalizarWhats(f.whatsapp)
    if (whats === null) e.whatsapp = 'Número inválido. Informe DDD e número, ex.: (33) 99873-5429.'
    const email = f.email.trim().toLowerCase()
    if (!emailValido(email)) e.email = 'E-mail inválido.'
    const urls = {} as Record<string, string>
    for (const r of REDES) {
      const u = normalizarUrl(f[r.k])
      urls[r.k] = u
      if (!u) continue
      if (!urlValida(u)) e[r.k] = 'Link inválido.'
      else if (!r.dominio.test(new URL(u).hostname.toLowerCase())) e[r.k] = `O link não parece ser do ${r.rotulo}.`
    }
    setErros(e)
    if (Object.keys(e).length) return toast('erro', 'Revise os campos destacados antes de salvar.')
    setSalvando(true)
    const { error } = await supabase!.from('redes_sociais').upsert({ id: 1, whatsapp: whats, email, ...urls })
    setSalvando(false)
    if (error) return toast('erro', `Erro ao salvar: ${msgErro(error)}`)
    setF({ ...f, whatsapp: formatarWhats(whats || ''), email, ...urls })
    toast('ok', 'Contatos e redes salvos.')
  }

  const set = (k: keyof RedesSociais, v: string) => setF((x) => x && { ...x, [k]: v })

  return (
    <form onSubmit={salvar} noValidate>
      <TituloPainel titulo="Contatos e redes" descricao="Só os ícones das redes preenchidas aparecem no site." />
      <div className="space-y-6">
        <section className="cartao grid gap-4 sm:grid-cols-2">
          <Campo rotulo="WhatsApp" erro={erros.whatsapp} dica="Com DDD. Pode digitar com ou sem formatação.">
            {(p) => (
              <input
                {...p}
                type="tel"
                inputMode="tel"
                className="campo"
                placeholder="(33) 99873-5429"
                value={f.whatsapp}
                onChange={(e) => set('whatsapp', e.target.value)}
                onBlur={() => {
                  const n = normalizarWhats(f.whatsapp)
                  if (n) set('whatsapp', formatarWhats(n))
                }}
              />
            )}
          </Campo>
          <Campo rotulo="E-mail" erro={erros.email}>
            {(p) => <input {...p} type="email" className="campo" value={f.email} onChange={(e) => set('email', e.target.value)} />}
          </Campo>
        </section>
        <section className="cartao grid gap-4 sm:grid-cols-2">
          <h2 className="font-display text-lg sm:col-span-2">Redes sociais</h2>
          {REDES.map((r) => (
            <Campo key={r.k} rotulo={r.rotulo} erro={erros[r.k]} dica={erros[r.k] ? undefined : `Ex.: ${r.ex}`}>
              {(p) => <input {...p} type="url" className="campo" value={f[r.k]} onChange={(e) => set(r.k, e.target.value)} />}
            </Campo>
          ))}
        </section>
        <div className="flex justify-end">
          <button type="submit" className="btn-primario" disabled={salvando}>
            {salvando ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>
    </form>
  )
}
