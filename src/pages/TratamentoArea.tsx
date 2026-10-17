import { Link, useParams } from 'react-router-dom'
import { CabecalhoPagina, Faq, TituloSecao } from '../components/Secoes'
import { Hexagono } from '../components/Hexagono'
import { BotaoAgendar } from '../components/BotaoAgendar'
import { IconeCheck, IconeInfo, IconeLocal, IconeSeta, IconeVideo } from '../components/Icones'
import { AREAS } from '../lib/constantes'
import { CONTEUDO_AREAS, ICONES_AREA } from './conteudoTratamentos'
import NaoEncontrada from './NaoEncontrada'
import { useSite } from '../lib/SiteDataContext'

export default function TratamentoArea() {
  const { area } = useParams()
  const { telemedicina } = useSite()
  const info = AREAS.find((a) => a.slug === area)
  if (!info) return <NaoEncontrada />
  const c = CONTEUDO_AREAS[info.slug]
  const Icone = ICONES_AREA[info.icone]
  const outras = AREAS.filter((a) => a.slug !== info.slug)

  return (
    <>
      <CabecalhoPagina
        rotulo="Tratamentos"
        titulo={info.titulo}
        texto={c.chamada}
        antes={
          <nav aria-label="Trilha de navegação" className="text-sm text-grafite/75">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to="/" className="hover:text-marinho">
                  Início
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link to="/tratamentos" className="hover:text-marinho">
                  Tratamentos
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-marinho">
                {info.titulo}
              </li>
            </ol>
          </nav>
        }
        acoes={
          <>
            <BotaoAgendar modalidade="presencial" className="btn-whatsapp" rotulo={`Topo área ${info.slug}`} icone>
              Agendar pelo WhatsApp
            </BotaoAgendar>
            {telemedicina.ativo && <BotaoAgendar modalidade="online" className="btn-contorno" rotulo={`Topo área ${info.slug}`} />}
          </>
        }
      />

      {/* Introdução + para quem é */}
      <section className="secao" aria-labelledby="para-quem">
        <div className="container-site grid gap-12 md:grid-cols-[5fr_7fr] md:gap-16">
          <div>
            <Hexagono tamanho={80} variante="marinho">
              <Icone tamanho={34} />
            </Hexagono>
            <p className="mt-8 text-xl leading-relaxed text-grafite/85">{c.introducao}</p>
          </div>
          <div>
            <TituloSecao rotulo="Para quem é" titulo={<span id="para-quem">Este cuidado pode ser para você se</span>} />
            <ul className="mt-8 space-y-4">
              {c.paraQuem.map((p) => (
                <li key={p} className="flex gap-4">
                  <Hexagono tamanho={28} variante="lilas">
                    <IconeCheck tamanho={14} />
                  </Hexagono>
                  <span className="pt-0.5 leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Sinais e sintomas */}
      <section className="secao bg-lilas-100" aria-labelledby="sinais">
        <div className="container-site">
          <TituloSecao
            rotulo="Sinais e sintomas"
            titulo={<span id="sinais">Quando vale a pena procurar avaliação</span>}
            texto="Nenhum desses sinais, sozinho, define um diagnóstico. Eles indicam que uma conversa com o médico pode ajudar."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.sinais.map((s) => (
              <li key={s} className="flex items-start gap-3 rounded-2xl bg-white p-5 shadow-card">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-marinho-400" aria-hidden="true" />
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Abordagem */}
      <section className="secao" aria-labelledby="abordagem">
        <div className="container-site">
          <TituloSecao rotulo="Como é a abordagem" titulo={<span id="abordagem">Um caminho em etapas, construído com você</span>} />
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {c.abordagem.map((e, i) => (
              <li key={e.titulo} className="cartao">
                <Hexagono tamanho={48} variante="marinho">
                  <span className="font-display text-lg">{i + 1}</span>
                </Hexagono>
                <h3 className="mt-4 text-xl text-marinho">{e.titulo}</h3>
                <p className="mt-2 leading-relaxed text-grafite/75">{e.texto}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 flex gap-3 rounded-2xl border border-lilas-300 bg-lilas-50 p-5 text-sm leading-relaxed text-grafite/80" role="note">
            <IconeInfo tamanho={20} className="mt-0.5 shrink-0 text-marinho" />
            {c.observacao}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="secao bg-lilas-50" aria-labelledby="faq-area">
        <div className="container-site grid gap-10 md:grid-cols-[4fr_8fr]">
          <TituloSecao rotulo="Perguntas frequentes" titulo={<span id="faq-area">Dúvidas sobre {info.titulo.toLowerCase()}</span>} />
          <Faq itens={c.faq} id={`faq-${info.slug}`} />
        </div>
      </section>

      {/* CTA */}
      <section className="secao bg-marinho" aria-labelledby="cta-area">
        <div className="container-site">
          <h2 id="cta-area" className="text-center font-display text-3xl font-light text-white md:text-4xl">
            Escolha como ser atendido
          </h2>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/15">
              <Hexagono tamanho={52} variante="contorno-branco">
                <IconeLocal tamanho={22} />
              </Hexagono>
              <h3 className="mt-4 text-2xl font-light text-white">Presencial</h3>
              <p className="mt-2 text-lilas-200">Teófilo Otoni e Malacacheta, em Minas Gerais.</p>
              <BotaoAgendar modalidade="presencial" className="btn-lilas mt-6 w-full" rotulo={`Área ${info.slug}`} />
            </div>
            <div className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/15">
              <Hexagono tamanho={52} variante="contorno-branco">
                <IconeVideo tamanho={22} />
              </Hexagono>
              <h3 className="mt-4 text-2xl font-light text-white">Teleconsulta</h3>
              <p className="mt-2 text-lilas-200">Por videochamada, para todo o Brasil.</p>
              <BotaoAgendar modalidade="online" className="btn-contorno-branco mt-6 w-full" rotulo={`Área ${info.slug}`} />
            </div>
          </div>
        </div>
      </section>

      {/* Outras áreas */}
      <section className="secao" aria-labelledby="outras">
        <div className="container-site">
          <h2 id="outras" className="titulo-secao">
            Outras áreas
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {outras.map((a) => {
              const I = ICONES_AREA[a.icone]
              return (
                <li key={a.slug}>
                  <Link to={`/tratamentos/${a.slug}`} className="group flex items-center gap-4 rounded-2xl border border-lilas-300 p-5 transition-colors hover:bg-lilas-50">
                    <Hexagono tamanho={44} variante="lilas">
                      <I tamanho={20} />
                    </Hexagono>
                    <span className="flex-1 font-medium text-marinho">{a.titulo}</span>
                    <IconeSeta tamanho={18} className="text-marinho transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
