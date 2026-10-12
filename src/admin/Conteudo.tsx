import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { Aviso, ConteudoSite, FaqItem } from '../lib/types'
import { IconeMais, IconeSetaCima, IconeX } from '../components/Icones'
import { Campo, Carregando, Chave, TituloPainel, btnIcone, btnPeq, btnPerigo, msgErro, normalizarUrl, urlValida, useToast } from './ui'

/* ---------- conteudo_site (linha única) ---------- */

function useConteudo() {
  const toast = useToast()
  const [c, setC] = useState<ConteudoSite | null>(null)
  const [salvando, setSalvando] = useState(false)
  useEffect(() => {
    supabase!
      .from('conteudo_site')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) toast('erro', `Não foi possível carregar: ${msgErro(error)}`)
        setC({
          hero_titulo: data?.hero_titulo || '',
          hero_subtitulo: data?.hero_subtitulo || '',
          instagram_posts: Array.isArray(data?.instagram_posts) ? data.instagram_posts : [],
          ga4_id: data?.ga4_id || '',
          gtm_id: data?.gtm_id || '',
          meta_pixel_id: data?.meta_pixel_id || '',
        })
      })
  }, [toast])
  async function salvar(campos: Partial<ConteudoSite>, ok: string) {
    setSalvando(true)
    const { error } = await supabase!.from('conteudo_site').upsert({ id: 1, ...campos })
    setSalvando(false)
    if (error) {
      toast('erro', `Erro ao salvar: ${msgErro(error)}`)
      return false
    }
    setC((x) => x && { ...x, ...campos })
    toast('ok', ok)
    return true
  }
  return { c, setC, salvar, salvando }
}

function BotaoSalvar({ salvando, rotulo = 'Salvar' }: { salvando: boolean; rotulo?: string }) {
  return (
    <div className="flex justify-end">
      <button type="submit" className="btn-primario" disabled={salvando}>
        {salvando ? 'Salvando…' : rotulo}
      </button>
    </div>
  )
}

export function Hero() {
  const { c, setC, salvar, salvando } = useConteudo()
  if (!c) return <Carregando />
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        salvar({ hero_titulo: c.hero_titulo.trim(), hero_subtitulo: c.hero_subtitulo.trim() }, 'Textos do hero salvos.')
      }}
    >
      <TituloPainel titulo="Hero" descricao="Título e subtítulo da primeira dobra da página inicial. Se ficarem vazios, o site usa o texto padrão." />
      <section className="cartao mb-6 space-y-4">
        <Campo rotulo="Título" dica={`${c.hero_titulo.length}/120 caracteres. Evite promessas de resultado.`}>
          {(p) => <input {...p} maxLength={120} className="campo" value={c.hero_titulo} onChange={(e) => setC({ ...c, hero_titulo: e.target.value })} />}
        </Campo>
        <Campo rotulo="Subtítulo" dica={`${c.hero_subtitulo.length}/300 caracteres.`}>
          {(p) => (
            <textarea {...p} maxLength={300} rows={3} className="campo" value={c.hero_subtitulo} onChange={(e) => setC({ ...c, hero_subtitulo: e.target.value })} />
          )}
        </Campo>
      </section>
      <BotaoSalvar salvando={salvando} />
    </form>
  )
}

const urlPostInstagram = (u: string) => /^https:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[\w-]+\/?(\?.*)?$/.test(u)

export function Instagram() {
  const { c, setC, salvar, salvando } = useConteudo()
  const [erro, setErro] = useState('')
  if (!c) return <Carregando />
  const posts = c.instagram_posts.length ? c.instagram_posts : []
  const setPosts = (ps: string[]) => setC({ ...c, instagram_posts: ps })

  function enviar(e: FormEvent) {
    e.preventDefault()
    if (!c) return
    const limpos = c.instagram_posts.map((u) => normalizarUrl(u).split('?')[0]).filter(Boolean)
    const ruim = limpos.findIndex((u) => !urlPostInstagram(u))
    if (ruim >= 0) {
      setErro(`Publicação ${ruim + 1}: use o link de um post ou reel, ex.: https://www.instagram.com/p/XXXXXXXX/`)
      return
    }
    setErro('')
    salvar({ instagram_posts: [...new Set(limpos)] }, 'Publicações do Instagram salvas.')
  }

  return (
    <form noValidate onSubmit={enviar}>
      <TituloPainel
        titulo="Instagram"
        descricao="Publicações exibidas no site. Abra o post no Instagram, toque em compartilhar, copie o link e cole aqui. A ordem da lista é a ordem no site."
      />
      <section className="cartao mb-6 space-y-3">
        {posts.map((u, i) => (
          <div key={i} className="flex items-end gap-2">
            <Campo rotulo={`Publicação ${i + 1}`} className="flex-1">
              {(p) => (
                <input
                  {...p}
                  type="url"
                  className="campo"
                  placeholder="https://www.instagram.com/p/…"
                  value={u}
                  onChange={(e) => setPosts(posts.map((x, j) => (j === i ? e.target.value : x)))}
                />
              )}
            </Campo>
            <button type="button" className={btnIcone} disabled={i === 0} aria-label={`Subir publicação ${i + 1}`} onClick={() => setPosts(trocar(posts, i, i - 1))}>
              <IconeSetaCima tamanho={18} />
            </button>
            <button type="button" className={btnIcone} aria-label={`Remover publicação ${i + 1}`} onClick={() => setPosts(posts.filter((_, j) => j !== i))}>
              <IconeX tamanho={18} />
            </button>
          </div>
        ))}
        {!posts.length && <p className="text-sm text-marinho-400">Nenhuma publicação cadastrada. O site mostra apenas o link para o perfil.</p>}
        <button type="button" className={btnPeq} onClick={() => setPosts([...posts, ''])}>
          <IconeMais tamanho={16} /> Adicionar publicação
        </button>
        {erro && (
          <p role="alert" className="text-sm text-red-700">
            {erro}
          </p>
        )}
      </section>
      <BotaoSalvar salvando={salvando} />
    </form>
  )
}

export function Rastreamento() {
  const { c, setC, salvar, salvando } = useConteudo()
  const [erros, setErros] = useState<Record<string, string>>({})
  if (!c) return <Carregando />
  const campos = [
    { k: 'ga4_id' as const, rotulo: 'Google Analytics 4 (ID de métricas)', dica: 'Formato G-XXXXXXXXXX', re: /^G-[A-Z0-9]{4,}$/ },
    { k: 'gtm_id' as const, rotulo: 'Google Tag Manager (ID do contêiner)', dica: 'Formato GTM-XXXXXXX', re: /^GTM-[A-Z0-9]{4,}$/ },
    { k: 'meta_pixel_id' as const, rotulo: 'Meta Pixel (ID do pixel)', dica: 'Somente números, ex.: 123456789012345', re: /^\d{8,20}$/ },
  ]
  function enviar(e: FormEvent) {
    e.preventDefault()
    if (!c) return
    const err: Record<string, string> = {}
    const valores = {} as Record<(typeof campos)[number]['k'], string>
    for (const f of campos) {
      const v = c[f.k].trim().toUpperCase()
      valores[f.k] = v
      if (v && !f.re.test(v)) err[f.k] = `Formato inválido. ${f.dica}.`
    }
    setErros(err)
    if (Object.keys(err).length) return
    salvar(valores, 'Códigos de rastreamento salvos.')
  }
  return (
    <form noValidate onSubmit={enviar}>
      <TituloPainel
        titulo="Rastreamento"
        descricao="Códigos de medição do site. Eles só são carregados para visitantes que aceitarem os cookies de análise. Deixe em branco para não usar."
      />
      <section className="cartao mb-6 space-y-4">
        {campos.map((f) => (
          <Campo key={f.k} rotulo={f.rotulo} dica={f.dica} erro={erros[f.k]}>
            {(p) => (
              <input
                {...p}
                className="campo font-mono"
                autoCapitalize="characters"
                spellCheck={false}
                value={c[f.k]}
                onChange={(e) => setC({ ...c, [f.k]: e.target.value })}
              />
            )}
          </Campo>
        ))}
      </section>
      <BotaoSalvar salvando={salvando} />
    </form>
  )
}

function trocar<T>(l: T[], i: number, j: number) {
  const n = [...l]
  ;[n[i], n[j]] = [n[j], n[i]]
  return n
}

/* ---------- FAQ ---------- */

type Pagina = FaqItem['pagina']

export function Faq() {
  const toast = useToast()
  const [lista, setLista] = useState<FaqItem[] | null>(null)
  const [pagina, setPagina] = useState<Pagina>('home')
  const [editando, setEditando] = useState<string | null>(null) // id ou 'novo'
  const [ocupado, setOcupado] = useState(false)

  const carregar = useCallback(async () => {
    const { data, error } = await supabase!.from('faq').select('*').order('ordem')
    if (error) toast('erro', `Não foi possível carregar: ${msgErro(error)}`)
    setLista((data as FaqItem[]) || [])
  }, [toast])
  useEffect(() => {
    carregar()
  }, [carregar])

  if (!lista) return <Carregando />
  const daPagina = lista.filter((f) => f.pagina === pagina)

  async function mover(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= daPagina.length) return
    const nova = trocar(daPagina, i, j).map((f, k) => ({ ...f, ordem: k + 1 }))
    const mudaram = nova.filter((f) => daPagina.find((x) => x.id === f.id)?.ordem !== f.ordem)
    setLista((l) => l && l.map((f) => nova.find((x) => x.id === f.id) || f).sort((a, b) => a.ordem - b.ordem))
    setOcupado(true)
    const res = await Promise.all(mudaram.map((f) => supabase!.from('faq').update({ ordem: f.ordem }).eq('id', f.id)))
    setOcupado(false)
    const err = res.find((r) => r.error)?.error
    if (err) {
      toast('erro', `Erro ao reordenar: ${msgErro(err)}`)
      carregar()
    } else toast('ok', 'Ordem atualizada.')
  }

  async function alternar(f: FaqItem) {
    const { error } = await supabase!.from('faq').update({ ativo: !f.ativo }).eq('id', f.id)
    if (error) return toast('erro', `Erro ao alterar: ${msgErro(error)}`)
    setLista((l) => l && l.map((x) => (x.id === f.id ? { ...x, ativo: !f.ativo } : x)))
    toast('ok', !f.ativo ? 'Pergunta visível no site.' : 'Pergunta ocultada.')
  }

  async function excluir(f: FaqItem) {
    if (!window.confirm(`Excluir a pergunta "${f.pergunta}"?`)) return
    const { error } = await supabase!.from('faq').delete().eq('id', f.id)
    if (error) return toast('erro', `Erro ao excluir: ${msgErro(error)}`)
    setLista((l) => l && l.filter((x) => x.id !== f.id))
    toast('ok', 'Pergunta excluída.')
  }

  async function salvar(item: FaqItem) {
    const novo = !item.id
    const linha = {
      ...(novo ? {} : { id: item.id }),
      pagina: item.pagina,
      pergunta: item.pergunta.trim(),
      resposta: item.resposta.trim(),
      ativo: item.ativo,
      ordem: novo ? lista!.filter((f) => f.pagina === item.pagina).reduce((m, f) => Math.max(m, f.ordem), 0) + 1 : item.ordem,
    }
    const { error } = novo ? await supabase!.from('faq').insert(linha) : await supabase!.from('faq').update(linha).eq('id', item.id)
    if (error) {
      toast('erro', `Erro ao salvar: ${msgErro(error)}`)
      return false
    }
    toast('ok', novo ? 'Pergunta adicionada.' : 'Pergunta salva.')
    setEditando(null)
    carregar()
    return true
  }

  return (
    <>
      <TituloPainel
        titulo="Perguntas frequentes"
        descricao="Perguntas exibidas na página inicial e na página de telemedicina."
        acoes={
          <button type="button" className="btn-primario" onClick={() => setEditando('novo')}>
            <IconeMais tamanho={18} /> Nova pergunta
          </button>
        }
      />
      <div role="tablist" aria-label="Página" className="mb-5 inline-flex rounded-full bg-white p-1 shadow-card">
        {(['home', 'telemedicina'] as Pagina[]).map((p) => (
          <button
            key={p}
            type="button"
            role="tab"
            aria-selected={pagina === p}
            onClick={() => setPagina(p)}
            className={`min-h-[40px] rounded-full px-5 text-sm transition-colors ${pagina === p ? 'bg-marinho text-white' : 'text-marinho hover:bg-marinho-50'}`}
          >
            {p === 'home' ? 'Página inicial' : 'Telemedicina'} ({lista.filter((f) => f.pagina === p).length})
          </button>
        ))}
      </div>
      {editando === 'novo' && (
        <EditorFaq
          inicial={{ id: '', pergunta: '', resposta: '', ordem: 0, ativo: true, pagina }}
          onSalvar={salvar}
          onCancelar={() => setEditando(null)}
        />
      )}
      {!daPagina.length && editando !== 'novo' && <div className="cartao text-center text-sm text-marinho-400">Nenhuma pergunta nesta página.</div>}
      <ul className="space-y-3">
        {daPagina.map((f, i) =>
          editando === f.id ? (
            <li key={f.id}>
              <EditorFaq inicial={f} onSalvar={salvar} onCancelar={() => setEditando(null)} />
            </li>
          ) : (
            <li key={f.id} className={`cartao !p-4 md:!p-5 ${f.ativo ? '' : 'opacity-70'}`}>
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex flex-col gap-1">
                  <button type="button" className={btnIcone} disabled={i === 0 || ocupado} onClick={() => mover(i, -1)} aria-label={`Subir pergunta ${i + 1}`}>
                    <IconeSetaCima tamanho={18} />
                  </button>
                  <button
                    type="button"
                    className={btnIcone}
                    disabled={i === daPagina.length - 1 || ocupado}
                    onClick={() => mover(i, 1)}
                    aria-label={`Descer pergunta ${i + 1}`}
                  >
                    <IconeSetaCima tamanho={18} className="rotate-180" />
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-base font-medium">{f.pergunta}</h2>
                  <p className="mt-1 line-clamp-3 whitespace-pre-line text-sm text-marinho-400">{f.resposta}</p>
                </div>
                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                  <Chave ativo={f.ativo} onChange={() => alternar(f)} rotulo={f.ativo ? 'Ativa' : 'Inativa'} />
                  <button type="button" className={btnPeq} onClick={() => setEditando(f.id)}>
                    Editar
                  </button>
                  <button type="button" className={btnPerigo} onClick={() => excluir(f)}>
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ),
        )}
      </ul>
    </>
  )
}

function EditorFaq({ inicial, onSalvar, onCancelar }: { inicial: FaqItem; onSalvar: (f: FaqItem) => Promise<boolean>; onCancelar: () => void }) {
  const [f, setF] = useState(inicial)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  async function enviar(e: FormEvent) {
    e.preventDefault()
    if (f.pergunta.trim().length < 5) return setErro('Escreva a pergunta.')
    if (f.resposta.trim().length < 5) return setErro('Escreva a resposta.')
    setErro('')
    setSalvando(true)
    await onSalvar(f)
    setSalvando(false)
  }
  return (
    <form onSubmit={enviar} noValidate className="cartao mb-4 space-y-4 border border-marinho-200">
      <h2 className="font-display text-lg">{inicial.id ? 'Editar pergunta' : 'Nova pergunta'}</h2>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <Campo rotulo="Pergunta">
          {(p) => <input {...p} className="campo" maxLength={200} value={f.pergunta} onChange={(e) => setF({ ...f, pergunta: e.target.value })} />}
        </Campo>
        <Campo rotulo="Página">
          {(p) => (
            <select {...p} className="campo" value={f.pagina} onChange={(e) => setF({ ...f, pagina: e.target.value as Pagina })}>
              <option value="home">Página inicial</option>
              <option value="telemedicina">Telemedicina</option>
            </select>
          )}
        </Campo>
      </div>
      <Campo rotulo="Resposta">
        {(p) => <textarea {...p} rows={5} className="campo" maxLength={2000} value={f.resposta} onChange={(e) => setF({ ...f, resposta: e.target.value })} />}
      </Campo>
      <Chave ativo={f.ativo} onChange={(v) => setF({ ...f, ativo: v })} rotulo={f.ativo ? 'Visível no site' : 'Oculta no site'} />
      {erro && (
        <p role="alert" className="text-sm text-red-700">
          {erro}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" className={btnPeq} onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="btn-primario !min-h-[44px] !py-2" disabled={salvando}>
          {salvando ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}

/* ---------- Avisos ---------- */

function situacaoAviso(a: Aviso) {
  const hoje = new Date().toISOString().slice(0, 10)
  if (!a.ativo) return 'Desativado'
  if (a.inicio && a.inicio > hoje) return 'Agendado'
  if (a.fim && a.fim < hoje) return 'Encerrado'
  return 'No ar'
}

export function Avisos() {
  const toast = useToast()
  const [lista, setLista] = useState<Aviso[] | null>(null)
  const [editando, setEditando] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    const { data, error } = await supabase!.from('avisos').select('*').order('created_at', { ascending: false })
    if (error) toast('erro', `Não foi possível carregar: ${msgErro(error)}`)
    setLista((data as Aviso[]) || [])
  }, [toast])
  useEffect(() => {
    carregar()
  }, [carregar])

  if (!lista) return <Carregando />

  async function salvar(a: Aviso) {
    const linha = { texto: a.texto.trim(), link: normalizarUrl(a.link), ativo: a.ativo, inicio: a.inicio || null, fim: a.fim || null }
    const { error } = a.id ? await supabase!.from('avisos').update(linha).eq('id', a.id) : await supabase!.from('avisos').insert(linha)
    if (error) {
      toast('erro', `Erro ao salvar: ${msgErro(error)}`)
      return
    }
    toast('ok', a.id ? 'Aviso salvo.' : 'Aviso criado.')
    setEditando(null)
    carregar()
  }

  async function alternar(a: Aviso) {
    const { error } = await supabase!.from('avisos').update({ ativo: !a.ativo }).eq('id', a.id)
    if (error) return toast('erro', `Erro ao alterar: ${msgErro(error)}`)
    setLista((l) => l && l.map((x) => (x.id === a.id ? { ...x, ativo: !a.ativo } : x)))
    toast('ok', !a.ativo ? 'Aviso ativado.' : 'Aviso desativado.')
  }

  async function excluir(a: Aviso) {
    if (!window.confirm(`Excluir o aviso "${a.texto}"?`)) return
    const { error } = await supabase!.from('avisos').delete().eq('id', a.id)
    if (error) return toast('erro', `Erro ao excluir: ${msgErro(error)}`)
    setLista((l) => l && l.filter((x) => x.id !== a.id))
    toast('ok', 'Aviso excluído.')
  }

  return (
    <>
      <TituloPainel
        titulo="Avisos"
        descricao="Faixas temporárias no topo do site, como &quot;Novos horários em Teófilo Otoni&quot;. Defina datas para entrar e sair do ar sozinhas."
        acoes={
          <button type="button" className="btn-primario" onClick={() => setEditando('novo')}>
            <IconeMais tamanho={18} /> Novo aviso
          </button>
        }
      />
      {editando === 'novo' && (
        <EditorAviso inicial={{ id: '', texto: '', link: '', ativo: true, inicio: null, fim: null }} onSalvar={salvar} onCancelar={() => setEditando(null)} />
      )}
      {!lista.length && editando !== 'novo' && <div className="cartao text-center text-sm text-marinho-400">Nenhum aviso cadastrado.</div>}
      <ul className="space-y-3">
        {lista.map((a) =>
          editando === a.id ? (
            <li key={a.id}>
              <EditorAviso inicial={a} onSalvar={salvar} onCancelar={() => setEditando(null)} />
            </li>
          ) : (
            <li key={a.id} className="cartao !p-4 md:!p-5">
              <div className="flex flex-wrap items-start gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-marinho">{a.texto}</p>
                  <p className="mt-1 text-xs text-marinho-400">
                    <span className="mr-2 rounded-full bg-lilas-100 px-2 py-0.5 text-marinho">{situacaoAviso(a)}</span>
                    {a.inicio || a.fim ? `${a.inicio ? `de ${a.inicio.split('-').reverse().join('/')}` : ''} ${a.fim ? `até ${a.fim.split('-').reverse().join('/')}` : ''}` : 'Sem período definido'}
                    {a.link && ` · ${a.link}`}
                  </p>
                </div>
                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                  <Chave ativo={a.ativo} onChange={() => alternar(a)} rotulo={a.ativo ? 'Ativo' : 'Inativo'} />
                  <button type="button" className={btnPeq} onClick={() => setEditando(a.id)}>
                    Editar
                  </button>
                  <button type="button" className={btnPerigo} onClick={() => excluir(a)}>
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ),
        )}
      </ul>
    </>
  )
}

function EditorAviso({ inicial, onSalvar, onCancelar }: { inicial: Aviso; onSalvar: (a: Aviso) => Promise<void>; onCancelar: () => void }) {
  const [a, setA] = useState(inicial)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  async function enviar(e: FormEvent) {
    e.preventDefault()
    if (a.texto.trim().length < 3) return setErro('Escreva o texto do aviso.')
    if (!urlValida(normalizarUrl(a.link)) && !a.link.startsWith('/')) return setErro('Link inválido. Use um endereço completo ou um caminho do site, ex.: /consultorio')
    if (a.inicio && a.fim && a.fim < a.inicio) return setErro('A data final é anterior à inicial.')
    setErro('')
    setSalvando(true)
    await onSalvar({ ...a, link: a.link.startsWith('/') ? a.link.trim() : a.link })
    setSalvando(false)
  }
  return (
    <form onSubmit={enviar} noValidate className="cartao mb-4 space-y-4 border border-marinho-200">
      <h2 className="font-display text-lg">{inicial.id ? 'Editar aviso' : 'Novo aviso'}</h2>
      <Campo rotulo="Texto" dica={`${a.texto.length}/160 caracteres.`}>
        {(p) => <input {...p} className="campo" maxLength={160} value={a.texto} onChange={(e) => setA({ ...a, texto: e.target.value })} />}
      </Campo>
      <Campo rotulo="Link (opcional)" dica="Endereço completo ou página do site, ex.: /consultorio">
        {(p) => <input {...p} className="campo" value={a.link} onChange={(e) => setA({ ...a, link: e.target.value })} />}
      </Campo>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo="Início (opcional)">
          {(p) => <input {...p} type="date" className="campo" value={a.inicio || ''} onChange={(e) => setA({ ...a, inicio: e.target.value || null })} />}
        </Campo>
        <Campo rotulo="Fim (opcional)">
          {(p) => <input {...p} type="date" className="campo" min={a.inicio || undefined} value={a.fim || ''} onChange={(e) => setA({ ...a, fim: e.target.value || null })} />}
        </Campo>
      </div>
      <Chave ativo={a.ativo} onChange={(v) => setA({ ...a, ativo: v })} rotulo={a.ativo ? 'Ativo' : 'Inativo'} />
      {erro && (
        <p role="alert" className="text-sm text-red-700">
          {erro}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" className={btnPeq} onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="btn-primario !min-h-[44px] !py-2" disabled={salvando}>
          {salvando ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
