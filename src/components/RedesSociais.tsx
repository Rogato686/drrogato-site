import { useSite } from '../lib/SiteDataContext'
import { IconeDoctoralia, IconeFacebook, IconeInstagram, IconeLinkedIn, IconeTikTok, IconeYouTube } from './Icones'

const lista = [
  { chave: 'instagram', nome: 'Instagram', Icone: IconeInstagram },
  { chave: 'youtube', nome: 'YouTube', Icone: IconeYouTube },
  { chave: 'tiktok', nome: 'TikTok', Icone: IconeTikTok },
  { chave: 'facebook', nome: 'Facebook', Icone: IconeFacebook },
  { chave: 'linkedin', nome: 'LinkedIn', Icone: IconeLinkedIn },
  { chave: 'doctoralia', nome: 'Doctoralia', Icone: IconeDoctoralia },
] as const

/** Só aparecem as redes preenchidas no painel. */
export function RedesSociais({ className = '', tamanho = 20, itemClass = '' }: { className?: string; tamanho?: number; itemClass?: string }) {
  const { redes } = useSite()
  const ativas = lista.filter((r) => redes[r.chave])
  if (!ativas.length) return null
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {ativas.map(({ chave, nome, Icone }) => (
        <li key={chave}>
          <a
            href={redes[chave]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${nome} do Dr. Rogato`}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors ${itemClass}`}
          >
            <Icone tamanho={tamanho} />
          </a>
        </li>
      ))}
    </ul>
  )
}
