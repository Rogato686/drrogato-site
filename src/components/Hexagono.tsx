import type { ReactNode } from 'react'

export const HEX_PATH =
  'M35.51 4.50Q43.30 0.00 51.10 4.50L78.81 20.50Q86.60 25.00 86.60 34.00L86.60 66.00Q86.60 75.00 78.81 79.50L51.10 95.50Q43.30 100.00 35.51 95.50L7.79 79.50Q-0.00 75.00 -0.00 66.00L-0.00 34.00Q-0.00 25.00 7.79 20.50Z'
const HEX_BBOX =
  'M0.4100 0.0450Q0.5000 0.0000 0.5900 0.0450L0.9100 0.2050Q1.0000 0.2500 1.0000 0.3400L1.0000 0.6600Q1.0000 0.7500 0.9100 0.7950L0.5900 0.9550Q0.5000 1.0000 0.4100 0.9550L0.0900 0.7950Q-0.0000 0.7500 -0.0000 0.6600L-0.0000 0.3400Q-0.0000 0.2500 0.0900 0.2050Z'

type Variante = 'marinho' | 'lilas' | 'contorno' | 'contorno-branco' | 'branco'

const estilos: Record<Variante, { fill: string; stroke: string; texto: string }> = {
  marinho: { fill: '#142F5A', stroke: 'none', texto: 'text-white' },
  lilas: { fill: '#D0D2E3', stroke: 'none', texto: 'text-marinho' },
  branco: { fill: '#FFFFFF', stroke: 'none', texto: 'text-marinho' },
  contorno: { fill: 'none', stroke: '#142F5A', texto: 'text-marinho' },
  'contorno-branco': { fill: 'none', stroke: '#FFFFFF', texto: 'text-white' },
}

/** Hexágono arredondado da marca, com conteúdo centralizado (ícone, número). */
export function Hexagono({
  children,
  tamanho = 56,
  variante = 'marinho',
  className = '',
}: {
  children?: ReactNode
  tamanho?: number
  variante?: Variante
  className?: string
}) {
  const e = estilos[variante]
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${e.texto} ${className}`}
      style={{ width: tamanho * 0.866, height: tamanho }}
      aria-hidden={children ? undefined : true}
    >
      <svg viewBox="-2 -2 90.6 104" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d={HEX_PATH} fill={e.fill} stroke={e.stroke} strokeWidth={e.stroke === 'none' ? 0 : 4} />
      </svg>
      <span className="relative flex items-center justify-center">{children}</span>
    </span>
  )
}

/** Foto recortada em hexágono arredondado. */
export function FotoHexagono({ src, srcJpg, alt, className = '', posicao = '50% 25%' }: { src: string; srcJpg?: string; alt: string; className?: string; posicao?: string }) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: '0.866 / 1' }}>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <clipPath id="hex-clip" clipPathUnits="objectBoundingBox">
          <path d={HEX_BBOX} />
        </clipPath>
      </svg>
      <picture>
        <source srcSet={src} type="image/webp" />
        <img
          src={srcJpg || src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={{ clipPath: 'url(#hex-clip)', objectPosition: posicao }}
        />
      </picture>
    </div>
  )
}
