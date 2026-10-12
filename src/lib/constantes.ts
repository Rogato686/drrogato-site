export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) || 'https://drrogato.com.br'

export const MEDICO = {
  nome: 'Dr. Rogato Abrantes de Quadros Filho',
  nomeCurto: 'Dr. Rogato',
  crm: 'CRM-MG 83269',
  titulo: 'Médico pós-graduado em Endocrinologia pelo IPEMED, NÃO ESPECIALISTA',
  tituloCurto: 'Pós-graduado em Endocrinologia (IPEMED), NÃO ESPECIALISTA',
  atuacao: 'Emagrecimento, Performance e Longevidade',
}

// CFM 2.336/2023, art. 5º: estabelecimento divulga seu registro no CRM e o diretor técnico.
export const CLINICA = {
  nome: 'Clínica Dr. Rogato Quadros',
  registroCrm: 'CRM-MG 33563',
  diretorTecnico: 'Dr. Rogato Abrantes de Quadros Filho, CRM-MG 83269',
}

export const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
export const DIAS_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export const AREAS = [
  {
    slug: 'emagrecimento',
    titulo: 'Emagrecimento e controle de peso',
    resumo: 'Perda de peso com estratégia, segurança e acompanhamento, respeitando sua rotina e sua história.',
    icone: 'balanca',
  },
  {
    slug: 'performance',
    titulo: 'Performance e composição corporal',
    resumo: 'Avaliação da composição corporal, da energia e do que pode estar limitando seu desempenho.',
    icone: 'raio',
  },
  {
    slug: 'longevidade',
    titulo: 'Longevidade e saúde metabólica',
    resumo: 'Prevenção e cuidado do metabolismo para envelhecer com saúde, disposição e autonomia.',
    icone: 'coracao',
  },
] as const

export type AreaSlug = (typeof AREAS)[number]['slug']
