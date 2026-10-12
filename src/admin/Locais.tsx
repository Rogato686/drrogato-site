import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { Excecao, Local } from '../lib/types'
import { enderecoCompleto, horariosPorDia, linkEmbedMaps } from '../lib/formatar'
import { IconeMais, IconeSetaCima, IconeX } from '../components/Icones'
import {
  Campo,
  Carregando,
  Chave,
  GradeSemanal,
  TituloPainel,
  btnIcone,
  btnPeq,
  btnPerigo,
  gradeDeHorarios,
  hm,
  horariosDaGrade,
  msgErro,
  normalizarUrl,
  urlValida,
  useToast,
  validarGrade,
  type Grade,
} from './ui'

const UFS = 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ')

const VAZIO: Local = {
  id: '',
  nome: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: 'MG',
  cep: '',
  maps_url: '',
  telefone: '',
  observacoes: '',
  agenda_url: '',
  ordem: 0,
  ativo: true,
  horarios: [],
  excecoes: [],
}

type LinhaBanco = Omit<Local, 'horarios' | 'excecoes'> & {
  horarios_local?: { dia_semana: number; inicio: string; fim: string }[]
  excecoes?: Excecao[]
}

function doBanco(l: LinhaBanco): Local {
  const { horarios_local, excecoes, ...resto } = l
  const r = { ...VAZIO } as Local
  for (const [k, v] of Object.entries(resto)) if (v !== null && k in VAZIO) (r as Record<string, unknown>)[k] = v
  r.horarios = (horarios_local || []).map((h) => ({ dia_semana: h.dia_semana, inicio: hm(h.inicio), fim: hm(h.fim) }))
  r.excecoes = (excecoes || [])
    .map((e) => ({ id: e.id, data_inicio: e.data_inicio, data_fim: e.data_fim, motivo: e.motivo || '' }))
    .sort((a, b) => a.data_inicio.localeCompare(b.data_inicio))
  return r
}

export default function Locais() {
  const toast = useToast()
  const [lista, setLista] = useState<Local[] | null>(null)
  const [editando, setEditando] = useState<Local | null>(null)
  const [ocupado, setOcupado] = useState(false)

  const carregar = useCallback(async () => {
    const { data, error } = await supabase!.from('locais').select('*, horarios_local(*), excecoes(*)').order('ordem').order('nome')
    if (error) {
      toast('erro', `Não foi possível carregar os consultórios: ${msgErro(error)}`)
      setLista([])
      return
    }
    setLista((data as LinhaBanco[]).map(doBanco))
  }, [toast])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function mover(i: number, dir: -1 | 1) {
    if (!lista) return
    const j = i + dir
    if (j < 0 || j >= lista.length) return
    const nova = [...lista]
    ;[nova[i], nova[j]] = [nova[j], nova[i]]
    const comOrdem = nova.map((l, k) => ({ ...l, ordem: k + 1 }))
    setLista(comOrdem)
    setOcupado(true)
    const mudaram = comOrdem.filter((l) => lista.find((x) => x.id === l.id)?.ordem !== l.ordem)
    const res = await Promise.all(mudaram.map((l) => supabase!.from('locais').update({ ordem: l.ordem }).eq('id', l.id)))
    setOcupado(false)
    const err = res.find((r) => r.error)?.error
    if (err) {
      toast('erro', `Erro ao reordenar: ${msgErro(err)}`)
      carregar()
    } else toast('ok', 'Ordem atualizada.')
  }

  async function alternarAtivo(l: Local) {
    setLista((ls) => ls && ls.map((x) => (x.id === l.id ? { ...x, ativo: !l.ativo } : x)))
    const { error } = await supabase!.from('locais').update({ ativo: !l.ativo }).eq('id', l.id)
    if (error) {
      toast('erro', `Erro ao alterar: ${msgErro(error)}`)
      carregar()
    } else toast('ok', `${l.nome} ${!l.ativo ? 'ativado' : 'desativado'} no site.`)
  }

  async function excluir(l: Local) {
    if (!window.confirm(`Excluir o consultório "${l.nome}"? Os horários e exceções dele também serão apagados. Esta ação não pode ser desfeita.`)) return
    const { error } = await supabase!.from('locais').delete().eq('id', l.id)
    if (error) toast('erro', `Erro ao excluir: ${msgErro(error)}`)
    else {
      toast('ok', 'Consultório excluído.')
      carregar()
    }
  }

  if (editando)
    return (
      <EditorLocal
        inicial={editando}
        proximaOrdem={(lista || []).reduce((m, l) => Math.max(m, l.ordem), 0) + 1}
        onFechar={(salvou) => {
          setEditando(null)
          if (salvou) carregar()
        }}
      />
    )

  return (
    <>
      <TituloPainel
        titulo="Consultórios"
        descricao="Locais de atendimento presencial exibidos no site. Use as setas para definir a ordem e a chave para mostrar ou ocultar."
        acoes={
          <button type="button" className="btn-primario" onClick={() => setEditando({ ...VAZIO })}>
            <IconeMais tamanho={18} /> Novo consultório
          </button>
        }
      />
      {!lista ? (
        <Carregando />
      ) : !lista.length ? (
        <div className="cartao text-center text-sm text-marinho-400">Nenhum consultório cadastrado.</div>
      ) : (
        <ul className="space-y-3">
          {lista.map((l, i) => (
            <li key={l.id} className={`cartao !p-4 md:!p-5 ${l.ativo ? '' : 'opacity-70'}`}>
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex flex-col gap-1">
                  <button type="button" className={btnIcone} disabled={i === 0 || ocupado} onClick={() => mover(i, -1)} aria-label={`Subir ${l.nome}`}>
                    <IconeSetaCima tamanho={18} />
                  </button>
                  <button
                    type="button"
                    className={btnIcone}
                    disabled={i === lista.length - 1 || ocupado}
                    onClick={() => mover(i, 1)}
                    aria-label={`Descer ${l.nome}`}
                  >
                    <IconeSetaCima tamanho={18} className="rotate-180" />
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg">{l.nome}</h2>
                  <p className="text-sm text-marinho-400">{l.endereco ? enderecoCompleto(l) : `${l.cidade}/${l.uf}`}</p>
                  <p className="mt-1 text-xs text-marinho-400">
                    {l.horarios.length ? horariosPorDia(l.horarios).map((d) => `${d.dia} ${d.faixas}`).join(' · ') : 'Sem horários cadastrados'}
                  </p>
                  {l.excecoes.length > 0 && <p className="mt-1 text-xs text-marinho-400">{l.excecoes.length} exceção(ões) cadastrada(s)</p>}
                </div>
                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                  <Chave ativo={l.ativo} onChange={() => alternarAtivo(l)} rotulo={l.ativo ? 'Ativo' : 'Inativo'} />
                  <button type="button" className={btnPeq} onClick={() => setEditando(l)}>
                    Editar
                  </button>
                  <button type="button" className={btnPerigo} onClick={() => excluir(l)}>
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function EditorLocal({ inicial, proximaOrdem, onFechar }: { inicial: Local; proximaOrdem: number; onFechar: (salvou: boolean) => void }) {
  const toast = useToast()
  const novo = !inicial.id
  const [f, setF] = useState<Local>(inicial)
  const [grade, setGrade] = useState<Grade>(() => gradeDeHorarios(inicial.horarios))
  const [excecoes, setExcecoes] = useState<Excecao[]>(inicial.excecoes)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [salvando, setSalvando] = useState(false)
  const [mapa, setMapa] = useState(() => (inicial.endereco && inicial.cidade ? inicial : null))

  const set = <K extends keyof Local>(k: K, v: Local[K]) => setF((x) => ({ ...x, [k]: v }))

  // Prévia do mapa só atualiza depois de uma pausa na digitação
  useEffect(() => {
    const t = setTimeout(() => setMapa(f.endereco.trim() && f.cidade.trim() ? f : null), 900)
    return () => clearTimeout(t)
  }, [f])

  function validar(): Record<string, string> {
    const e: Record<string, string> = {}
    if (!f.nome.trim()) e.nome = 'Informe o nome do local.'
    if (!f.cidade.trim()) e.cidade = 'Informe a cidade.'
    if (!/^[A-Z]{2}$/.test(f.uf)) e.uf = 'Use a sigla com 2 letras.'
    if (f.cep && !/^\d{5}-?\d{3}$/.test(f.cep.trim())) e.cep = 'Formato: 00000-000.'
    if (!urlValida(normalizarUrl(f.maps_url))) e.maps_url = 'Link inválido.'
    if (!urlValida(normalizarUrl(f.agenda_url))) e.agenda_url = 'Link inválido.'
    const g = validarGrade(grade)
    if (g) e.grade = g
    excecoes.forEach((x, i) => {
      if (!x.data_inicio || !x.data_fim) e.excecoes = `Exceção ${i + 1}: preencha as duas datas.`
      else if (x.data_fim < x.data_inicio) e.excecoes = `Exceção ${i + 1}: a data final é anterior à inicial.`
    })
    return e
  }

  async function salvar(ev: FormEvent) {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    if (Object.keys(e).length) {
      toast('erro', 'Revise os campos destacados antes de salvar.')
      return
    }
    setSalvando(true)
    try {
      const id = f.id || crypto.randomUUID()
      const cep = f.cep.trim().replace(/^(\d{5})(\d{3})$/, '$1-$2')
      const linha = {
        id,
        nome: f.nome.trim(),
        endereco: f.endereco.trim(),
        numero: f.numero.trim(),
        complemento: f.complemento.trim(),
        bairro: f.bairro.trim(),
        cidade: f.cidade.trim(),
        uf: f.uf,
        cep,
        maps_url: normalizarUrl(f.maps_url),
        telefone: f.telefone.trim(),
        observacoes: f.observacoes.trim(),
        agenda_url: normalizarUrl(f.agenda_url),
        ordem: novo ? proximaOrdem : f.ordem,
        ativo: f.ativo,
      }
      const r1 = await supabase!.from('locais').upsert(linha)
      if (r1.error) throw r1.error

      const r2 = await supabase!.from('horarios_local').delete().eq('local_id', id)
      if (r2.error) throw r2.error
      const hs = horariosDaGrade(grade).map((h) => ({ ...h, local_id: id }))
      if (hs.length) {
        const r3 = await supabase!.from('horarios_local').insert(hs)
        if (r3.error) throw r3.error
      }

      const r4 = await supabase!.from('excecoes').delete().eq('local_id', id)
      if (r4.error) throw r4.error
      if (excecoes.length) {
        const r5 = await supabase!
          .from('excecoes')
          .insert(excecoes.map((x) => ({ local_id: id, data_inicio: x.data_inicio, data_fim: x.data_fim, motivo: x.motivo.trim() })))
        if (r5.error) throw r5.error
      }
      toast('ok', novo ? 'Consultório criado.' : 'Consultório salvo.')
      onFechar(true)
    } catch (err) {
      toast('erro', `Erro ao salvar: ${msgErro(err)}`)
    } finally {
      setSalvando(false)
    }
  }

  const texto = (k: keyof Local, rotulo: string, opts: { dica?: string; tipo?: string; className?: string; auto?: string; ph?: string } = {}) => (
    <Campo rotulo={rotulo} dica={opts.dica} erro={erros[k as string]} className={opts.className}>
      {(p) => (
        <input
          {...p}
          type={opts.tipo || 'text'}
          className="campo"
          autoComplete={opts.auto || 'off'}
          placeholder={opts.ph}
          value={String(f[k] ?? '')}
          onChange={(e) => set(k, e.target.value as never)}
        />
      )}
    </Campo>
  )

  return (
    <form onSubmit={salvar} noValidate>
      <TituloPainel
        titulo={novo ? 'Novo consultório' : `Editar: ${inicial.nome}`}
        acoes={
          <button type="button" className={btnPeq} onClick={() => onFechar(false)}>
            Cancelar
          </button>
        }
      />
      <div className="space-y-6">
        <section className="cartao space-y-4" aria-labelledby="sec-id">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="sec-id" className="font-display text-lg">
              Identificação e endereço
            </h2>
            <Chave ativo={f.ativo} onChange={(v) => set('ativo', v)} rotulo={f.ativo ? 'Ativo no site' : 'Oculto no site'} />
          </div>
          {texto('nome', 'Nome do local', { ph: 'Ex.: Consultório Centro' })}
          <div className="grid gap-4 sm:grid-cols-6">
            {texto('endereco', 'Endereço (rua, avenida)', { className: 'sm:col-span-4' })}
            {texto('numero', 'Número', { className: 'sm:col-span-2' })}
            {texto('complemento', 'Complemento', { className: 'sm:col-span-3', ph: 'Sala, andar' })}
            {texto('bairro', 'Bairro', { className: 'sm:col-span-3' })}
            {texto('cidade', 'Cidade', { className: 'sm:col-span-3' })}
            <Campo rotulo="UF" erro={erros.uf} className="sm:col-span-1">
              {(p) => (
                <select {...p} className="campo" value={f.uf} onChange={(e) => set('uf', e.target.value)}>
                  {UFS.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              )}
            </Campo>
            {texto('cep', 'CEP', { className: 'sm:col-span-2', ph: '00000-000' })}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {texto('maps_url', 'Link do Google Maps (opcional)', {
              dica: 'Se ficar vazio, o mapa é gerado pelo endereço.',
              tipo: 'url',
            })}
            {texto('telefone', 'Telefone do local (opcional)', { tipo: 'tel', ph: '(33) 3333-3333' })}
            {texto('agenda_url', 'Link de agenda externa (opcional)', { tipo: 'url', className: 'sm:col-span-2' })}
          </div>
          <Campo rotulo="Observações" dica="Estacionamento, acessibilidade, convênios etc.">
            {(p) => <textarea {...p} rows={3} className="campo" value={f.observacoes} onChange={(e) => set('observacoes', e.target.value)} />}
          </Campo>
          {mapa && (
            <div>
              <p className="mb-1.5 text-sm font-medium text-marinho">Prévia do mapa</p>
              <iframe
                title={`Mapa de ${mapa.nome || 'consultório'}`}
                src={linkEmbedMaps(mapa)}
                className="h-56 w-full rounded-2xl border-0 bg-lilas-100"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </section>

        <section className="cartao" aria-labelledby="sec-grade">
          <h2 id="sec-grade" className="mb-1 font-display text-lg">
            Grade semanal
          </h2>
          <p className="mb-4 text-sm text-marinho-400">Marque os dias de atendimento e informe um ou mais intervalos em cada dia.</p>
          <GradeSemanal grade={grade} onChange={setGrade} />
          {erros.grade && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {erros.grade}
            </p>
          )}
        </section>

        <section className="cartao" aria-labelledby="sec-exc">
          <h2 id="sec-exc" className="mb-1 font-display text-lg">
            Exceções (férias, feriados, bloqueios)
          </h2>
          <p className="mb-4 text-sm text-marinho-400">O site mostra um aviso automático, por exemplo: "Sem atendimento de 20/12 a 05/01".</p>
          <div className="space-y-3">
            {excecoes.map((x, i) => (
              <fieldset key={i} className="grid gap-3 rounded-2xl border border-marinho-100 p-3 sm:grid-cols-[1fr_1fr_2fr_auto] sm:items-end">
                <legend className="sr-only">Exceção {i + 1}</legend>
                <Campo rotulo="De">
                  {(p) => (
                    <input
                      {...p}
                      type="date"
                      className="campo py-2"
                      value={x.data_inicio}
                      onChange={(e) =>
                        setExcecoes((l) => l.map((y, j) => (j === i ? { ...y, data_inicio: e.target.value, data_fim: y.data_fim || e.target.value } : y)))
                      }
                    />
                  )}
                </Campo>
                <Campo rotulo="Até">
                  {(p) => (
                    <input
                      {...p}
                      type="date"
                      className="campo py-2"
                      value={x.data_fim}
                      min={x.data_inicio || undefined}
                      onChange={(e) => setExcecoes((l) => l.map((y, j) => (j === i ? { ...y, data_fim: e.target.value } : y)))}
                    />
                  )}
                </Campo>
                <Campo rotulo="Motivo (opcional)">
                  {(p) => (
                    <input
                      {...p}
                      className="campo py-2"
                      placeholder="Férias, feriado…"
                      value={x.motivo}
                      onChange={(e) => setExcecoes((l) => l.map((y, j) => (j === i ? { ...y, motivo: e.target.value } : y)))}
                    />
                  )}
                </Campo>
                <button type="button" className={btnIcone} aria-label={`Remover exceção ${i + 1}`} onClick={() => setExcecoes((l) => l.filter((_, j) => j !== i))}>
                  <IconeX tamanho={18} />
                </button>
              </fieldset>
            ))}
            <button type="button" className={btnPeq} onClick={() => setExcecoes((l) => [...l, { data_inicio: '', data_fim: '', motivo: '' }])}>
              <IconeMais tamanho={16} /> Adicionar exceção
            </button>
            {erros.excecoes && (
              <p role="alert" className="text-sm text-red-700">
                {erros.excecoes}
              </p>
            )}
          </div>
        </section>

        <div className="sticky bottom-4 z-10 flex flex-wrap justify-end gap-2 rounded-full bg-white/90 p-2 shadow-suave backdrop-blur">
          <button type="button" className={btnPeq} onClick={() => onFechar(false)}>
            Cancelar
          </button>
          <button type="submit" className="btn-primario !min-h-[44px] !py-2" disabled={salvando}>
            {salvando ? 'Salvando…' : 'Salvar consultório'}
          </button>
        </div>
      </div>
    </form>
  )
}
