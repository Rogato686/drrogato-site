export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) || 'https://drrogato.com.br'

export const MEDICO = {
  nome: 'Dr. Rogato Abrantes de Quadros Filho',
  nomeCurto: 'Dr. Rogato',
  crm: 'CRM-MG 83269',
  titulo: 'Médico pós-graduado em Endocrinologia pelo IPEMED',
  tituloCurto: 'Pós-graduado em Endocrinologia (IPEMED)',
  atuacao: 'Endocrinologia, Emagrecimento, Performance e Longevidade',
}

export const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
export const DIAS_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export const AREAS = [
  {
    slug: 'emagrecimento',
    titulo: 'Emagrecimento e obesidade',
    resumo: 'Perda de peso com estratégia, segurança e acompanhamento, respeitando sua rotina e sua história.',
    icone: 'balanca',
  },
  {
    slug: 'performance',
    titulo: 'Performance e composição corporal',
    resumo: 'Mais massa magra, menos gordura e energia para treinar, trabalhar e viver bem.',
    icone: 'raio',
  },
  {
    slug: 'longevidade',
    titulo: 'Longevidade e saúde metabólica',
    resumo: 'Prevenção e cuidado do metabolismo para envelhecer com saúde, disposição e autonomia.',
    icone: 'coracao',
  },
  {
    slug: 'endocrinologia',
    titulo: 'Endocrinologia geral',
    resumo: 'Tireoide, diabetes, resistência à insulina e distúrbios hormonais, com avaliação completa.',
    icone: 'molecula',
  },
] as const

export type AreaSlug = (typeof AREAS)[number]['slug']
