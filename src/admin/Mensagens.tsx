import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { MensagemContato } from '../lib/types'
import { IconeEmail, IconeTelefone, IconeWhatsApp } from '../components/Icones'
import { Campo, Carregando, TituloPainel, btnPeq, btnPerigo, msgErro, useToast } from './ui'

const MODALIDADES: Record<string, string> = { presencial: 'Presencial', online: 'Teleconsulta', duvida: 'Dúvida', '': 'Não informada' }

const dataHora = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

/** Data local AAAA-MM-DD de um timestamp, para comparar com os filtros de período. */
const diaLocal = (iso: string) => {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const semAcento = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function celulaCsv(v: string) {
  let s = v ?? ''
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}` // evita fórmulas ao abrir no Excel
  return /[";\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function exportarCsv(ms: MensagemContato[]) {
  const cab = ['Data', 'Nome', 'Telefone', 'E-mail', 'Cidade', 'Modalidade', 'Mensagem', 'Lida']
  const linhas = ms.map((m) => [dataHora(m.created_at), m.nome, m.telefone, m.email, m.cidade, MODALIDADES[m.modalidade] ?? m.modalidade, m.mensagem, m.lida ? 'Sim' : 'Não'])
  const csv = '﻿' + [cab, ...linhas].map((l) => l.map(celulaCsv).join(';')).join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `mensagens-site-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function Mensagens() {
  const toast = useToast()
  const [lista, setLista] = useState<MensagemContato[] | null>(null)
  const [texto, setTexto] = useState('')
  const [modalidade, setModalidade] = useState('todas')
  const [de, setDe] = useState('')
  const [ate, setAte] = useState('')
  const [status, setStatus] = useState<'todas' | 'nao-lidas' | 'lidas'>('todas')
  const [aberta, setAberta] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    const { data, error } = await supabase!.from('mensagens_contato').select('*').order('created_at', { ascending: false }).limit(2000)
    if (error) toast('erro', `Não foi possível carregar: ${msgErro(error)}`)
    setLista((data as MensagemContato[]) || [])
  }, [toast])
  useEffect(() => {
    carregar()
  }, [carregar])

  const filtradas = useMemo(() => {
    if (!lista) return []
    const q = semAcento(texto.trim())
    return lista.filter((m) => {
      if (modalidade !== 'todas' && m.modalidade !== modalidade) return false
      if (status === 'lidas' && !m.lida) return false
      if (status === 'nao-lidas' && m.lida) return false
      const dia = diaLocal(m.created_at)
      if (de && dia < de) return false
      if (ate && dia > ate) return false
      if (q && !semAcento([m.nome, m.telefone, m.email, m.cidade, m.mensagem].join(' ')).includes(q)) return false
      return true
    })
  }, [lista, texto, modalidade, de, ate, status])

  if (!lista) return <Carregando />
  const naoLidas = lista.filter((m) => !m.lida).length
  const temFiltro = texto || modalidade !== 'todas' || de || ate || status !== 'todas'

  async function marcar(m: MensagemContato, lida: boolean, silencioso = false) {
    const { error } = await supabase!.from('mensagens_contato').update({ lida }).eq('id', m.id)
    if (error) return toast('erro', `Erro ao atualizar: ${msgErro(error)}`)
    setLista((l) => l && l.map((x) => (x.id === m.id ? { ...x, lida } : x)))
    if (!silencioso) toast('ok', lida ? 'Marcada como lida.' : 'Marcada como não lida.')
  }

  async function excluir(m: MensagemContato) {
    if (!window.confirm(`Excluir a mensagem de ${m.nome}? Esta ação não pode ser desfeita.`)) return
    const { error } = await supabase!.from('mensagens_contato').delete().eq('id', m.id)
    if (error) return toast('erro', `Erro ao excluir: ${msgErro(error)}`)
    setLista((l) => l && l.filter((x) => x.id !== m.id))
    toast('ok', 'Mensagem excluída.')
  }

  function abrir(m: MensagemContato) {
    const nova = aberta === m.id ? null : m.id
    setAberta(nova)
    if (nova && !m.lida) marcar(m, true, true)
  }

  return (
    <>
      <TituloPainel
        titulo="Mensagens"
        descricao={`${lista.length} mensagem(ns) recebida(s) pelo formulário de contato, ${naoLidas} não lida(s).`}
        acoes={
          <>
            <button type="button" className={btnPeq} onClick={() => carregar().then(() => toast('ok', 'Lista atualizada.'))}>
              Atualizar
            </button>
            <button type="button" className="btn-primario !min-h-[40px] !py-2" disabled={!filtradas.length} onClick={() => exportarCsv(filtradas)}>
              Exportar CSV ({filtradas.length})
            </button>
          </>
        }
      />

      <section className="cartao mb-5 grid gap-4 !p-4 sm:grid-cols-2 md:!p-5 lg:grid-cols-5" aria-label="Filtros">
        <Campo rotulo="Buscar" className="sm:col-span-2 lg:col-span-1">
          {(p) => <input {...p} type="search" className="campo py-2" placeholder="Nome, telefone, cidade…" value={texto} onChange={(e) => setTexto(e.target.value)} />}
        </Campo>
        <Campo rotulo="Modalidade">
          {(p) => (
            <select {...p} className="campo py-2" value={modalidade} onChange={(e) => setModalidade(e.target.value)}>
              <option value="todas">Todas</option>
              <option value="presencial">Presencial</option>
              <option value="online">Teleconsulta</option>
              <option value="duvida">Dúvida</option>
              <option value="">Não informada</option>
            </select>
          )}
        </Campo>
        <Campo rotulo="Situação">
          {(p) => (
            <select {...p} className="campo py-2" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
              <option value="todas">Todas</option>
              <option value="nao-lidas">Não lidas</option>
              <option value="lidas">Lidas</option>
            </select>
          )}
        </Campo>
        <Campo rotulo="De">
          {(p) => <input {...p} type="date" className="campo py-2" value={de} max={ate || undefined} onChange={(e) => setDe(e.target.value)} />}
        </Campo>
        <Campo rotulo="Até">
          {(p) => <input {...p} type="date" className="campo py-2" value={ate} min={de || undefined} onChange={(e) => setAte(e.target.value)} />}
        </Campo>
        {temFiltro && (
          <div className="sm:col-span-2 lg:col-span-5">
            <button
              type="button"
              className="link text-sm"
              onClick={() => {
                setTexto('')
                setModalidade('todas')
                setDe('')
                setAte('')
                setStatus('todas')
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>

      <p className="sr-only" role="status">
        {filtradas.length} mensagem(ns) exibida(s)
      </p>
      {!filtradas.length ? (
        <div className="cartao text-center text-sm text-marinho-400">{lista.length ? 'Nenhuma mensagem com esses filtros.' : 'Nenhuma mensagem recebida ainda.'}</div>
      ) : (
        <ul className="space-y-2">
          {filtradas.map((m) => {
            const zap = m.telefone.replace(/\D/g, '')
            const zapIntl = zap.length === 10 || zap.length === 11 ? `55${zap}` : zap
            return (
              <li key={m.id} className={`rounded-2xl bg-white shadow-card ${m.lida ? '' : 'border-l-4 border-marinho'}`}>
                <button
                  type="button"
                  className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-left md:px-5"
                  aria-expanded={aberta === m.id}
                  onClick={() => abrir(m)}
                >
                  <span className={`min-w-0 flex-1 truncate ${m.lida ? 'text-grafite' : 'font-semibold text-marinho'}`}>
                    {!m.lida && <span className="sr-only">Não lida: </span>}
                    {m.nome}
                    {m.cidade && <span className="font-normal text-marinho-400"> · {m.cidade}</span>}
                  </span>
                  <span className="rounded-full bg-lilas-100 px-2 py-0.5 text-xs text-marinho">{MODALIDADES[m.modalidade] ?? m.modalidade}</span>
                  <span className="text-xs text-marinho-400">{dataHora(m.created_at)}</span>
                </button>
                {aberta === m.id && (
                  <div className="space-y-3 border-t border-lilas-200 px-4 py-4 text-sm md:px-5">
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      <a className="link inline-flex items-center gap-1.5" href={`tel:${zap}`}>
                        <IconeTelefone tamanho={16} /> {m.telefone}
                      </a>
                      <a className="link inline-flex items-center gap-1.5" href={`https://wa.me/${zapIntl}`} target="_blank" rel="noopener noreferrer">
                        <IconeWhatsApp tamanho={16} /> WhatsApp
                      </a>
                      {m.email && (
                        <a className="link inline-flex items-center gap-1.5" href={`mailto:${m.email}`}>
                          <IconeEmail tamanho={16} /> {m.email}
                        </a>
                      )}
                    </div>
                    {m.mensagem ? <p className="whitespace-pre-line rounded-xl bg-lilas-50 p-3">{m.mensagem}</p> : <p className="text-marinho-400">Sem mensagem.</p>}
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className={btnPeq} onClick={() => marcar(m, !m.lida)}>
                        Marcar como {m.lida ? 'não lida' : 'lida'}
                      </button>
                      <button type="button" className={btnPerigo} onClick={() => excluir(m)}>
                        Excluir
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
