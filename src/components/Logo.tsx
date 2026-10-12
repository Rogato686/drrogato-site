type Versao = 'horizontal' | 'horizontal-sem-tagline' | 'vertical' | 'vertical-sem-tagline' | 'selo' | 'simbolo'
type Cor = 'azul' | 'branco' | 'lilas'

const proporcao: Record<Versao, number> = {
  horizontal: 2078.44 / 427.68,
  'horizontal-sem-tagline': 2015.01 / 357.2,
  vertical: 1577 / 860.27,
  'vertical-sem-tagline': 1577 / 774.27,
  selo: 434 / 482.27,
  simbolo: 434 / 482.27,
}

/** Usa só os arquivos oficiais da logomarca (sem redesenhar nem recolorir). */
export function Logo({ versao, cor, className = '', alt = 'Dr. Rogato' }: { versao: Versao; cor: Cor; className?: string; alt?: string }) {
  return (
    <img
      src={`/logo/${versao}-${cor}.svg`}
      alt={alt}
      className={className}
      width={Math.round(48 * proporcao[versao])}
      height={48}
      decoding="async"
    />
  )
}
