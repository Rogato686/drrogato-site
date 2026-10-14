import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CabecalhoPagina } from '../components/Secoes'
import { Hexagono } from '../components/Hexagono'
import { RedesSociais } from '../components/RedesSociais'
import { IconeCheck, IconeEmail, IconeEscudo, IconeInfo, IconeLocal, IconeRelogio, IconeWhatsApp } from '../components/Icones'
import { useSite } from '../lib/SiteDataContext'
import { supabase } from '../lib/supabase'
import { linkWhatsApp } from '../lib/whatsapp'
import { rastrearWhatsApp } from '../lib/analytics'
import { enderecoCompleto, horariosPorDia, linkMaps } from '../lib/formatar'

type ModalidadeContato = 'presencial' | 'online' | 'duvida'
type Campos = { nome: string; telefone: string; email: string; cidade: string; modalidade: ModalidadeContato | ''; mensagem: string; consentimento: boolean }
type Erros = Partial<Record<keyof Campos, string>>

const VAZIO: Campos = { nome: '', telefone: '', email: '', cidade: '', modalidade: '', mensagem: '', consentimento: false }
const ROTULO_MODALIDADE: Record<ModalidadeContato, string> = { presencial: 'Consulta presencial', online: 'Teleconsulta', duvida: 'Dúvida' }

const formatarTelefone = (whats: string) => {
  const d = whats.replace(/\D/g, '').replace(/^55/, '')
  return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d
}

function validar(c: Campos): Erros {
  const e: Erros = {}
  if (c.nome.trim().length < 2) e.nome = 'Informe seu nome.'
  const tel = c.telefone.replace(/\D/g, '')
  if (tel.length < 10 || tel.length > 13) e.telefone = 'Informe um telefone com DDD.'
  if (c.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email.trim())) e.email = 'Confira o e-mail informado.'
  if (!c.modalidade) e.modalidade = 'Escolha uma opção.'
  if (c.mensagem.length > 2000) e.mensagem = 'Use no máximo 2.000 caracteres.'
  if (!c.consentimento) e.consentimento = 'É preciso concordar com a Política de Privacidade para enviar.'
  return e
}

export default function Contato() {
  const { redes, locais } = useSite()
  const [c, setC] = useState<Campos>(VAZIO)
  const [erros, setErros] = useState<Erros>({})
  const [estado, setEstado] = useState<'ocioso' | 'enviando' | 'sucesso' | 'whatsapp' | 'erro'>('ocioso')
  const [mel, setMel] = useState('') // honeypot
  const formRef = useRef<HTMLFormElement>(null)
  const ativos = locais.filter((l) => l.ativo).sort((a, b) => a.ordem - b.ordem)
  const whatsLink = linkWhatsApp('Olá! Vim pelo site e gostaria de falar com a equipe do Dr. Rogato.')

  const set = <K extends keyof Campos>(k: K, v: Campos[K]) => {
    setC((p) => ({ ...p, [k]: v }))
    if (erros[k]) setErros((p) => ({ ...p, [k]: undefined }))
  }

  async function enviar(ev: FormEvent) {
    ev.preventDefault()
    if (estado === 'enviando') return
    const e = validar(c)
    setErros(e)
    if (Object.keys(e).length) {
      const primeiro = Object.keys(e)[0]
      formRef.current?.querySelector<HTMLElement>(`[name="${primeiro}"]`)?.focus()
      return
    }
    if (mel) {
      // Robôs preenchem o campo oculto: fingimos sucesso e não gravamos nada.
      setEstado('sucesso')
      return
    }
    const dados = {
      nome: c.nome.trim(),
      telefone: c.telefone.trim(),
      email: c.email.trim(),
      cidade: c.cidade.trim(),
      modalidade: c.modalidade as ModalidadeContato,
      mensagem: c.mensagem.trim(),
    }

    if (!supabase) {
      const texto =
        `Olá! Vim pelo site e gostaria de falar com a equipe do Dr. Rogato.\n` +
        `Nome: ${dados.nome}\nTelefone: ${dados.telefone}` +
        (dados.email ? `\nE-mail: ${dados.email}` : '') +
        (dados.cidade ? `\nCidade: ${dados.cidade}` : '') +
        `\nInteresse: ${ROTULO_MODALIDADE[dados.modalidade]}` +
        (dados.mensagem ? `\nMensagem: ${dados.mensagem}` : '')
      rastrearWhatsApp('formulario-contato')
      window.open(linkWhatsApp(texto), '_blank', 'noopener,noreferrer')
      setEstado('whatsapp')
      setC(VAZIO)
      return
    }

    setEstado('enviando')
    const id = crypto.randomUUID()
    const { error } = await supabase.from('mensagens_contato').insert({ id, ...dados, consentimento: true })
    if (error) {
      setEstado('erro')
      return
    }
    try {
      await supabase.functions.invoke('notificar-contato', { body: { id } })
    } catch {
      /* a mensagem já foi salva; a notificação por e-mail é secundária */
    }
    setEstado('sucesso')
    setC(VAZIO)
  }

  const descr = (k: keyof Campos) => (erros[k] ? `erro-${k}` : undefined)
  const Erro = ({ k }: { k: keyof Campos }) =>
    erros[k] ? (
      <p id={`erro-${k}`} className="mt-1.5 text-sm text-red-700">
        {erros[k]}
      </p>
    ) : null

  return (
    <>
      <CabecalhoPagina
        rotulo="Contato"
        titulo="Vamos conversar"
        texto="Para agendar, o caminho mais rápido é o WhatsApp. Se preferir, deixe seu contato no formulário e retornamos assim que possível."
      />

      <section className="secao">
        <div className="container-site grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
          {/* Canais */}
          <div className="space-y-8">
            <div>
              <h2 className="titulo-secao">Canais de atendimento</h2>
              <ul className="mt-6 space-y-4">
                {redes.whatsapp && (
                  <li>
                    <a
                      href={whatsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => rastrearWhatsApp('contato')}
                      className="group flex items-center gap-4 rounded-2xl bg-lilas-50 p-4 transition-colors hover:bg-lilas-100"
                    >
                      <Hexagono tamanho={48} variante="marinho">
                        <IconeWhatsApp tamanho={20} />
                      </Hexagono>
                      <span>
                        <span className="block text-sm text-grafite/70">WhatsApp (agendamentos)</span>
                        <span className="font-medium text-marinho">{formatarTelefone(redes.whatsapp)}</span>
                      </span>
                    </a>
                  </li>
                )}
                {redes.email && (
                  <li>
                    <a href={`mailto:${redes.email}`} className="flex items-center gap-4 rounded-2xl bg-lilas-50 p-4 transition-colors hover:bg-lilas-100">
                      <Hexagono tamanho={48} variante="marinho">
                        <IconeEmail tamanho={20} />
                      </Hexagono>
                      <span className="min-w-0">
                        <span className="block text-sm text-grafite/70">E-mail</span>
                        <span className="break-all font-medium text-marinho">{redes.email}</span>
                      </span>
                    </a>
                  </li>
                )}
              </ul>
              <RedesSociais className="mt-4" tamanho={22} itemClass="text-marinho hover:bg-lilas-100" />
            </div>

            {ativos.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-light text-marinho">Consultórios</h2>
                <ul className="mt-5 space-y-4">
                  {ativos.map((l) => (
                    <li key={l.id} className="rounded-2xl border border-lilas-300 p-5">
                      <h3 className="flex items-center gap-2 text-lg text-marinho">
                        <IconeLocal tamanho={18} /> {l.nome}
                      </h3>
                      <address className="mt-2 text-sm not-italic leading-relaxed text-grafite/80">{enderecoCompleto(l)}</address>
                      {l.horarios.length > 0 && (
                        <p className="mt-2 flex items-start gap-2 text-sm text-grafite/80">
                          <IconeRelogio tamanho={16} className="mt-0.5 shrink-0" />
                          {horariosPorDia(l.horarios)
                            .map((h) => `${h.dia}, ${h.faixas}`)
                            .join(' · ')}
                        </p>
                      )}
                      <a href={linkMaps(l)} target="_blank" rel="noopener noreferrer" className="link mt-3 inline-block text-sm">
                        Ver no mapa
                      </a>
                    </li>
                  ))}
                </ul>
                <Link to="/consultorio" className="link mt-4 inline-block text-sm">
                  Mais detalhes dos consultórios
                </Link>
              </div>
            )}
          </div>

          {/* Formulário */}
          <div className="cartao md:!p-10">
            <h2 className="font-display text-3xl font-light text-marinho">Envie uma mensagem</h2>
            <p role="note" className="mt-4 flex gap-3 rounded-2xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-200">
              <IconeInfo tamanho={20} className="mt-0.5 shrink-0" />
              <span>
                <strong className="font-medium">Não envie informações de saúde por aqui.</strong> Sintomas, exames e diagnósticos são tratados
                somente na consulta. Use este formulário apenas para contato.
              </span>
            </p>

            <div aria-live="polite" role="status" className="mt-6">
              {estado === 'sucesso' && (
                <div className="flex gap-3 rounded-2xl bg-green-50 p-4 text-green-900 ring-1 ring-green-200">
                  <IconeCheck tamanho={22} className="shrink-0" />
                  <p>Mensagem enviada. Obrigado pelo contato! Retornaremos pelo telefone ou e-mail informado.</p>
                </div>
              )}
              {estado === 'whatsapp' && (
                <div className="flex gap-3 rounded-2xl bg-green-50 p-4 text-green-900 ring-1 ring-green-200">
                  <IconeCheck tamanho={22} className="shrink-0" />
                  <p>Abrimos o WhatsApp com a sua mensagem pronta. É só tocar em enviar por lá.</p>
                </div>
              )}
              {estado === 'enviando' && <p className="text-sm text-grafite/70">Enviando sua mensagem…</p>}
            </div>
            <div aria-live="assertive" role="alert">
              {estado === 'erro' && (
                <p className="mt-2 rounded-2xl bg-red-50 p-4 text-red-900 ring-1 ring-red-200">
                  Não foi possível enviar agora. Tente novamente em instantes ou{' '}
                  <a className="link" href={whatsLink} target="_blank" rel="noopener noreferrer">
                    fale pelo WhatsApp
                  </a>
                  .
                </p>
              )}
            </div>

            <form ref={formRef} onSubmit={enviar} noValidate className="mt-4 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="c-nome" className="mb-1.5 block text-sm font-medium text-marinho">
                  Nome <span aria-hidden="true">*</span>
                </label>
                <input
                  id="c-nome"
                  name="nome"
                  className="campo"
                  autoComplete="name"
                  maxLength={120}
                  required
                  value={c.nome}
                  onChange={(e) => set('nome', e.target.value)}
                  aria-invalid={!!erros.nome}
                  aria-describedby={descr('nome')}
                />
                <Erro k="nome" />
              </div>
              <div>
                <label htmlFor="c-tel" className="mb-1.5 block text-sm font-medium text-marinho">
                  Telefone / WhatsApp <span aria-hidden="true">*</span>
                </label>
                <input
                  id="c-tel"
                  name="telefone"
                  type="tel"
                  inputMode="tel"
                  className="campo"
                  autoComplete="tel"
                  placeholder="(33) 99999-9999"
                  maxLength={30}
                  required
                  value={c.telefone}
                  onChange={(e) => set('telefone', e.target.value)}
                  aria-invalid={!!erros.telefone}
                  aria-describedby={descr('telefone')}
                />
                <Erro k="telefone" />
              </div>
              <div>
                <label htmlFor="c-email" className="mb-1.5 block text-sm font-medium text-marinho">
                  E-mail
                </label>
                <input
                  id="c-email"
                  name="email"
                  type="email"
                  className="campo"
                  autoComplete="email"
                  maxLength={160}
                  value={c.email}
                  onChange={(e) => set('email', e.target.value)}
                  aria-invalid={!!erros.email}
                  aria-describedby={descr('email')}
                />
                <Erro k="email" />
              </div>
              <div>
                <label htmlFor="c-cidade" className="mb-1.5 block text-sm font-medium text-marinho">
                  Cidade
                </label>
                <input
                  id="c-cidade"
                  name="cidade"
                  className="campo"
                  autoComplete="address-level2"
                  maxLength={120}
                  value={c.cidade}
                  onChange={(e) => set('cidade', e.target.value)}
                />
              </div>
              <fieldset className="sm:col-span-2" aria-describedby={descr('modalidade')}>
                <legend className="mb-2 text-sm font-medium text-marinho">
                  Modalidade de interesse <span aria-hidden="true">*</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(ROTULO_MODALIDADE) as ModalidadeContato[]).map((m) => (
                    <label
                      key={m}
                      className={`flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors focus-within:ring-2 focus-within:ring-marinho-300 ${
                        c.modalidade === m ? 'border-marinho bg-marinho text-white' : 'border-marinho-200 text-marinho hover:bg-lilas-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="modalidade"
                        value={m}
                        checked={c.modalidade === m}
                        onChange={() => set('modalidade', m)}
                        className="sr-only"
                      />
                      {ROTULO_MODALIDADE[m]}
                    </label>
                  ))}
                </div>
                <Erro k="modalidade" />
              </fieldset>
              <div className="sm:col-span-2">
                <label htmlFor="c-msg" className="mb-1.5 block text-sm font-medium text-marinho">
                  Mensagem
                </label>
                <textarea
                  id="c-msg"
                  name="mensagem"
                  rows={4}
                  className="campo resize-y"
                  maxLength={2000}
                  placeholder="Ex.: gostaria de saber os próximos horários disponíveis."
                  value={c.mensagem}
                  onChange={(e) => set('mensagem', e.target.value)}
                  aria-invalid={!!erros.mensagem}
                  aria-describedby={descr('mensagem')}
                />
                <Erro k="mensagem" />
              </div>

              {/* Honeypot: invisível para pessoas, tentador para robôs */}
              <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="c-site">Não preencha este campo</label>
                <input id="c-site" name="site" tabIndex={-1} autoComplete="off" value={mel} onChange={(e) => setMel(e.target.value)} />
              </div>

              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
                  <input
                    type="checkbox"
                    name="consentimento"
                    checked={c.consentimento}
                    onChange={(e) => set('consentimento', e.target.checked)}
                    className="mt-1 h-5 w-5 shrink-0 rounded border-marinho-300 accent-marinho"
                    aria-invalid={!!erros.consentimento}
                    aria-describedby={descr('consentimento')}
                    required
                  />
                  <span>
                    Concordo com o uso dos meus dados de contato para retorno desta mensagem, conforme a{' '}
                    <Link to="/politica-de-privacidade" className="link">
                      Política de Privacidade
                    </Link>
                    . <span aria-hidden="true">*</span>
                  </span>
                </label>
                <Erro k="consentimento" />
              </div>

              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-xs text-grafite/60">
                  <IconeEscudo tamanho={16} /> * Campos obrigatórios
                </p>
                <button type="submit" className="btn-primario disabled:opacity-60" disabled={estado === 'enviando'}>
                  {estado === 'enviando' ? 'Enviando…' : supabase ? 'Enviar mensagem' : 'Enviar pelo WhatsApp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
