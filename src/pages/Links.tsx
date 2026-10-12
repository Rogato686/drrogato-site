import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { Seo } from '../components/Seo'
import { IconeInstagram, IconeLink, IconeLocal, IconeVideo, IconeWhatsApp } from '../components/Icones'
import { useSite } from '../lib/SiteDataContext'
import { MEDICO } from '../lib/constantes'
import { aoClicarAgendar, destinoAgendamento, linkWhatsApp } from '../lib/whatsapp'
import { rastrearWhatsApp } from '../lib/analytics'

const classeBotao =
  'flex min-h-[60px] w-full items-center gap-4 rounded-2xl px-5 py-4 text-left font-display text-base font-medium tracking-wide transition-colors duration-200'

function Botao({ href, icone, children, destaque = false, interno = false, onClick }: { href: string; icone: ReactNode; children: ReactNode; destaque?: boolean; interno?: boolean; onClick?: () => void }) {
  const cls = `${classeBotao} ${destaque ? 'bg-lilas text-marinho hover:bg-white' : 'bg-white/10 text-white ring-1 ring-white/20 hover:bg-white hover:text-marinho'}`
  const conteudo = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center" aria-hidden="true">
        {icone}
      </span>
      <span className="flex-1">{children}</span>
    </>
  )
  if (interno)
    return (
      <Link to={href} className={cls}>
        {conteudo}
      </Link>
    )
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onClick}>
      {conteudo}
    </a>
  )
}

export default function Links() {
  const { redes, telemedicina, locais } = useSite()
  const cidades = [...new Set(locais.filter((l) => l.ativo).map((l) => l.cidade))]
  return (
    <div className="relative min-h-screen overflow-hidden bg-marinho px-4 py-10 text-white">
      <Seo />
      <img
        src="/logo/simbolo-branco.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-10 w-80 opacity-[0.05]"
      />
      <main className="relative mx-auto flex w-full max-w-md flex-col items-center">
        <Logo versao="vertical-sem-tagline" cor="branco" className="h-auto w-40" alt="Dr. Rogato" />
        <img
          src="/foto/dr-rogato-avatar.webp"
          alt="Retrato do Dr. Rogato Abrantes de Quadros Filho"
          width={400}
          height={400}
          className="mt-8 h-28 w-28 rounded-full object-cover ring-4 ring-lilas/60"
        />
        <h1 className="mt-5 text-center font-display text-2xl font-light text-white">{MEDICO.nomeCurto}</h1>
        <p className="mt-1 text-center text-sm text-lilas-200">{MEDICO.titulo}</p>
        <p className="mt-1 text-center text-xs uppercase tracking-rotulo text-lilas-200/80">{MEDICO.crm}</p>

        <nav aria-label="Links principais" className="mt-8 w-full">
          <ul className="space-y-3">
            <li>
              <Botao
                destaque
                href={destinoAgendamento('presencial')}
                icone={<IconeLocal tamanho={24} />}
                onClick={() => aoClicarAgendar('presencial', 'Links: presencial')}
              >
                Agendar consulta presencial
                {cidades.length > 0 && <span className="block font-sans text-xs font-normal opacity-75">{cidades.join(' e ')} (MG)</span>}
              </Botao>
            </li>
            {telemedicina.ativo && (
              <li>
                <Botao
                  destaque
                  href={destinoAgendamento('online', { agendaTele: telemedicina.agenda_url })}
                  icone={<IconeVideo tamanho={24} />}
                  onClick={() => aoClicarAgendar('online', 'Links: teleconsulta')}
                >
                  Agendar teleconsulta
                  <span className="block font-sans text-xs font-normal opacity-75">Online para todo o Brasil</span>
                </Botao>
              </li>
            )}
            {redes.whatsapp && (
              <li>
                <Botao
                  href={linkWhatsApp('Olá! Vim pelo Instagram e gostaria de mais informações.')}
                  icone={<IconeWhatsApp tamanho={24} />}
                  onClick={() => rastrearWhatsApp('links')}
                >
                  WhatsApp
                </Botao>
              </li>
            )}
            {redes.instagram && (
              <li>
                <Botao href={redes.instagram} icone={<IconeInstagram tamanho={22} />}>
                  Instagram
                </Botao>
              </li>
            )}
            <li>
              <Botao interno href="/" icone={<IconeLink tamanho={24} />}>
                Site drrogato.com.br
              </Botao>
            </li>
          </ul>
        </nav>

        <p className="mt-10 text-center text-xs leading-relaxed text-lilas-200/70">
          {MEDICO.nome} · {MEDICO.crm}
          <br />
          <Link to="/politica-de-privacidade" className="underline underline-offset-2 hover:text-white">
            Política de Privacidade
          </Link>
        </p>
      </main>
    </div>
  )
}
