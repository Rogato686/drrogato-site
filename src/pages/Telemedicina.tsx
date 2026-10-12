import { Link } from 'react-router-dom'
import { CtaFinal, Faq, TituloSecao } from '../components/Secoes'
import { Hexagono } from '../components/Hexagono'
import { BotaoAgendar } from '../components/BotaoAgendar'
import {
  IconeAssinatura,
  IconeBrasil,
  IconeCalendario,
  IconeCelular,
  IconeCheck,
  IconeDocumento,
  IconeEscudo,
  IconeExame,
  IconeInfo,
  IconeInstagram,
  IconeRelogio,
  IconeVideo,
  IconeWhatsApp,
  IconeWifi,
  IconeX,
} from '../components/Icones'
import { useSite } from '../lib/SiteDataContext'
import { horariosPorDia } from '../lib/formatar'

const PASSOS = [
  { Icone: IconeCalendario, titulo: 'Agendamento', texto: 'Você escolhe o melhor dia e horário pelo WhatsApp, com a mensagem já pronta.' },
  { Icone: IconeWhatsApp, titulo: 'Confirmação e link', texto: 'Você recebe a confirmação e o link seguro da videochamada antes da consulta.' },
  { Icone: IconeVideo, titulo: 'Consulta por vídeo', texto: 'Conversa sem pressa, revisão de exames e construção do plano, de onde você estiver.' },
  { Icone: IconeAssinatura, titulo: 'Documentos digitais', texto: 'Receitas, atestados e pedidos de exame com assinatura eletrônica, válidos em todo o Brasil.' },
]

const INDICADO = [
  'Primeira consulta para emagrecimento, metabolismo ou saúde hormonal',
  'Retornos e acompanhamento de tratamentos em andamento',
  'Avaliação e interpretação de exames laboratoriais',
  'Ajuste de medicamentos de uso contínuo',
  'Orientações sobre alimentação, sono, atividade física e prevenção',
  'Segunda opinião sobre diagnóstico ou tratamento',
]

const NAO_INDICADO = [
  'Dor no peito, falta de ar ou desmaio',
  'Sinais de AVC: fraqueza ou dormência de um lado do corpo, fala enrolada',
  'Glicemia muito alta ou muito baixa com confusão ou sonolência',
  'Febre alta persistente, vômitos intensos ou desidratação',
  'Qualquer situação de urgência ou emergência',
  'Casos que exigem exame físico presencial detalhado',
]

const QUANDO = [
  'Ganho de peso ou dificuldade para emagrecer',
  'Cansaço e falta de energia sem explicação',
  'Dúvidas sobre exames de rotina',
  'Revisão de exames recentes',
  'Ajuste de medicação',
  'Segunda opinião',
]

const PRECISA = [
  { Icone: IconeCelular, titulo: 'Celular ou computador', texto: 'Com câmera e microfone funcionando.' },
  { Icone: IconeWifi, titulo: 'Boa conexão', texto: 'Internet estável e um lugar reservado e bem iluminado.' },
  { Icone: IconeExame, titulo: 'Exames recentes', texto: 'Em PDF ou foto, além da lista de medicamentos e doses.' },
]

const LEI = 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14510.htm'
const CFM = 'https://sistemas.cfm.org.br/normas/visualizar/resolucoes/BR/2022/2314'

export default function Telemedicina() {
  const { telemedicina, faq, redes } = useSite()
  const horarios = horariosPorDia(telemedicina.horarios)
  const perguntas = faq.filter((f) => f.pagina === 'telemedicina' && f.ativo).sort((a, b) => a.ordem - b.ordem)
  const ativo = telemedicina.ativo

  return (
    <>
      {/* 1. Hero (o header começa transparente nesta rota) */}
      <section className="relative overflow-hidden bg-marinho pb-16 pt-32 text-white md:pb-24 md:pt-40">
        <img
          src="/logo/simbolo-branco.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-16 w-96 opacity-[0.06] md:w-[520px]"
        />
        <div className="container-site relative">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-lilas ring-1 ring-white/20">
            <IconeBrasil tamanho={18} /> Todo o Brasil
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-light leading-tight text-white md:text-6xl">
            Teleconsulta: atendimento de onde você estiver
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-lilas-200">
            Consulta por videochamada para emagrecimento, performance e longevidade, com o mesmo cuidado do consultório e
            documentos digitais válidos em todo o país.
          </p>

          {ativo ? (
            <>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <BotaoAgendar modalidade="online" className="btn-lilas" rotulo="Telemedicina: hero" icone />
                <a href="#como-funciona" className="btn-contorno-branco">
                  Como funciona
                </a>
              </div>
              <div className="mt-10 inline-flex max-w-xl items-start gap-3 rounded-2xl bg-white/5 p-5 ring-1 ring-white/15">
                <IconeRelogio tamanho={22} className="mt-0.5 shrink-0 text-lilas" />
                <div>
                  <p className="font-medium text-white">Dias e horários da teleconsulta</p>
                  {horarios.length ? (
                    <ul className="mt-1 text-lilas-200">
                      {horarios.map((h) => (
                        <li key={h.diaNum}>
                          {h.dia}: {h.faixas}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-lilas-200">Horários sob consulta pelo WhatsApp</p>
                  )}
                  {telemedicina.observacoes && <p className="mt-2 whitespace-pre-line text-sm text-lilas-200">{telemedicina.observacoes}</p>}
                </div>
              </div>
            </>
          ) : (
            <div role="status" className="mt-8 max-w-xl rounded-2xl bg-white p-6 text-grafite">
              <p className="flex items-center gap-2 font-medium text-marinho">
                <IconeInfo tamanho={20} /> Teleconsulta temporariamente indisponível
              </p>
              <p className="mt-2 text-grafite/80">
                No momento, a agenda online está pausada. Você pode agendar uma consulta presencial em Teófilo Otoni ou Malacacheta.
              </p>
              <BotaoAgendar modalidade="presencial" className="btn-primario mt-5" rotulo="Telemedicina indisponível" />
            </div>
          )}
        </div>
      </section>

      {/* 2. Aviso educativo */}
      <section className="pt-12 md:pt-16" aria-label="Aviso">
        <div className="container-site">
          <div role="note" className="flex gap-4 rounded-3xl border border-lilas-300 bg-lilas-50 p-6 md:p-8">
            <Hexagono tamanho={44} variante="marinho">
              <IconeInfo tamanho={20} />
            </Hexagono>
            <p className="leading-relaxed text-grafite/85">
              <strong className="font-medium text-marinho">Conteúdo informativo.</strong> As informações desta página explicam como a
              teleconsulta funciona e não substituem a avaliação médica. Em caso de urgência ou emergência, procure o pronto-atendimento mais
              próximo ou ligue 192 (SAMU).
            </p>
          </div>
        </div>
      </section>

      {/* 3. O que é + regulamentação */}
      <section className="secao" aria-labelledby="o-que-e">
        <div className="container-site grid gap-10 md:grid-cols-2 md:gap-16">
          <TituloSecao rotulo="Telemedicina" titulo={<span id="o-que-e">O que é e como é regulamentada</span>} />
          <div className="space-y-4 text-lg leading-relaxed text-grafite/80">
            <p>
              Telemedicina é o exercício da medicina com o apoio de tecnologias digitais. Na teleconsulta, médico e paciente conversam por
              videochamada, com as mesmas responsabilidades éticas, o mesmo sigilo e o mesmo registro em prontuário de uma consulta presencial.
            </p>
            <p>
              No Brasil, ela é autorizada pela{' '}
              <a className="link" href={LEI} target="_blank" rel="noopener noreferrer">
                Lei 14.510/2022
              </a>{' '}
              e regulamentada pela{' '}
              <a className="link" href={CFM} target="_blank" rel="noopener noreferrer">
                Resolução CFM 2.314/2022
              </a>
              . A escolha pela consulta online é sua, e o médico pode indicar uma avaliação presencial sempre que julgar necessário.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Passo a passo */}
      <section id="como-funciona" className="secao scroll-mt-24 bg-lilas-100" aria-labelledby="passos">
        <div className="container-site">
          <TituloSecao centro rotulo="Passo a passo" titulo={<span id="passos">Como funciona a teleconsulta</span>} />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PASSOS.map(({ Icone, titulo, texto }, i) => (
              <li key={titulo} className="cartao relative">
                <span className="absolute right-6 top-5 font-display text-5xl font-light text-lilas-300" aria-hidden="true">
                  {i + 1}
                </span>
                <Hexagono tamanho={56} variante="marinho">
                  <Icone tamanho={24} />
                </Hexagono>
                <h3 className="mt-5 text-xl text-marinho">
                  <span className="sr-only">Etapa {i + 1}: </span>
                  {titulo}
                </h3>
                <p className="mt-2 leading-relaxed text-grafite/75">{texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Indicado / não indicado */}
      <section className="secao" aria-labelledby="indicacoes">
        <div className="container-site">
          <TituloSecao rotulo="Indicações" titulo={<span id="indicacoes">O que pode e o que não pode ser feito online</span>} />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-lilas-50 p-6 md:p-8">
              <h3 className="flex items-center gap-3 text-2xl font-light text-marinho">
                <Hexagono tamanho={40} variante="marinho">
                  <IconeCheck tamanho={18} />
                </Hexagono>
                Indicado para teleconsulta
              </h3>
              <ul className="mt-6 space-y-3">
                {INDICADO.map((t) => (
                  <li key={t} className="flex gap-3">
                    <IconeCheck tamanho={20} className="mt-0.5 shrink-0 text-marinho" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-red-200 bg-red-50/60 p-6 md:p-8">
              <h3 className="flex items-center gap-3 text-2xl font-light text-red-900">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-700 text-white">
                  <IconeX tamanho={18} />
                </span>
                Não indicado: procure atendimento presencial ou de emergência
              </h3>
              <ul className="mt-6 space-y-3 text-red-950">
                {NAO_INDICADO.map((t) => (
                  <li key={t} className="flex gap-3">
                    <IconeX tamanho={20} className="mt-0.5 shrink-0 text-red-700" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Quando procurar + 7. O que você precisa */}
      <section className="secao bg-lilas-50" aria-labelledby="quando">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <div>
            <TituloSecao rotulo="Quando procurar" titulo={<span id="quando">Motivos comuns para uma teleconsulta</span>} />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {QUANDO.map((t) => (
                <li key={t} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-marinho-400" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <TituloSecao rotulo="Preparação" titulo="O que você precisa" />
            <ul className="mt-8 space-y-4">
              {PRECISA.map(({ Icone, titulo, texto }) => (
                <li key={titulo} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card">
                  <Hexagono tamanho={48} variante="lilas">
                    <Icone tamanho={22} />
                  </Hexagono>
                  <div>
                    <h3 className="font-sans text-base font-medium text-marinho">{titulo}</h3>
                    <p className="text-grafite/75">{texto}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      {perguntas.length > 0 && (
        <section className="secao" aria-labelledby="faq-tele">
          <div className="container-site grid gap-10 md:grid-cols-[4fr_8fr]">
            <TituloSecao rotulo="Perguntas frequentes" titulo={<span id="faq-tele">Dúvidas sobre a teleconsulta</span>} />
            <Faq itens={perguntas} id="faq-tele" />
          </div>
        </section>
      )}

      {/* 9. CTA final */}
      {ativo ? (
        <CtaFinal titulo="Agende sua teleconsulta" texto="Atendimento por videochamada para todo o Brasil, com receitas e pedidos de exame digitais." so="online" />
      ) : (
        <CtaFinal titulo="Prefere uma consulta presencial?" texto="Enquanto a teleconsulta está pausada, você pode agendar em Teófilo Otoni ou Malacacheta." so="presencial" />
      )}

      {/* 10. Base legal + novidades */}
      <section className="secao" aria-labelledby="base-legal">
        <div className="container-site grid gap-8 md:grid-cols-2">
          <div className="cartao">
            <Hexagono tamanho={48} variante="lilas">
              <IconeEscudo tamanho={22} />
            </Hexagono>
            <h2 id="base-legal" className="mt-4 font-display text-2xl font-light text-marinho">
              Base legal
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3">
                <IconeDocumento tamanho={20} className="mt-0.5 shrink-0 text-marinho" />
                <span>
                  <a className="link" href={LEI} target="_blank" rel="noopener noreferrer">
                    Lei nº 14.510, de 27 de dezembro de 2022
                  </a>
                  <span className="block text-sm text-grafite/70">Autoriza e disciplina a prática da telessaúde em todo o território nacional.</span>
                </span>
              </li>
              <li className="flex gap-3">
                <IconeDocumento tamanho={20} className="mt-0.5 shrink-0 text-marinho" />
                <span>
                  <a className="link" href={CFM} target="_blank" rel="noopener noreferrer">
                    Resolução CFM nº 2.314/2022
                  </a>
                  <span className="block text-sm text-grafite/70">Define e regulamenta a telemedicina como forma de serviço médico.</span>
                </span>
              </li>
            </ul>
            <p className="mt-5 text-sm text-grafite/70">
              Seus dados são tratados conforme a <Link className="link" to="/politica-de-privacidade">Política de Privacidade</Link>.
            </p>
          </div>
          {redes.instagram && (
            <div className="cartao flex flex-col bg-marinho text-white">
              <Hexagono tamanho={48} variante="contorno-branco">
                <IconeInstagram tamanho={20} />
              </Hexagono>
              <h2 className="mt-4 font-display text-2xl font-light text-white">Receba novidades</h2>
              <p className="mt-3 flex-1 leading-relaxed text-lilas-200">
                Conteúdos sobre metabolismo, emagrecimento e longevidade, com informação de qualidade, no Instagram do Dr. Rogato.
              </p>
              <a
                href={redes.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-lilas mt-6 self-start"
              >
                <IconeInstagram tamanho={18} /> Seguir no Instagram
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
