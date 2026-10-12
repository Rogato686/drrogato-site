import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { Seo } from '../components/Seo'
import { Carregando, TelaCentral, ToastProvider, msgErro } from './ui'
import { Login, NovaSenha } from './Acesso'
import { PainelLayout } from './PainelLayout'
import Locais from './Locais'
import Telemedicina from './Telemedicina'
import Contatos from './Contatos'
import { Avisos, Faq, Hero, Instagram, Rastreamento } from './Conteudo'
import Mensagens from './Mensagens'

/** Painel do administrador: montado em /admin/* fora do Layout público. */
export default function AdminApp() {
  return (
    <ToastProvider>
      <Seo titulo="Painel | Dr. Rogato" noindex />
      <div className="min-h-screen bg-lilas-50 text-grafite">{supabase ? <ComSupabase /> : <SemSupabase />}</div>
    </ToastProvider>
  )
}

function SemSupabase() {
  return (
    <TelaCentral>
      <h1 className="mb-3 text-center font-display text-2xl font-light">Painel indisponível</h1>
      <p className="mb-3 text-sm leading-relaxed">
        O painel de administração precisa do Supabase configurado para funcionar. Defina as variáveis de ambiente{' '}
        <code className="rounded bg-lilas-100 px-1">VITE_SUPABASE_URL</code> e <code className="rounded bg-lilas-100 px-1">VITE_SUPABASE_ANON_KEY</code> na
        hospedagem (Vercel) ou no arquivo <code className="rounded bg-lilas-100 px-1">.env</code> e publique novamente.
      </p>
      <p className="mb-6 text-sm leading-relaxed">
        O passo a passo completo está no arquivo <strong>LEIA-ME-PUBLICACAO.md</strong>, na raiz do projeto. Enquanto isso, o site público funciona normalmente
        com os dados padrão.
      </p>
      <a href="/" className="btn-contorno w-full">
        Ver site
      </a>
    </TelaCentral>
  )
}

function ComSupabase() {
  const [sessao, setSessao] = useState<Session | null | undefined>(undefined)
  useEffect(() => {
    let vivo = true
    supabase!.auth.getSession().then(({ data }) => vivo && setSessao(data.session))
    const { data } = supabase!.auth.onAuthStateChange((_evt, s) => setSessao(s))
    return () => {
      vivo = false
      data.subscription.unsubscribe()
    }
  }, [])

  return (
    <Routes>
      <Route path="nova-senha" element={<NovaSenha />} />
      <Route path="*" element={sessao === undefined ? <Carregando /> : sessao ? <AreaRestrita sessao={sessao} /> : <Login />} />
    </Routes>
  )
}

function AreaRestrita({ sessao }: { sessao: Session }) {
  const [admin, setAdmin] = useState<boolean | null>(null)
  const [erro, setErro] = useState('')
  const uid = sessao.user.id

  useEffect(() => {
    let vivo = true
    setAdmin(null)
    supabase!
      .from('admins')
      .select('user_id')
      .eq('user_id', uid)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!vivo) return
        if (error) setErro(msgErro(error))
        setAdmin(Boolean(data))
      })
    return () => {
      vivo = false
    }
  }, [uid])

  if (admin === null) return <Carregando texto="Verificando acesso…" />
  if (!admin)
    return (
      <TelaCentral>
        <h1 className="mb-3 text-center font-display text-2xl font-light">Acesso não autorizado</h1>
        <p className="mb-2 text-center text-sm leading-relaxed">
          O usuário <strong>{sessao.user.email}</strong> não tem permissão para acessar o painel.
        </p>
        <p className="mb-6 text-center text-sm text-marinho-400">
          {erro || 'Se você deveria ter acesso, peça ao responsável pelo site para incluir seu usuário na lista de administradores.'}
        </p>
        <button type="button" className="btn-primario w-full" onClick={() => supabase!.auth.signOut()}>
          Sair
        </button>
      </TelaCentral>
    )

  return (
    <PainelLayout email={sessao.user.email || ''}>
      <Routes>
        <Route index element={<Navigate to="consultorios" replace />} />
        <Route path="consultorios" element={<Locais />} />
        <Route path="telemedicina" element={<Telemedicina />} />
        <Route path="contatos" element={<Contatos />} />
        <Route path="conteudo" element={<Navigate to="hero" replace />} />
        <Route path="conteudo/hero" element={<Hero />} />
        <Route path="conteudo/faq" element={<Faq />} />
        <Route path="conteudo/avisos" element={<Avisos />} />
        <Route path="conteudo/instagram" element={<Instagram />} />
        <Route path="conteudo/rastreamento" element={<Rastreamento />} />
        <Route path="mensagens" element={<Mensagens />} />
        <Route path="*" element={<Navigate to="consultorios" replace />} />
      </Routes>
    </PainelLayout>
  )
}
