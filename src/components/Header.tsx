import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { RedesSociais } from './RedesSociais'
import { BotaoAgendar } from './BotaoAgendar'
import { IconeMenu, IconeX } from './Icones'
import { BarraAvisos } from './Globais'

export const MENU = [
  { to: '/', rotulo: 'Início' },
  { to: '/sobre', rotulo: 'Sobre' },
  { to: '/tratamentos', rotulo: 'Tratamentos' },
  { to: '/consultorio', rotulo: 'Consultório' },
  { to: '/telemedicina', rotulo: 'Telemedicina' },
  { to: '/contato', rotulo: 'Contato' },
]

/** Header fixo. Na home começa transparente sobre o hero (logo branca sem tagline) e fica branco ao rolar. */
export function Header() {
  const { pathname } = useLocation()
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)
  const sobreHero = pathname === '/' || pathname === '/telemedicina'
  const transparente = sobreHero && !rolou && !aberto

  useEffect(() => {
    const f = () => setRolou(window.scrollY > 24)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  useEffect(() => setAberto(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = aberto ? 'hidden' : ''
  }, [aberto])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background,box-shadow] duration-300 ${
        transparente ? 'bg-transparent' : 'bg-white/95 shadow-card backdrop-blur'
      }`}
    >
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2">
        Pular para o conteúdo
      </a>
      <div className={`container-site flex items-center justify-between gap-4 transition-[height] ${rolou ? 'h-16' : 'h-20'}`}>
        <Link to="/" className="flex shrink-0 items-center py-3" aria-label="Dr. Rogato, página inicial">
          {transparente ? (
            <Logo versao="horizontal-sem-tagline" cor="branco" className="h-7 w-auto md:h-8" />
          ) : (
            <>
              {/* Com tagline só quando há largura (≥ 360px de logo) e o header não está compacto */}
              <Logo versao="horizontal-sem-tagline" cor="azul" className={`h-7 w-auto ${rolou ? '' : 'xl:hidden'}`} />
              {!rolou && <Logo versao="horizontal-sem-tagline" cor="azul" className="hidden h-9 w-auto xl:block" />}
            </>
          )}
        </Link>

        <nav aria-label="Menu principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {MENU.map((m) => (
              <li key={m.to}>
                <NavLink
                  to={m.to}
                  end={m.to === '/'}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-2 font-display text-[13px] uppercase tracking-wider transition-colors ${
                      transparente ? 'text-white/90 hover:text-white' : 'text-marinho hover:bg-lilas-100'
                    } ${isActive ? (transparente ? 'text-white underline underline-offset-8' : 'bg-lilas-100') : ''}`
                  }
                >
                  {m.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <RedesSociais
            className="hidden xl:flex"
            tamanho={18}
            itemClass={transparente ? 'text-white hover:bg-white/10' : 'text-marinho hover:bg-lilas-100'}
          />
          <BotaoAgendar
            modalidade="geral"
            rotulo="Header celular"
            icone
            className={`sm:hidden ${transparente ? 'btn-lilas' : 'btn-primario'} !min-h-[40px] !gap-1.5 !px-4 !py-2 !text-xs`}
          >
            Agendar
          </BotaoAgendar>
          <BotaoAgendar
            modalidade="geral"
            rotulo="Header"
            className={`hidden sm:inline-flex ${transparente ? 'btn-lilas' : 'btn-primario'} !min-h-[42px] !px-5 !py-2`}
          >
            Agendar consulta
          </BotaoAgendar>
          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden ${transparente ? 'text-white' : 'text-marinho'}`}
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={aberto}
            aria-controls="menu-celular"
            onClick={() => setAberto((a) => !a)}
          >
            {aberto ? <IconeX /> : <IconeMenu />}
          </button>
        </div>
      </div>
      {!aberto && <BarraAvisos />}

      {aberto && (
        <div id="menu-celular" className="h-[calc(100dvh-5rem)] overflow-y-auto border-t border-lilas bg-white lg:hidden">
          <nav aria-label="Menu" className="container-site py-6">
            <ul className="space-y-1">
              {MENU.map((m) => (
                <li key={m.to}>
                  <NavLink
                    to={m.to}
                    end={m.to === '/'}
                    className={({ isActive }) =>
                      `block rounded-2xl px-4 py-3 font-display text-lg uppercase tracking-wider text-marinho ${isActive ? 'bg-lilas-100' : ''}`
                    }
                  >
                    {m.rotulo}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3">
              <BotaoAgendar modalidade="presencial" rotulo="Menu celular" />
              <BotaoAgendar modalidade="online" rotulo="Menu celular" className="btn-contorno" />
            </div>
            <RedesSociais className="mt-6 justify-center" itemClass="text-marinho hover:bg-lilas-100" />
          </nav>
        </div>
      )}
    </header>
  )
}
