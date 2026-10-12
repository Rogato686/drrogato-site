import { createContext, useCallback, useContext, useId, useRef, useState, type ReactNode } from 'react'
import { DIAS } from '../lib/constantes'
import type { Horario } from '../lib/types'
import { Logo } from '../components/Logo'
import { IconeCheck, IconeInfo, IconeMais, IconeX } from '../components/Icones'

/* ---------- Toast ---------- */

type Toast = { id: number; tipo: 'ok' | 'erro'; texto: string }
type Avisar = (tipo: 'ok' | 'erro', texto: string) => void
const ToastCtx = createContext<Avisar>(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [lista, setLista] = useState<Toast[]>([])
  const seq = useRef(0)
  const avisar = useCallback<Avisar>((tipo, texto) => {
    const id = ++seq.current
    setLista((l) => [...l, { id, tipo, texto }])
    setTimeout(() => setLista((l) => l.filter((t) => t.id !== id)), tipo === 'erro' ? 7000 : 3500)
  }, [])
  return (
    <ToastCtx.Provider value={avisar}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:left-auto" aria-live="polite" role="status">
        {lista.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex max-w-sm items-start gap-3 rounded-2xl px-4 py-3 text-sm shadow-suave ${
              t.tipo === 'ok' ? 'bg-marinho text-white' : 'bg-red-700 text-white'
            }`}
          >
            {t.tipo === 'ok' ? <IconeCheck tamanho={20} className="shrink-0" /> : <IconeInfo tamanho={20} className="shrink-0" />}
            <span className="flex-1">{t.texto}</span>
            <button type="button" onClick={() => setLista((l) => l.filter((x) => x.id !== t.id))} aria-label="Fechar aviso" className="shrink-0 opacity-80 hover:opacity-100">
              <IconeX tamanho={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

/** Traduz erros comuns do Supabase para mensagens legíveis. */
export function msgErro(e: unknown): string {
  const m = (e && typeof e === 'object' && 'message' in e ? String((e as { message: unknown }).message) : String(e || '')) || 'Erro desconhecido'
  if (/row-level security|permission denied/i.test(m)) return 'Sem permissão para salvar. Verifique se seu usuário é administrador.'
  if (/Failed to fetch|NetworkError/i.test(m)) return 'Sem conexão com o servidor. Tente novamente.'
  if (/JWT expired/i.test(m)) return 'Sua sessão expirou. Entre novamente.'
  return m
}

/* ---------- Campos ---------- */

export function Campo({
  rotulo,
  dica,
  erro,
  children,
  className = '',
}: {
  rotulo: string
  dica?: ReactNode
  erro?: string
  children: (props: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }) => ReactNode
  className?: string
}) {
  const id = useId()
  const desc = dica || erro ? `${id}-d` : undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-marinho">
        {rotulo}
      </label>
      {children({ id, 'aria-describedby': desc, 'aria-invalid': erro ? true : undefined })}
      {(dica || erro) && (
        <p id={desc} className={`mt-1 text-xs ${erro ? 'text-red-700' : 'text-marinho-400'}`}>
          {erro || dica}
        </p>
      )}
    </div>
  )
}

export function Chave({ ativo, onChange, rotulo, ocultarRotulo }: { ativo: boolean; onChange: (v: boolean) => void; rotulo: string; ocultarRotulo?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ativo}
      onClick={() => onChange(!ativo)}
      className="inline-flex min-h-[40px] items-center gap-2 text-sm text-marinho"
    >
      <span className={`relative h-6 w-11 rounded-full transition-colors ${ativo ? 'bg-marinho' : 'bg-marinho-200'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${ativo ? 'left-[22px]' : 'left-0.5'}`} />
      </span>
      <span className={ocultarRotulo ? 'sr-only' : ''}>{rotulo}</span>
    </button>
  )
}

export function TituloPainel({ titulo, descricao, acoes }: { titulo: string; descricao?: string; acoes?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-light md:text-3xl">{titulo}</h1>
        {descricao && <p className="mt-1 max-w-2xl text-sm text-marinho-400">{descricao}</p>}
      </div>
      {acoes && <div className="flex flex-wrap gap-2">{acoes}</div>}
    </div>
  )
}

export const btnPeq =
  'inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-marinho-200 px-4 py-2 text-sm text-marinho transition-colors hover:border-marinho hover:bg-marinho-50 disabled:cursor-not-allowed disabled:opacity-40'
export const btnIcone =
  'inline-flex h-10 w-10 items-center justify-center rounded-full border border-marinho-200 text-marinho transition-colors hover:border-marinho hover:bg-marinho-50 disabled:cursor-not-allowed disabled:opacity-30'
export const btnPerigo =
  'inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm text-red-700 transition-colors hover:border-red-700 hover:bg-red-50'

export function Carregando({ texto = 'Carregando…' }: { texto?: string }) {
  return (
    <div className="flex min-h-[30vh] items-center justify-center text-sm text-marinho-400" aria-busy="true">
      {texto}
    </div>
  )
}

/* ---------- Validação ---------- */

export const hm = (t: string | null | undefined) => (t || '').slice(0, 5)

export function urlValida(v: string) {
  if (!v) return true
  try {
    const u = new URL(v)
    return (u.protocol === 'https:' || u.protocol === 'http:') && u.hostname.includes('.')
  } catch {
    return false
  }
}

/** Acrescenta https:// quando o usuário cola só o domínio. */
export function normalizarUrl(v: string) {
  const t = v.trim()
  if (!t) return ''
  if (/^https?:\/\//i.test(t)) return t
  if (/^[\w-]+(\.[\w-]+)+/.test(t)) return `https://${t}`
  return t
}

export const emailValido = (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

/* ---------- Grade semanal ---------- */

export type Faixa = { inicio: string; fim: string }
export type Grade = { ativo: boolean; faixas: Faixa[] }[] // índice = dia_semana (0 = domingo)

/** Segunda a domingo */
export const ORDEM_DIAS = [1, 2, 3, 4, 5, 6, 0]

export function gradeDeHorarios(hs: Horario[]): Grade {
  const g: Grade = Array.from({ length: 7 }, () => ({ ativo: false, faixas: [] }))
  for (const h of [...hs].sort((a, b) => hm(a.inicio).localeCompare(hm(b.inicio)))) {
    const d = g[h.dia_semana]
    if (!d) continue
    d.ativo = true
    d.faixas.push({ inicio: hm(h.inicio), fim: hm(h.fim) })
  }
  return g
}

export function horariosDaGrade(g: Grade): Horario[] {
  const r: Horario[] = []
  g.forEach((d, dia) => {
    if (!d.ativo) return
    for (const f of d.faixas) if (f.inicio && f.fim) r.push({ dia_semana: dia, inicio: f.inicio, fim: f.fim })
  })
  return r
}

/** Devolve a primeira inconsistência da grade, ou null. */
export function validarGrade(g: Grade): string | null {
  for (const dia of ORDEM_DIAS) {
    const d = g[dia]
    if (!d.ativo) continue
    if (!d.faixas.length) return `${DIAS[dia]}: adicione ao menos um intervalo ou desmarque o dia.`
    const fs = [...d.faixas].sort((a, b) => a.inicio.localeCompare(b.inicio))
    for (let i = 0; i < fs.length; i++) {
      const f = fs[i]
      if (!f.inicio || !f.fim) return `${DIAS[dia]}: preencha início e fim de todos os intervalos.`
      if (f.fim <= f.inicio) return `${DIAS[dia]}: o fim (${f.fim}) precisa ser depois do início (${f.inicio}).`
      if (i > 0 && f.inicio < fs[i - 1].fim) return `${DIAS[dia]}: há intervalos sobrepostos.`
    }
  }
  return null
}

export function GradeSemanal({ grade, onChange }: { grade: Grade; onChange: (g: Grade) => void }) {
  const alterar = (dia: number, fn: (d: Grade[number]) => Grade[number]) => onChange(grade.map((d, i) => (i === dia ? fn(d) : d)))
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-medium text-marinho">Dias e horários</legend>
      {ORDEM_DIAS.map((dia) => {
        const d = grade[dia]
        const idDia = `dia-${dia}`
        return (
          <div key={dia} className={`rounded-2xl border p-3 sm:flex sm:items-start sm:gap-4 ${d.ativo ? 'border-marinho-200 bg-white' : 'border-lilas-200 bg-lilas-50'}`}>
            <label htmlFor={idDia} className="flex min-h-[40px] w-32 shrink-0 cursor-pointer items-center gap-2 text-sm font-medium text-marinho">
              <input
                id={idDia}
                type="checkbox"
                className="h-5 w-5 accent-marinho"
                checked={d.ativo}
                onChange={(e) =>
                  alterar(dia, (x) => ({ ativo: e.target.checked, faixas: e.target.checked && !x.faixas.length ? [{ inicio: '08:00', fim: '12:00' }] : x.faixas }))
                }
              />
              {DIAS[dia]}
            </label>
            {d.ativo ? (
              <div className="mt-2 flex flex-1 flex-col gap-2 sm:mt-0">
                {d.faixas.map((f, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-2">
                    <input
                      type="time"
                      className="campo w-[8.5rem] py-2"
                      value={f.inicio}
                      aria-label={`${DIAS[dia]}, intervalo ${i + 1}, início`}
                      onChange={(e) => alterar(dia, (x) => ({ ...x, faixas: x.faixas.map((y, j) => (j === i ? { ...y, inicio: e.target.value } : y)) }))}
                    />
                    <span className="text-sm text-marinho-400">às</span>
                    <input
                      type="time"
                      className="campo w-[8.5rem] py-2"
                      value={f.fim}
                      aria-label={`${DIAS[dia]}, intervalo ${i + 1}, fim`}
                      onChange={(e) => alterar(dia, (x) => ({ ...x, faixas: x.faixas.map((y, j) => (j === i ? { ...y, fim: e.target.value } : y)) }))}
                    />
                    <button
                      type="button"
                      className={btnIcone}
                      aria-label={`Remover intervalo ${i + 1} de ${DIAS[dia]}`}
                      onClick={() => alterar(dia, (x) => ({ ...x, faixas: x.faixas.filter((_, j) => j !== i) }))}
                    >
                      <IconeX tamanho={18} />
                    </button>
                  </div>
                ))}
                <div>
                  <button
                    type="button"
                    className={btnPeq}
                    onClick={() =>
                      alterar(dia, (x) => {
                        const ult = x.faixas[x.faixas.length - 1]
                        return { ...x, faixas: [...x.faixas, ult ? { inicio: ult.fim, fim: ult.fim < '18:00' ? '18:00' : '23:00' } : { inicio: '08:00', fim: '12:00' }] }
                      })
                    }
                  >
                    <IconeMais tamanho={16} /> Intervalo
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-sm text-marinho-300 sm:mt-2.5">Sem atendimento</p>
            )}
          </div>
        )
      })}
    </fieldset>
  )
}

/* ---------- Tela central (login, avisos) ---------- */

export function TelaCentral({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="cartao w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo versao="vertical-sem-tagline" cor="azul" className="h-24 w-auto" alt="Dr. Rogato" />
        </div>
        {children}
      </div>
    </main>
  )
}

