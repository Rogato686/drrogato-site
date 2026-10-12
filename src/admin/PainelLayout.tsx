import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Logo } from '../components/Logo'
import { IconeDocumento, IconeEmail, IconeLink, IconeLocal, IconeMenu, IconeSeta, IconeVideo, IconeX } from '../components/Icones'

type Item = { to: string; rotulo: string; icone: ReactNode; sub?: { to: string; rotulo: string }[] }

const ITENS: Item[] = [
  { to: '/admin/consultorios', rotulo: 'Consultórios', icone: <IconeLocal tamanho={20} /> },
  { to: '/admin/telemedicina', rotulo: 'Telemedicina', icone: <IconeVideo tamanho={20} /> },
  { to: '/admin/contatos', rotulo: 'Contatos e redes', icone: <IconeLink tamanho={20} /> },
  {
    to: '/admin/conteudo',
    rotulo: 'Conteúdo',
    icone: <IconeDocumento tamanho={20} />,
    sub: [
      { to: '/admin/conteudo/hero', rotulo: 'Hero' },
      { to: '/admin/conteudo/faq', rotulo: 'FAQ' },
      { to: '/admin/conteudo/avisos', rotulo: 'Avisos' },
      { to: '/admin/conteudo/instagram', rotulo: 'Instagram' },
      { to: '/admin/conteudo/rastreamento', rotulo: 'Rastreamento' },
    ],
  },
  { to: '/admin/mensagens', rotulo: 'Mensagens', icone: <IconeEmail tamanho={20} /> },
]

function Navegacao({ email }: { email: string }) {
  const { pathname } = useLocation()
  const cls = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
      isActive ? 'bg-white/15 font-medium text-white' : 'text-lilas-200 hover:bg-white/10 hover:text-white'
    }`
  return (
    <nav aria-label="Painel" className="flex flex-1 flex-col">
      <ul className="space-y-1">
        {ITENS.map((it) => (
          <li key={it.to}>
            <NavLink to={it.sub ? it.sub[0].to : it.to} className={() => cls({ isActive: pathname.startsWith(it.to) })}>
              {it.icone}
              {it.rotulo}
            </NavLink>
            {it.sub && (
              <ul className="ml-9 mt-1 space-y-0.5 border-l border-white/15 pl-3">
                {it.sub.map((s) => (
                  <li key={s.to}>
                    <NavLink
                      to={s.to}
                      className={({ isActive }) =>
                        `block rounded-lg px-2 py-1.5 text-sm ${isActive ? 'font-medium text-white' : 'text-lilas-300 hover:text-white'}`
                      }
                    >
                      {s.rotulo}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-auto space-y-2 border-t border-white/15 pt-4">
        <a href="/" target="_blank" rel="noopener" className="btn-contorno-branco w-full !min-h-[44px] !py-2 !text-xs">
          Ver site <IconeSeta tamanho={16} />
        </a>
        <button type="button" onClick={() => supabase?.auth.signOut()} className="btn w-full !min-h-[44px] !py-2 !text-xs text-lilas-200 hover:text-white">
          Sair
        </button>
        {email && <p className="truncate px-1 text-center text-xs text-lilas-400" title={email}>{email}</p>}
      </div>
    </nav>
  )
}

export function PainelLayout({ email, children }: { email: string; children: ReactNode }) {
  const [aberto, setAberto] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setAberto(false), [pathname])

  return (
    <div className="lg:flex">
      <a href="#conteudo-painel" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
        Pular para o conteúdo
      </a>
      {/* Celular: menu superior */}
      <header className="sticky top-0 z-30 bg-marinho text-white lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Logo versao="horizontal-sem-tagline" cor="branco" className="h-7 w-auto" />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"
            aria-expanded={aberto}
            aria-controls="menu-painel"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setAberto(!aberto)}
          >
            {aberto ? <IconeX /> : <IconeMenu />}
          </button>
        </div>
        {aberto && (
          <div id="menu-painel" className="flex max-h-[calc(100vh-4rem)] flex-col overflow-y-auto px-4 pb-6">
            <Navegacao email={email} />
          </div>
        )}
      </header>
      {/* Desktop: barra lateral */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto bg-marinho px-4 py-6 text-white lg:flex">
        <div className="mb-8 px-2">
          <Logo versao="horizontal-sem-tagline" cor="branco" className="h-8 w-auto" />
          <p className="mt-2 text-xs uppercase tracking-rotulo text-lilas-300">Painel</p>
        </div>
        <Navegacao email={email} />
      </aside>
      <main id="conteudo-painel" className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  )
}
