import { Link } from 'react-router-dom'
import { CabecalhoPagina, CtaFinal, TituloSecao } from '../components/Secoes'
import { Hexagono } from '../components/Hexagono'
import { BotaoAgendar } from '../components/BotaoAgendar'
import { IconeEscudo, IconeEstetoscopio, IconeExame, IconePlano, IconeSeta } from '../components/Icones'
import { AREAS, MEDICO } from '../lib/constantes'
import { ICONES_AREA } from './conteudoTratamentos'

type ItemLinha = { periodo: string; titulo: string; lugar: string; tipo: 'formacao' | 'experiencia' }

// Do mais recente para o mais antigo.
const LINHA_DO_TEMPO: ItemLinha[] = [
  { periodo: 'Desde 07/2026', titulo: 'Médico plantonista da UTI', lugar: 'Hospital Regional de Teófilo Otoni', tipo: 'experiencia' },
  { periodo: 'Desde 05/2024', titulo: 'Diretor Clínico', lugar: 'Hospital Bom Samaritano de Teófilo Otoni', tipo: 'experiencia' },
  { periodo: '2023 a 2025', titulo: 'Pós-graduação em Endocrinologia (NÃO ESPECIALISTA)', lugar: 'IPEMED, Belo Horizonte/MG', tipo: 'formacao' },
  { periodo: 'Desde 06/2022', titulo: 'Coordenador da Clínica Médica', lugar: 'Hospital Bom Samaritano de Teófilo Otoni', tipo: 'experiencia' },
  { periodo: 'Desde 03/2022', titulo: 'Médico plantonista da UTI', lugar: 'Hospital Bom Samaritano de Teófilo Otoni', tipo: 'experiencia' },
  { periodo: '2014 a 2020', titulo: 'Graduação em Medicina', lugar: 'UNIFAGOC, Ubá/MG', tipo: 'formacao' },
]

const FILOSOFIA = [
  {
    Icone: IconeExame,
    titulo: 'Baseada em evidências',
    texto: 'Cada decisão parte do que a ciência mostra de forma consistente, e não de modismos. Exames e tratamentos são indicados quando fazem sentido para o seu caso.',
  },
  {
    Icone: IconePlano,
    titulo: 'Individualizada',
    texto: 'Sua história, sua rotina, seus exames e seus objetivos definem o plano. Nada de protocolos prontos: o cuidado é construído junto com você.',
  },
  {
    Icone: IconeEscudo,
    titulo: 'Sustentável',
    texto: 'O foco é a saúde a longo prazo: mudanças que cabem na vida real, acompanhamento próximo e ajustes ao longo do caminho, com segurança.',
  },
]

export default function Sobre() {
  return (
    <>
      <CabecalhoPagina
        rotulo="Sobre"
        titulo="Dr. Rogato Abrantes de Quadros Filho"
        texto={`${MEDICO.titulo}, com atuação em ${MEDICO.atuacao.toLowerCase()}.`}
      >
        <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-marinho shadow-card">
          <IconeEstetoscopio tamanho={18} />
          {MEDICO.crm}
        </p>
      </CabecalhoPagina>

      {/* Biografia */}
      <section className="secao" aria-labelledby="bio-titulo">
        <div className="container-site grid items-center gap-12 md:grid-cols-[5fr_7fr] md:gap-16">
          <div className="relative mx-auto w-full max-w-sm md:max-w-none">
            <div className="absolute -bottom-4 -right-4 h-full w-full rounded-[2rem] bg-lilas-100" aria-hidden="true" />
            <picture>
              <source srcSet="/foto/dr-rogato-sobre.webp" type="image/webp" />
              <img
                src="/foto/dr-rogato-sobre.jpg"
                alt="Dr. Rogato Abrantes de Quadros Filho, de jaleco, em retrato no consultório"
                width={800}
                height={1000}
                decoding="async"
                className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-suave"
                style={{ objectPosition: '50% 20%' }}
              />
            </picture>
          </div>
          <div>
            <TituloSecao rotulo="Biografia" titulo={<span id="bio-titulo">Uma visão clínica completa a serviço do seu metabolismo</span>} />
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-grafite/80">
              <p>
                Formado em Medicina pela UNIFAGOC, em Ubá (MG), o Dr. Rogato construiu sua trajetória no ambiente hospitalar. Como plantonista de
                UTI, aprendeu a enxergar o paciente como um todo, a reconhecer cedo o que pode se agravar e a decidir com rigor e serenidade.
              </p>
              <p>
                Na gestão, como coordenador da Clínica Médica e diretor clínico do Hospital Bom Samaritano de Teófilo Otoni, somou a visão de
                processos, protocolos e qualidade assistencial. Essa experiência dá base ao cuidado ambulatorial: um olhar amplo, organizado e
                atento à segurança.
              </p>
              <p>
                Com a pós-graduação em Endocrinologia pelo IPEMED (NÃO ESPECIALISTA), direcionou o consultório para o cuidado do metabolismo, com atendimento em
                emagrecimento, performance e longevidade. Atende presencialmente em Teófilo Otoni e Malacacheta, no Vale do
                Mucuri, e por teleconsulta para todo o Brasil.
              </p>
            </div>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-lilas-50 p-5">
                <dt className="rotulo">Título</dt>
                <dd className="mt-2 font-medium text-marinho">{MEDICO.titulo}</dd>
              </div>
              <div className="rounded-2xl bg-lilas-50 p-5">
                <dt className="rotulo">Registro</dt>
                <dd className="mt-2 font-medium text-marinho">{MEDICO.crm}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Linha do tempo */}
      <section className="secao bg-lilas-50" aria-labelledby="trajetoria-titulo">
        <div className="container-site">
          <TituloSecao
            rotulo="Trajetória"
            titulo={<span id="trajetoria-titulo">Formação e experiência</span>}
            texto="Medicina intensiva, gestão hospitalar e metabolismo: uma trajetória que une a visão do todo ao cuidado do metabolismo."
          />
          <ol className="relative mt-12 md:mx-auto md:max-w-4xl">
            <span className="absolute bottom-6 left-[23px] top-6 w-px bg-marinho-200 md:left-1/2 md:-translate-x-1/2" aria-hidden="true" />
            {LINHA_DO_TEMPO.map((item, i) => {
              const direita = i % 2 === 1
              return (
                <li key={`${item.titulo}-${item.lugar}`} className="relative grid grid-cols-[48px_1fr] gap-5 pb-10 last:pb-0 md:grid-cols-[1fr_48px_1fr] md:gap-8">
                  <div className="flex justify-center md:col-start-2 md:row-start-1">
                    <Hexagono tamanho={48} variante={item.tipo === 'formacao' ? 'marinho' : 'branco'} className="drop-shadow-sm">
                      {item.tipo === 'formacao' ? <IconeExame tamanho={20} /> : <IconeEstetoscopio tamanho={20} />}
                    </Hexagono>
                  </div>
                  <div
                    className={`cartao !p-5 md:!p-6 md:row-start-1 ${
                      direita ? 'md:col-start-3' : 'md:col-start-1 md:text-right'
                    }`}
                  >
                    <p className="rotulo">{item.periodo}</p>
                    <h3 className="mt-2 text-xl text-marinho">{item.titulo}</h3>
                    <p className="mt-1 text-grafite/75">{item.lugar}</p>
                    <p className="sr-only">{item.tipo === 'formacao' ? 'Formação acadêmica' : 'Experiência profissional'}</p>
                  </div>
                </li>
              )
            })}
          </ol>
          <p className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-grafite/70">
            <span className="inline-flex items-center gap-2">
              <Hexagono tamanho={20} variante="marinho" /> Formação
            </span>
            <span className="inline-flex items-center gap-2">
              <Hexagono tamanho={20} variante="branco" className="drop-shadow-sm" /> Experiência
            </span>
          </p>
        </div>
      </section>

      {/* Áreas de atuação */}
      <section className="secao" aria-labelledby="areas-titulo">
        <div className="container-site">
          <TituloSecao rotulo="Áreas de atuação" titulo={<span id="areas-titulo">Onde posso te ajudar</span>} />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {AREAS.map((a) => {
              const Icone = ICONES_AREA[a.icone]
              return (
                <li key={a.slug}>
                  <Link
                    to={`/tratamentos/${a.slug}`}
                    className="cartao group flex h-full flex-col transition-shadow hover:shadow-suave"
                  >
                    <Hexagono tamanho={56} variante="lilas">
                      <Icone tamanho={24} />
                    </Hexagono>
                    <h3 className="mt-5 text-xl text-marinho">{a.titulo}</h3>
                    <p className="mt-2 flex-1 leading-relaxed text-grafite/75">{a.resumo}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-marinho">
                      Saiba mais <IconeSeta tamanho={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Filosofia */}
      <section className="secao bg-lilas-100" aria-labelledby="filosofia-titulo">
        <div className="container-site">
          <TituloSecao
            centro
            rotulo="Filosofia de atendimento"
            titulo={<span id="filosofia-titulo">Ciência, escuta e constância</span>}
            texto="A consulta é um encontro sem pressa, para entender o que está por trás dos sintomas e construir um caminho possível."
          />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {FILOSOFIA.map(({ Icone, titulo, texto }) => (
              <li key={titulo} className="cartao text-center">
                <Hexagono tamanho={64} variante="marinho" className="mx-auto">
                  <Icone tamanho={26} />
                </Hexagono>
                <h3 className="mt-5 text-xl text-marinho">{titulo}</h3>
                <p className="mt-3 leading-relaxed text-grafite/75">{texto}</p>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <BotaoAgendar modalidade="presencial" rotulo="Sobre: filosofia" />
            <BotaoAgendar modalidade="online" className="btn-contorno" rotulo="Sobre: filosofia" />
          </div>
        </div>
      </section>

      <CtaFinal />
    </>
  )
}
