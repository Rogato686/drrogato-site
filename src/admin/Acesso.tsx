import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Campo, TelaCentral, emailValido } from './ui'

function traduzirAuth(m: string) {
  if (/invalid login credentials/i.test(m)) return 'E-mail ou senha incorretos.'
  if (/email not confirmed/i.test(m)) return 'E-mail ainda não confirmado. Verifique sua caixa de entrada.'
  if (/rate limit|too many/i.test(m)) return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
  if (/should be at least|weak password/i.test(m)) return 'A senha é muito fraca. Use ao menos 8 caracteres, com letras e números.'
  if (/same.*password|different from the old/i.test(m)) return 'A nova senha precisa ser diferente da anterior.'
  if (/Failed to fetch/i.test(m)) return 'Sem conexão com o servidor. Tente novamente.'
  return m
}

export function Login() {
  const [modo, setModo] = useState<'entrar' | 'recuperar'>('entrar')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [info, setInfo] = useState('')

  async function entrar(e: FormEvent) {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    const { error } = await supabase!.auth.signInWithPassword({ email: email.trim(), password: senha })
    setEnviando(false)
    if (error) setErro(traduzirAuth(error.message))
  }

  async function recuperar(e: FormEvent) {
    e.preventDefault()
    setErro('')
    setInfo('')
    if (!email.trim() || !emailValido(email.trim())) return setErro('Informe um e-mail válido.')
    setEnviando(true)
    const { error } = await supabase!.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/admin/nova-senha` })
    setEnviando(false)
    if (error) setErro(traduzirAuth(error.message))
    else setInfo('Se o e-mail estiver cadastrado, você receberá um link para criar uma nova senha em instantes.')
  }

  return (
    <TelaCentral>
      <h1 className="mb-1 text-center font-display text-2xl font-light">{modo === 'entrar' ? 'Painel administrativo' : 'Recuperar senha'}</h1>
      <p className="mb-6 text-center text-sm text-marinho-400">{modo === 'entrar' ? 'Acesso restrito.' : 'Enviaremos um link para o seu e-mail.'}</p>
      <form onSubmit={modo === 'entrar' ? entrar : recuperar} className="space-y-4" noValidate>
        <Campo rotulo="E-mail">
          {(p) => <input {...p} type="email" autoComplete="username" required className="campo" value={email} onChange={(e) => setEmail(e.target.value)} />}
        </Campo>
        {modo === 'entrar' && (
          <Campo rotulo="Senha">
            {(p) => (
              <input {...p} type="password" autoComplete="current-password" required className="campo" value={senha} onChange={(e) => setSenha(e.target.value)} />
            )}
          </Campo>
        )}
        {erro && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
            {erro}
          </p>
        )}
        {info && (
          <p role="status" className="rounded-xl bg-lilas-100 px-4 py-3 text-sm text-marinho">
            {info}
          </p>
        )}
        <button type="submit" className="btn-primario w-full" disabled={enviando}>
          {enviando ? 'Aguarde…' : modo === 'entrar' ? 'Entrar' : 'Enviar link'}
        </button>
      </form>
      <div className="mt-5 flex flex-col items-center gap-3 text-sm">
        <button
          type="button"
          className="link"
          onClick={() => {
            setModo(modo === 'entrar' ? 'recuperar' : 'entrar')
            setErro('')
            setInfo('')
          }}
        >
          {modo === 'entrar' ? 'Esqueci minha senha' : 'Voltar para o login'}
        </button>
        <a href="/" className="text-marinho-400 hover:text-marinho">
          Voltar ao site
        </a>
      </div>
    </TelaCentral>
  )
}

/** /admin/nova-senha: aberta pelo link de recuperação enviado por e-mail. */
export function NovaSenha() {
  const navigate = useNavigate()
  const [estado, setEstado] = useState<'verificando' | 'pronto' | 'invalido' | 'concluido'>('verificando')
  const [senha, setSenha] = useState('')
  const [confirma, setConfirma] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    let vivo = true
    // O link de recuperação gera o evento PASSWORD_RECOVERY e uma sessão temporária.
    const { data } = supabase!.auth.onAuthStateChange((evt, s) => {
      if (!vivo) return
      if (evt === 'PASSWORD_RECOVERY' || (s && evt === 'SIGNED_IN')) setEstado((e) => (e === 'concluido' ? e : 'pronto'))
    })
    // O evento pode ter ocorrido antes desta tela carregar: confere a sessão atual.
    const temErroNaUrl = /error_description|error_code/.test(window.location.hash + window.location.search)
    supabase!.auth.getSession().then(({ data: d }) => {
      if (!vivo) return
      if (d.session) setEstado((e) => (e === 'verificando' ? 'pronto' : e))
      else if (temErroNaUrl) setEstado('invalido')
      else setTimeout(() => vivo && setEstado((e) => (e === 'verificando' ? 'invalido' : e)), 2500)
    })
    return () => {
      vivo = false
      data.subscription.unsubscribe()
    }
  }, [])

  async function salvar(e: FormEvent) {
    e.preventDefault()
    setErro('')
    if (senha.length < 8) return setErro('A senha precisa ter ao menos 8 caracteres.')
    if (senha !== confirma) return setErro('As senhas não conferem.')
    setEnviando(true)
    const { error } = await supabase!.auth.updateUser({ password: senha })
    setEnviando(false)
    if (error) return setErro(traduzirAuth(error.message))
    setEstado('concluido')
    setTimeout(() => navigate('/admin', { replace: true }), 1800)
  }

  return (
    <TelaCentral>
      <h1 className="mb-6 text-center font-display text-2xl font-light">Criar nova senha</h1>
      {estado === 'verificando' && <p className="text-center text-sm text-marinho-400" aria-busy="true">Verificando o link…</p>}
      {estado === 'invalido' && (
        <div className="space-y-4 text-center text-sm">
          <p>O link de recuperação é inválido ou expirou. Solicite um novo na tela de login.</p>
          <Link to="/admin" className="btn-primario w-full">
            Ir para o login
          </Link>
        </div>
      )}
      {estado === 'concluido' && (
        <p role="status" className="rounded-xl bg-lilas-100 px-4 py-3 text-center text-sm text-marinho">
          Senha alterada com sucesso. Abrindo o painel…
        </p>
      )}
      {estado === 'pronto' && (
        <form onSubmit={salvar} className="space-y-4" noValidate>
          <Campo rotulo="Nova senha" dica="Mínimo de 8 caracteres.">
            {(p) => <input {...p} type="password" autoComplete="new-password" className="campo" value={senha} onChange={(e) => setSenha(e.target.value)} />}
          </Campo>
          <Campo rotulo="Confirme a nova senha">
            {(p) => <input {...p} type="password" autoComplete="new-password" className="campo" value={confirma} onChange={(e) => setConfirma(e.target.value)} />}
          </Campo>
          {erro && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
              {erro}
            </p>
          )}
          <button type="submit" className="btn-primario w-full" disabled={enviando}>
            {enviando ? 'Salvando…' : 'Salvar nova senha'}
          </button>
        </form>
      )}
    </TelaCentral>
  )
}
