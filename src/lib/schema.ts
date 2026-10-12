import type { SiteData, Local } from './types'

// Sem imports de valores: este arquivo também é usado pelo script de build (scripts/prerender.mjs).
const DIAS_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/** Dados estruturados schema.org: Physician (sem medicalSpecialty) + MedicalClinic por local. */
export function gerarSchema(d: Pick<SiteData, 'locais' | 'redes'>, siteUrl: string) {
  const tel = d.redes.whatsapp ? `+${d.redes.whatsapp}` : undefined
  const sameAs = (['instagram', 'youtube', 'tiktok', 'facebook', 'linkedin', 'doctoralia'] as const).map((k) => d.redes[k]).filter(Boolean)
  const clinica = (l: Local) => ({
    '@type': 'MedicalClinic',
    '@id': `${siteUrl}/consultorio#${slug(l.nome)}`,
    name: `${l.nome} (Dr. Rogato)`,
    url: `${siteUrl}/consultorio`,
    image: `${siteUrl}/og-image.jpg`,
    telephone: l.telefone || tel,
    address: {
      '@type': 'PostalAddress',
      streetAddress: [`${l.endereco}, ${l.numero}`, l.complemento].filter(Boolean).join(', '),
      addressLocality: l.cidade,
      addressRegion: l.uf,
      postalCode: l.cep,
      addressCountry: 'BR',
    },
    openingHoursSpecification: l.horarios.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${DIAS_SCHEMA[h.dia_semana]}`,
      opens: h.inicio,
      closes: h.fim,
    })),
    ...(l.maps_url ? { hasMap: l.maps_url } : {}),
  })
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Physician',
        '@id': `${siteUrl}/#medico`,
        name: 'Dr. Rogato Abrantes de Quadros Filho',
        alternateName: 'Dr. Rogato',
        description: 'Médico pós-graduado em Endocrinologia pelo IPEMED, com atuação em endocrinologia, emagrecimento, performance e longevidade. CRM-MG 83269.',
        url: siteUrl,
        image: `${siteUrl}/foto/dr-rogato-hero.jpg`,
        telephone: tel,
        email: d.redes.email || undefined,
        identifier: { '@type': 'PropertyValue', propertyID: 'CRM-MG', value: '83269' },
        areaServed: [
          { '@type': 'City', name: 'Teófilo Otoni' },
          { '@type': 'City', name: 'Malacacheta' },
          { '@type': 'AdministrativeArea', name: 'Vale do Mucuri' },
          { '@type': 'Country', name: 'Brasil' },
        ],
        availableService: { '@type': 'MedicalProcedure', name: 'Teleconsulta para todo o Brasil' },
        sameAs,
        workLocation: d.locais.map((l) => ({ '@id': `${siteUrl}/consultorio#${slug(l.nome)}` })),
      },
      ...d.locais.map(clinica),
      { '@type': 'WebSite', '@id': `${siteUrl}/#site`, url: siteUrl, name: 'Dr. Rogato', inLanguage: 'pt-BR' },
    ],
  }
}

function slug(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
