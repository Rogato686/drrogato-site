import { Link } from 'react-router-dom'
import { CabecalhoPagina, CtaFinal, TituloSecao } from '../components/Secoes'
import { Hexagono } from '../components/Hexagono'
import { IconeComposicao, IconeExame, IconePlano, IconeSeta, IconeEstetoscopio } from '../components/Icones'
import { AREAS } from '../lib/constantes'
import { CONTEUDO_AREAS, ICONES_AREA } from './conteudoTratamentos'

const ETAPAS = [
  { Icone: IconeEstetoscopio, titulo: 'Avaliação completa', texto: 'Histórico, rotina, sono, alimentação e objetivos.' },
  { Icone: IconeExame, titulo: 'Exames', texto: 'Solicitação e análise de exames com indicação clara.' },
  { Icone: IconeComposicao, titulo: 'Composição corporal', texto: 'Bioimpedância na consulta presencial, quando indicada.' },
  { Icone: IconePlano, titulo: 'Plano e retorno', texto: 'Plano individualizado com acompanhamento próximo.' },
]

export default function Tratamentos() {
  return (
    <>
      <CabecalhoPagina
        rotulo="Tratamentos"
        titulo="Cuidado do metabolismo em três frentes"
        texto="Emagrecimento, performance e longevidade: áreas que se conversam e são avaliadas em conjunto, sempre a partir da sua história."
      />

      <section className="secao" aria-labelledby="areas-titulo">
        <div className="container-site">
          <h2 id="areas-titulo" className="sr-only">
            Áreas de atuação
          </h2>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((a) => {
              const Icone = ICONES_AREA[a.icone]
              const c = CONTEUDO_AREAS[a.slug]
              return (
                <li key={a.slug}>
                  <Link to={`/tratamentos/${a.slug}`} className="cartao group flex h-full flex-col transition-shadow hover:shadow-suave md:!p-10">
                    <div className="flex items-center gap-4">
                      <Hexagono tamanho={64} variante="marinho">
                        <Icone tamanho={26} />
                      </Hexagono>
                      <h3 className="text-2xl font-light text-marinho">{a.titulo}</h3>
                    </div>
                    <p className="mt-5 leading-relaxed text-grafite/80">{a.resumo}</p>
                    <ul className="mt-5 space-y-2 text-sm text-grafite/75">
                      {c.paraQuem.slice(0, 3).map((p) => (
                        <li key={p} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-marinho-300" aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 font-display text-sm font-medium uppercase tracking-wider text-marinho">
                      Conhecer a abordagem <IconeSeta tamanho={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="secao bg-lilas-100" aria-labelledby="como-titulo">
        <div className="container-site">
          <TituloSecao centro rotulo="Em todas as áreas" titulo={<span id="como-titulo">Como é a consulta</span>} />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ETAPAS.map(({ Icone, titulo, texto }, i) => (
              <li key={titulo} className="cartao text-center">
                <Hexagono tamanho={60} variante="lilas" className="mx-auto">
                  <Icone tamanho={24} />
                </Hexagono>
                <p className="rotulo mt-4">Etapa {i + 1}</p>
                <h3 className="mt-2 text-xl text-marinho">{titulo}</h3>
                <p className="mt-2 text-grafite/75">{texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaFinal />
    </>
  )
}
