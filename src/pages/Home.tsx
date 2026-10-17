import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../lib/SiteDataContext'
import { AREAS, MEDICO, type AreaSlug } from '../lib/constantes'
import { horariosPorDia, textoExcecao } from '../lib/formatar'
import { BotaoAgendar } from '../components/BotaoAgendar'
import { Hexagono, FotoHexagono } from '../components/Hexagono'
import { CtaFinal, Faq, TituloSecao } from '../components/Secoes'
import {
  IconeBalanca, IconeBrasil, IconeCheck, IconeComposicao, IconeCoracao, IconeExame, IconeInstagram, IconeLocal,
  IconePlano, IconeRaio, IconeSeta, IconeEstetoscopio, IconeVideo, IconeRelogio,
} from '../components/Icones'

export const ICONE_AREA: Record<AreaSlug, typeof IconeBalanca> = {
  emagrecimento: IconeBalanca,
  performance: IconeRaio,
  longevidade: IconeCoracao,
}

const BLOCOS: Record<AreaSlug, { texto: string; bullets: string[] }> = {
  emagrecimento: {
    texto: 'Emagrecer de forma sustentável começa por entender por que o peso aumentou: hormônios, sono, alimentação, rotina, medicamentos e histórico. A partir disso, montamos uma estratégia possível para a sua vida.',
    bullets: [
      'Investigação das causas do ganho de peso',
      'Plano alimentar e de atividade física realista, em conjunto com a sua rotina',
      'Uso de medicamentos quando indicado, com segurança e acompanhamento',
      'Acompanhamento para manter o peso a longo prazo',
    ],
  },
  performance: {
    texto: 'Para quem treina, trabalha muito ou quer mais disposição, o objetivo é melhorar a composição corporal e a energia com base em exames, avaliação clínica e ajustes individualizados.',
    bullets: [
      'Avaliação de composição corporal por bioimpedância',
      'Orientação sobre massa magra e gordura corporal, com base em exames',
      'Investigação de cansaço, sono e recuperação',
      'Acompanhamento com metas claras e mensuráveis',
    ],
  },
  longevidade: {
    texto: 'Longevidade com qualidade depende de prevenção. Cuidar do metabolismo ajuda a controlar fatores de risco e a preservar músculo, energia e autonomia ao longo dos anos.',
    bullets: [
      'Avaliação de risco cardiovascular e metabólico',
      'Prevenção de diabetes, gordura no fígado e perda de massa muscular',
      'Exames direcionados, sem excessos',
      'Hábitos e tratamentos com base em evidências científicas',
    ],
  },
}

const ETAPAS = [
  { Icone: IconeEstetoscopio, titulo: 'Avaliação completa', texto: 'Conversa detalhada sobre seu histórico, rotina, sono, alimentação, medicamentos e objetivos.' },
  { Icone: IconeExame, titulo: 'Análise e solicitação de exames', texto: 'Revisão dos exames que você já tem e pedido apenas do que for necessário para decidir bem.' },
  { Icone: IconeComposicao, titulo: 'Composição corporal', texto: 'Na consulta presencial, avaliação por bioimpedância para acompanhar massa magra, gordura e hidratação.' },
  { Icone: IconePlano, titulo: 'Plano individualizado', texto: 'Um plano claro, feito para a sua vida, com retorno e acompanhamento para ajustar o que for preciso.' },
]

export default function Home() {
  const { conteudo, locais, telemedicina, faq } = useSite()
  const faqHome = faq.filter((f) => f.pagina === 'home')
  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-marinho" style={{ background: 'linear-gradient(115deg,#142F5A 0%,#142F5A 42%,#1f2b40 68%,#2C2726 100%)' }}>
        <img src="/logo/simbolo-branco.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -left-24 bottom-0 w-[420px] opacity-[0.04]" />
        <div className="container-site relative grid items-end gap-6 pt-24 md:min-h-[640px] md:grid-cols-[1.1fr_0.9fr] md:pt-0 lg:min-h-[720px]">
          {/* Foto: abaixo do texto e do botão no celular, à direita no desktop */}
          <div className="relative order-2 mx-auto -mt-2 h-[240px] w-full max-w-[300px] sm:h-[400px] sm:max-w-sm md:mt-0 md:h-full md:max-w-none">
            <picture>
              <source media="(max-width: 767px)" srcSet="/foto/dr-rogato-hero-800.webp" type="image/webp" />
              <source srcSet="/foto/dr-rogato-hero.webp" type="image/webp" />
              <img
                src="/foto/dr-rogato-hero.jpg"
                alt="Dr. Rogato sorrindo, de blazer azul-marinho, com as mãos entrelaçadas sobre a mesa"
                {...{ fetchpriority: "high" }}
                width={1600}
                height={2400}
                className="hero-foto h-full w-full object-cover md:absolute md:inset-0"
                style={{ objectPosition: '50% 22%' }}
              />
            </picture>
          </div>
          <div className="relative order-1 md:self-center md:py-32">
            <p className="rotulo !text-lilas">{MEDICO.atuacao}</p>
            <h1 className="mt-3 font-display text-[2rem] font-light leading-[1.15] text-white sm:text-4xl lg:text-5xl">{conteudo.hero_titulo}</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-lilas-200 sm:mt-5 sm:text-lg">{conteudo.hero_subtitulo}</p>
            <ul className="mt-5 flex flex-wrap gap-2 text-sm sm:mt-6">
              <li className="inline-flex items-center gap-2 rounded-full border border-lilas/40 px-3 py-1.5 text-lilas sm:px-4 sm:py-2"><IconeLocal tamanho={16} /> Presencial em Teófilo Otoni e Malacacheta – MG</li>
              {telemedicina.ativo && <li className="inline-flex items-center gap-2 rounded-full border border-lilas/40 px-3 py-1.5 text-lilas sm:px-4 sm:py-2"><IconeBrasil tamanho={16} /> Online para todo o Brasil</li>}
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <BotaoAgendar modalidade="presencial" className="btn-whatsapp" rotulo="Hero" icone>Agendar pelo WhatsApp</BotaoAgendar>
              {telemedicina.ativo && <BotaoAgendar modalidade="online" className="btn-contorno-branco" rotulo="Hero" />}
            </div>
          </div>
        </div>
      </section>

      {/* Faixa de credenciais */}
      <div className="border-b border-lilas-200 bg-lilas-50">
        <p className="container-site flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-4 text-center text-sm text-marinho">
          <span className="font-medium">{MEDICO.nomeCurto}</span>
          <span aria-hidden="true" className="text-marinho-300">·</span>
          <span>{MEDICO.crm}</span>
          <span aria-hidden="true" className="text-marinho-300">·</span>
          <span>{MEDICO.tituloCurto}</span>
        </p>
      </div>

      {/* 2. Como posso te ajudar? */}
      <section className="secao bg-white">
        <div className="container-site">
          <TituloSecao rotulo="Áreas de atuação" titulo="Como posso te ajudar?" texto="Cada pessoa chega com um objetivo diferente. Escolha o tema que mais combina com o seu momento." centro />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((a) => {
              const Icone = ICONE_AREA[a.slug]
              return (
                <Link key={a.slug} to={`/tratamentos/${a.slug}`} className="group cartao flex flex-col ring-1 ring-lilas-200 transition-all hover:-translate-y-1 hover:shadow-suave">
                  <Hexagono tamanho={64} variante="lilas"><Icone tamanho={28} /></Hexagono>
                  <h3 className="mt-5 font-display text-xl">{a.titulo}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-grafite/75">{a.resumo}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-display text-xs uppercase tracking-wider text-marinho">
                    Saiba mais <IconeSeta tamanho={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. Blocos de tratamento */}
      {AREAS.map((a, i) => {
        const Icone = ICONE_AREA[a.slug]
        const b = BLOCOS[a.slug]
        const par = i % 2 === 1
        return (
          <section key={a.slug} className={`py-14 md:py-20 ${par ? 'bg-white' : 'bg-lilas-50'}`} aria-labelledby={`bloco-${a.slug}`}>
            <div className={`container-site grid items-center gap-10 md:grid-cols-2 md:gap-16`}>
              <div className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl ${par ? 'bg-lilas-100 md:order-2' : 'bg-marinho'}`}>
                <img src={par ? '/logo/simbolo-azul.svg' : '/logo/simbolo-branco.svg'} alt="" aria-hidden="true" className="absolute -bottom-10 -right-10 w-2/3 opacity-[0.06]" />
                <Hexagono tamanho={150} variante={par ? 'marinho' : 'lilas'}><Icone tamanho={62} strokeWidth={1.2} /></Hexagono>
                <span className={`absolute left-6 top-6 font-display text-xs uppercase tracking-rotulo ${par ? 'text-marinho-400' : 'text-lilas'}`}>0{i + 1}</span>
              </div>
              <div>
                <p className="rotulo">Tratamento</p>
                <h2 id={`bloco-${a.slug}`} className="titulo-secao mt-3">{a.titulo}</h2>
                <p className="mt-4 leading-relaxed text-grafite/80">{b.texto}</p>
                <ul className="mt-6 space-y-3">
                  {b.bullets.map((t) => (
                    <li key={t} className="flex gap-3">
                      <IconeCheck tamanho={20} className="mt-0.5 shrink-0 text-marinho-400" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <BotaoAgendar modalidade="geral" rotulo={`Bloco ${a.slug}`}>Agendar consulta</BotaoAgendar>
                  <Link to={`/tratamentos/${a.slug}`} className="link px-2 py-2 text-center text-sm">Entenda a abordagem</Link>
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {/* 4. Como é a minha consulta? */}
      <section className="secao relative overflow-hidden bg-marinho">
        <img src="/logo/simbolo-branco.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 w-[480px] opacity-[0.05]" />
        <div className="container-site relative">
          <TituloSecao rotulo="Passo a passo" titulo="Como é a minha consulta?" texto="Uma consulta sem pressa, com escuta, exame físico e um plano que você entende e consegue seguir." claro centro />
          <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ETAPAS.map((e, i) => (
              <li key={e.titulo} className="relative text-center">
                <div className="flex justify-center">
                  <Hexagono tamanho={84} variante="contorno-branco"><e.Icone tamanho={32} /></Hexagono>
                </div>
                <p className="mt-4 font-display text-xs uppercase tracking-rotulo text-lilas">Etapa {i + 1}</p>
                <h3 className="mt-2 font-display text-xl !text-white">{e.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-lilas-200">{e.texto}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex justify-center">
            <BotaoAgendar modalidade="geral" className="btn-lilas" rotulo="Como é a consulta">Agendar consulta</BotaoAgendar>
          </div>
        </div>
      </section>

      {/* 5. Escolha como ser atendido */}
      <section className="secao bg-lilas-100" id="atendimento">
        <div className="container-site">
          <TituloSecao rotulo="Atendimento" titulo="Escolha como ser atendido" texto="Presencialmente no Vale do Mucuri ou por videochamada, de qualquer lugar do Brasil." centro />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="cartao flex flex-col">
              <div className="flex items-center gap-4">
                <Hexagono tamanho={56}><IconeLocal tamanho={24} /></Hexagono>
                <h3 className="font-display text-2xl">Presencial</h3>
              </div>
              <ul className="mt-6 flex-1 space-y-4">
                {locais.map((l) => (
                  <li key={l.id} className="rounded-2xl bg-lilas-50 p-5">
                    <p className="font-display text-lg text-marinho">{l.cidade}/{l.uf}</p>
                    <p className="text-sm text-grafite/75">{l.nome}</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {horariosPorDia(l.horarios).map((h) => (
                        <li key={h.dia} className="flex items-center gap-2"><IconeRelogio tamanho={16} className="text-marinho-400" /> {h.dia}, {h.faixas}</li>
                      ))}
                    </ul>
                    {l.excecoes.map((e, i) => (
                      <p key={i} className="mt-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-marinho">{textoExcecao(e)}</p>
                    ))}
                    <BotaoAgendar modalidade="presencial" local={l} className="btn-primario mt-4 w-full sm:w-auto" rotulo="Escolha como ser atendido" />
                  </li>
                ))}
              </ul>
              <Link to="/consultorio" className="link mt-5 text-sm">Endereços, mapas e como chegar</Link>
            </div>
            <div className="cartao flex flex-col bg-marinho text-lilas-200">
              <div className="flex items-center gap-4">
                <Hexagono tamanho={56} variante="lilas"><IconeVideo tamanho={24} /></Hexagono>
                <h3 className="font-display text-2xl !text-white">Online</h3>
              </div>
              <p className="mt-6 text-lg text-white">Atendimento por videochamada para todo o Brasil.</p>
              <ul className="mt-5 flex-1 space-y-3">
                {['Consulta completa, de onde você estiver', 'Receitas e pedidos de exame digitais, com assinatura eletrônica', 'Envio de exames em PDF ou foto', 'Acompanhamento e retorno também online'].map((t) => (
                  <li key={t} className="flex gap-3"><IconeCheck tamanho={20} className="mt-0.5 shrink-0 text-lilas" />{t}</li>
                ))}
              </ul>
              <p className="mt-5 text-sm">
                {telemedicina.horarios.length
                  ? horariosPorDia(telemedicina.horarios).map((h) => `${h.dia}, ${h.faixas}`).join(' · ')
                  : 'Horários sob consulta pelo WhatsApp.'}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                {telemedicina.ativo ? (
                  <BotaoAgendar modalidade="online" className="btn-lilas" rotulo="Escolha como ser atendido" />
                ) : (
                  <p className="text-sm">A teleconsulta está temporariamente indisponível.</p>
                )}
                <Link to="/telemedicina" className="px-2 py-2 text-center text-sm font-medium text-white underline underline-offset-4">Como funciona</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Sobre o Dr. Rogato */}
      <section className="secao bg-white">
        <div className="container-site grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <FotoHexagono src="/foto/dr-rogato-sobre.webp" srcJpg="/foto/dr-rogato-sobre.jpg" alt="Retrato do Dr. Rogato" className="mx-auto w-full max-w-[340px]" posicao="50% 30%" />
          <div>
            <p className="rotulo">Sobre o Dr. Rogato</p>
            <h2 className="titulo-secao mt-3">Visão clínica completa, cuidado próximo</h2>
            <p className="mt-5 leading-relaxed text-grafite/80">
              Sou médico formado pela UNIFAGOC e pós-graduado em Endocrinologia pelo IPEMED (NÃO ESPECIALISTA). Há anos atuo em terapia intensiva e na gestão do Hospital Bom Samaritano de Teófilo Otoni, onde sou diretor clínico. Essa vivência me ensinou a olhar o paciente por inteiro.
            </p>
            <p className="mt-4 leading-relaxed text-grafite/80">
              No consultório, uno essa experiência ao cuidado do metabolismo: medicina baseada em evidências, individualizada, com foco em mudanças que se sustentam no dia a dia.
            </p>
            <p className="mt-5 text-sm font-medium text-marinho">{MEDICO.nome} · {MEDICO.crm} · {MEDICO.titulo}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/sobre" className="btn-contorno">Conheça minha trajetória</Link>
              <BotaoAgendar modalidade="geral" rotulo="Sobre (home)">Agendar consulta</BotaoAgendar>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Instagram */}
      <Instagram />

      {/* 8. Perguntas frequentes */}
      {faqHome.length > 0 && (
        <section className="secao bg-white" id="perguntas">
          <div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <TituloSecao rotulo="Dúvidas" titulo="Perguntas frequentes" texto="Não encontrou sua dúvida? Fale pelo WhatsApp." />
              <BotaoAgendar modalidade="geral" className="btn-contorno mt-8" rotulo="FAQ" icone>Falar no WhatsApp</BotaoAgendar>
            </div>
            <Faq itens={faqHome} />
          </div>
        </section>
      )}

      {/* 9. CTA final */}
      <CtaFinal />
    </>
  )
}

function Instagram() {
  const { redes, conteudo } = useSite()
  const ref = useRef<HTMLElement>(null)
  const [visivel, setVisivel] = useState(false)
  const posts = conteudo.instagram_posts.filter(Boolean).slice(0, 6)
  const usuario = redes.instagram.replace(/\/$/, '').split('/').pop()

  // Só carrega o script do Instagram quando a seção aparece (desempenho)
  useEffect(() => {
    if (!posts.length || !ref.current) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisivel(true), { rootMargin: '300px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [posts.length])
  useEffect(() => {
    if (!visivel) return
    const w = window as Window & { instgrm?: { Embeds: { process: () => void } } }
    if (w.instgrm) w.instgrm.Embeds.process()
    else {
      const s = document.createElement('script')
      s.src = 'https://www.instagram.com/embed.js'
      s.async = true
      document.body.appendChild(s)
    }
  }, [visivel, posts.join()])

  if (!redes.instagram) return null
  return (
    <section ref={ref} className="secao bg-lilas-50">
      <div className="container-site">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <TituloSecao rotulo="Instagram" titulo={<>Conteúdo sobre saúde e metabolismo no <span className="whitespace-nowrap">@{usuario}</span></>} />
          <a href={redes.instagram} target="_blank" rel="noopener noreferrer" className="btn-primario"><IconeInstagram tamanho={18} /> Seguir no Instagram</a>
        </div>
        {posts.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((url) =>
              visivel ? (
                <blockquote key={url} className="instagram-media !m-0 !min-w-0 !max-w-none !rounded-3xl" data-instgrm-permalink={url} data-instgrm-version="14">
                  <a href={url} target="_blank" rel="noopener noreferrer">Ver publicação no Instagram</a>
                </blockquote>
              ) : (
                <div key={url} className="aspect-square rounded-3xl bg-white" />
              ),
            )}
          </div>
        ) : (
          <a href={redes.instagram} target="_blank" rel="noopener noreferrer" className="mt-10 flex flex-col items-center gap-6 rounded-3xl bg-white p-8 text-center shadow-card transition-shadow hover:shadow-suave sm:flex-row sm:text-left">
            <img src="/foto/dr-rogato-avatar.webp" alt="Foto de perfil do Dr. Rogato" loading="lazy" width={96} height={96} className="h-24 w-24 rounded-full object-cover ring-4 ring-lilas" />
            <div className="flex-1">
              <p className="font-display text-xl text-marinho">@{usuario}</p>
              <p className="mt-1 text-grafite/75">Dicas, explicações e novidades sobre emagrecimento, performance, longevidade e saúde hormonal.</p>
            </div>
            <span className="inline-flex items-center gap-2 font-display text-sm uppercase tracking-wider text-marinho">Ver perfil <IconeSeta tamanho={18} /></span>
          </a>
        )}
      </div>
    </section>
  )
}
