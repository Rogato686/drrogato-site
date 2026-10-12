import type { ReactNode } from 'react'
import { useSite } from '../lib/SiteDataContext'
import { aoClicarAgendar, destinoAgendamento, type Modalidade } from '../lib/whatsapp'
import type { Local } from '../lib/types'
import { IconeWhatsApp } from './Icones'

type Props = {
  modalidade: Modalidade
  local?: Local
  className?: string
  children?: ReactNode
  rotulo?: string
  icone?: boolean
}

/** Todo CTA de agendamento passa por aqui: WhatsApp com mensagem pronta (ou agenda externa) + evento de conversão. */
export function BotaoAgendar({ modalidade, local, className = 'btn-primario', children, rotulo, icone = false }: Props) {
  const { telemedicina } = useSite()
  const texto =
    children ??
    (modalidade === 'online' ? 'Agendar teleconsulta' : modalidade === 'presencial' ? (local ? 'Agendar neste local' : 'Agendar consulta presencial') : 'Agendar consulta')
  const href = destinoAgendamento(modalidade, { local, agendaTele: telemedicina.agenda_url })
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => aoClicarAgendar(modalidade, rotulo || String(texto), local?.nome)}
    >
      {icone && <IconeWhatsApp tamanho={18} />}
      {texto}
    </a>
  )
}
