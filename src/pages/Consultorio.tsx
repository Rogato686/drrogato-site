import { Link } from 'react-router-dom'
import { CabecalhoPagina, CtaFinal } from '../components/Secoes'
import { Hexagono } from '../components/Hexagono'
import { BotaoAgendar } from '../components/BotaoAgendar'
import { IconeCalendario, IconeInfo, IconeLocal, IconeRelogio, IconeSeta, IconeTelefone, IconeVideo } from '../components/Icones'
import { useSite } from '../lib/SiteDataContext'
import { enderecoCompleto, horariosPorDia, linkEmbedMaps, linkMaps, linkWaze, textoExcecao } from '../lib/formatar'
import type { Excecao, Local } from '../lib/types'

const hojeISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Só exceções que ainda não terminaram. */
const excecoesFuturas = (es: Excecao[]) => {
  const hoje = hojeISO()
  return es.filter((e) => e.data_fim >= hoje).sort((a, b) => a.data_inicio.localeCompare(b.data_inicio))
}

const soDigitos = (t: string) => t.replace(/\D/g, '')

function CartaoLocal({ l, indice }: { l: Local; indice: number }) {
  const horarios = horariosPorDia(l.horarios)
  const excecoes = excecoesFuturas(l.excecoes)
  const tituloId = `local-${l.id}`
  return (
    <article aria-labelledby={tituloId} className="overflow-hidden rounded-3xl bg-white shadow-card">
      <div className={`grid lg:grid-cols-2 ${indice % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <div className="p-6 sm:p-8 md:p-10">
          <p className="rotulo">
            {l.cidade}/{l.uf}
          </p>
          <h2 id={tituloId} className="mt-2 font-display text-3xl font-light text-marinho">
            {l.nome}
          </h2>

          {excecoes.length > 0 && (
            <div role="note" className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="flex items-center gap-2 font-medium">
                <IconeCalendario tamanho={18} /> Atenção às datas
              </p>
              <ul className="mt-2 space-y-1 pl-7">
                {excecoes.map((e, i) => (
                  <li key={e.id ?? i}>{textoExcecao(e)}</li>
                ))}
              </ul>
            </div>
          )}

          <dl className="mt-6 space-y-5">
            <div className="flex gap-4">
              <dt>
                <Hexagono tamanho={40} variante="lilas">
                  <IconeLocal tamanho={18} />
                </Hexagono>
                <span className="sr-only">Endereço</span>
              </dt>
              <dd className="pt-2 leading-relaxed">
                <address className="not-italic">{enderecoCompleto(l)}</address>
              </dd>
            </div>
            <div className="flex gap-4">
              <dt>
                <Hexagono tamanho={40} variante="lilas">
                  <IconeRelogio tamanho={18} />
                </Hexagono>
                <span className="sr-only">Dias e horários</span>
              </dt>
              <dd className="pt-2">
                {horarios.length ? (
                  <ul className="space-y-1">
                    {horarios.map((h) => (
                      <li key={h.diaNum}>
                        <span className="font-medium text-marinho">{h.dia}</span>: {h.faixas}
                      </li>
                    ))}
                  </ul>
                ) : (
                  'Horários sob consulta pelo WhatsApp'
                )}
              </dd>
            </div>
            {l.telefone && (
              <div className="flex gap-4">
                <dt>
                  <Hexagono tamanho={40} variante="lilas">
                    <IconeTelefone tamanho={18} />
                  </Hexagono>
                  <span className="sr-only">Telefone</span>
                </dt>
                <dd className="pt-2">
                  <a className="link" href={`tel:+55${soDigitos(l.telefone).replace(/^55/, '')}`}>
                    {l.telefone}
                  </a>
                </dd>
              </div>
            )}
            {l.observacoes && (
              <div className="flex gap-4">
                <dt>
                  <Hexagono tamanho={40} variante="lilas">
                    <IconeInfo tamanho={18} />
                  </Hexagono>
                  <span className="sr-only">Observações</span>
                </dt>
                <dd className="whitespace-pre-line pt-2 leading-relaxed text-grafite/80">{l.observacoes}</dd>
              </div>
            )}
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <BotaoAgendar modalidade="presencial" local={l} rotulo="Consultório" icone />
            <a href={linkMaps(l)} target="_blank" rel="noopener noreferrer" className="btn-contorno">
              Como chegar (Google Maps)
            </a>
            <a href={linkWaze(l)} target="_blank" rel="noopener noreferrer" className="btn-contorno">
              Abrir no Waze
            </a>
          </div>
        </div>
        <div className="min-h-[320px] bg-lilas-100">
          <iframe
            src={linkEmbedMaps(l)}
            title={`Mapa com a localização da ${l.nome}, em ${l.cidade}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-[320px] w-full border-0"
          />
        </div>
      </div>
    </article>
  )
}

export default function Consultorio() {
  const { locais, telemedicina } = useSite()
  const ativos = locais.filter((l) => l.ativo).sort((a, b) => a.ordem - b.ordem)
  const cidades = [...new Set(ativos.map((l) => l.cidade))]

  return (
    <>
      <CabecalhoPagina
        rotulo="Consultório presencial"
        titulo={cidades.length ? `Atendimento presencial em ${cidades.join(' e ')}` : 'Atendimento presencial'}
        texto="Consultórios no Vale do Mucuri, em Minas Gerais. Confira endereços, dias de atendimento e como chegar."
      />

      <section className="secao bg-lilas-50">
        <div className="container-site space-y-10">
          {ativos.length ? (
            ativos.map((l, i) => <CartaoLocal key={l.id} l={l} indice={i} />)
          ) : (
            <div className="cartao text-center">
              <h2 className="font-display text-2xl text-marinho">Agenda presencial em atualização</h2>
              <p className="mt-3 text-grafite/80">Fale pelo WhatsApp para saber os próximos dias de atendimento.</p>
              <BotaoAgendar modalidade="presencial" className="btn-primario mt-6" rotulo="Consultório sem locais" />
            </div>
          )}
        </div>
      </section>

      {telemedicina.ativo && (
        <section className="secao" aria-labelledby="tele-chamada">
          <div className="container-site">
            <div className="flex flex-col items-start gap-8 rounded-3xl bg-lilas-100 p-8 md:flex-row md:items-center md:p-12">
              <Hexagono tamanho={88} variante="marinho">
                <IconeVideo tamanho={36} />
              </Hexagono>
              <div className="flex-1">
                <p className="rotulo">Mora longe?</p>
                <h2 id="tele-chamada" className="mt-2 font-display text-3xl font-light text-marinho">
                  Faça sua consulta por vídeo, de qualquer lugar do Brasil
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-grafite/80">
                  A teleconsulta tem o mesmo cuidado da consulta presencial, com receitas e pedidos de exame digitais válidos em todo o país.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 md:w-auto">
                <BotaoAgendar modalidade="online" rotulo="Consultório: bloco teleconsulta" />
                <Link to="/telemedicina" className="btn-contorno">
                  Como funciona <IconeSeta tamanho={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <CtaFinal />
    </>
  )
}
