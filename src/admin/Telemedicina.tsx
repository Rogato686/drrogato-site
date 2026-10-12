import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { Horario } from '../lib/types'
import { Campo, Carregando, Chave, GradeSemanal, TituloPainel, gradeDeHorarios, hm, horariosDaGrade, msgErro, normalizarUrl, urlValida, useToast, validarGrade, type Grade } from './ui'

export default function Telemedicina() {
  const toast = useToast()
  const [carregado, setCarregado] = useState(false)
  const [ativo, setAtivo] = useState(true)
  const [grade, setGrade] = useState<Grade>(() => gradeDeHorarios([]))
  const [observacoes, setObservacoes] = useState('')
  const [agendaUrl, setAgendaUrl] = useState('')
  const [erros, setErros] = useState<Record<string, string>>({})
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    supabase!
      .from('config_telemedicina')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) toast('erro', `Não foi possível carregar: ${msgErro(error)}`)
        if (data) {
          setAtivo(Boolean(data.ativo))
          setGrade(gradeDeHorarios(((data.horarios as Horario[]) || []).map((h) => ({ dia_semana: Number(h.dia_semana), inicio: hm(h.inicio), fim: hm(h.fim) }))))
          setObservacoes(data.observacoes || '')
          setAgendaUrl(data.agenda_url || '')
        }
        setCarregado(true)
      })
  }, [toast])

  async function salvar(ev: FormEvent) {
    ev.preventDefault()
    const e: Record<string, string> = {}
    const g = validarGrade(grade)
    if (g) e.grade = g
    const url = normalizarUrl(agendaUrl)
    if (!urlValida(url)) e.agenda_url = 'Link inválido.'
    setErros(e)
    if (Object.keys(e).length) return toast('erro', 'Revise os campos destacados antes de salvar.')
    setSalvando(true)
    const { error } = await supabase!
      .from('config_telemedicina')
      .upsert({ id: 1, ativo, horarios: horariosDaGrade(grade), observacoes: observacoes.trim(), agenda_url: url })
    setSalvando(false)
    if (error) toast('erro', `Erro ao salvar: ${msgErro(error)}`)
    else {
      setAgendaUrl(url)
      toast('ok', 'Telemedicina salva.')
    }
  }

  if (!carregado) return <Carregando />

  return (
    <form onSubmit={salvar} noValidate>
      <TituloPainel titulo="Telemedicina" descricao="Ligue ou desligue a teleconsulta e defina os dias e horários exibidos no site." />
      <div className="space-y-6">
        <section className="cartao space-y-4">
          <Chave ativo={ativo} onChange={setAtivo} rotulo={ativo ? 'Teleconsulta ligada' : 'Teleconsulta desligada'} />
          {!ativo && <p className="text-sm text-marinho-400">Com a teleconsulta desligada, o site deixa de oferecer o agendamento online.</p>}
          <Campo rotulo="Link de agendamento (opcional)" erro={erros.agenda_url} dica="Se ficar vazio, o agendamento é feito pelo WhatsApp.">
            {(p) => <input {...p} type="url" className="campo" value={agendaUrl} onChange={(e) => setAgendaUrl(e.target.value)} />}
          </Campo>
          <Campo rotulo="Observações">
            {(p) => <textarea {...p} rows={3} className="campo" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />}
          </Campo>
        </section>
        <section className="cartao">
          <h2 className="mb-4 font-display text-lg">Grade semanal</h2>
          <GradeSemanal grade={grade} onChange={setGrade} />
          {erros.grade && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {erros.grade}
            </p>
          )}
        </section>
        <div className="flex justify-end">
          <button type="submit" className="btn-primario" disabled={salvando}>
            {salvando ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>
    </form>
  )
}
