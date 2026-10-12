import { useState, type ReactNode } from 'react'
import { BotaoAgendar } from './BotaoAgendar'
import { IconeMais } from './Icones'
import type { FaqItem } from '../lib/types'

export function TituloSecao({ rotulo, titulo, texto, centro = false, claro = false }: { rotulo?: string; titulo: ReactNode; texto?: ReactNode; centro?: boolean; claro?: boolean }) {
  return (
    <div className={`max-w-2xl ${centro ? 'mx-auto text-center' : ''}`}>
      {rotulo && <p className={`rotulo ${claro ? '!text-lilas' : ''}`}>{rotulo}</p>}
      <h2 className={`titulo-secao mt-3 ${claro ? '!text-white' : ''}`}>{titulo}</h2>
      {texto && <p className={`mt-4 text-lg leading-relaxed ${claro ? 'text-lilas-200' : 'text-grafite/80'}`}>{texto}</p>}
    </div>
  )
}

/** Cabeçalho das páginas internas (fundo lilás, compensando o header fixo). */
export function CabecalhoPagina({ rotulo, titulo, texto, children }: { rotulo?: string; titulo: ReactNode; texto?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-lilas-100 pb-14 pt-32 md:pb-20 md:pt-40">
      <img src="/logo/simbolo-azul.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -right-20 top-10 w-80 opacity-[0.05] md:w-[440px]" />
      <div className="container-site relative">
        {rotulo && <p className="rotulo">{rotulo}</p>}
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-light leading-tight text-marinho md:text-5xl">{titulo}</h1>
        {texto && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-grafite/80">{texto}</p>}
        {children}
      </div>
    </section>
  )
}

export function Faq({ itens, id = 'faq' }: { itens: FaqItem[]; id?: string }) {
  const [aberto, setAberto] = useState<string | null>(itens[0]?.id ?? null)
  return (
    <div className="divide-y divide-lilas-300 border-y border-lilas-300">
      {itens.map((f) => {
        const ab = aberto === f.id
        return (
          <div key={f.id}>
            <h3 className="font-sans text-base">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-medium text-marinho"
                aria-expanded={ab}
                aria-controls={`${id}-${f.id}`}
                onClick={() => setAberto(ab ? null : f.id)}
              >
                {f.pergunta}
                <IconeMais tamanho={20} className={`shrink-0 transition-transform duration-200 ${ab ? 'rotate-45' : ''}`} />
              </button>
            </h3>
            <div id={`${id}-${f.id}`} hidden={!ab} className="pb-5 pr-8 leading-relaxed text-grafite/80">
              {f.resposta}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function CtaFinal({ titulo = 'Pronto para começar?', texto = 'Agende sua consulta presencial em Teófilo Otoni ou Malacacheta, ou faça sua teleconsulta de onde estiver.', so }: { titulo?: string; texto?: string; so?: 'online' | 'presencial' }) {
  return (
    <section className="relative overflow-hidden bg-marinho py-20 text-center md:py-24">
      <img src="/logo/simbolo-branco.svg" alt="" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 w-[520px] -translate-x-1/2 -translate-y-1/2 opacity-[0.05]" />
      <div className="container-site relative">
        <h2 className="font-display text-3xl font-light text-white md:text-4xl">{titulo}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-lilas-200">{texto}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {so !== 'online' && <BotaoAgendar modalidade="presencial" className="btn-lilas" rotulo="CTA final" />}
          {so !== 'presencial' && <BotaoAgendar modalidade="online" className="btn-contorno-branco" rotulo="CTA final" />}
        </div>
      </div>
    </section>
  )
}
