export type Horario = { dia_semana: number; inicio: string; fim: string } // 0 = domingo … 6 = sábado

export type Excecao = { id?: string; data_inicio: string; data_fim: string; motivo: string }

export type Local = {
  id: string
  nome: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
  cep: string
  maps_url: string
  telefone: string
  observacoes: string
  agenda_url: string
  ordem: number
  ativo: boolean
  horarios: Horario[]
  excecoes: Excecao[]
}

export type ConfigTelemedicina = {
  ativo: boolean
  horarios: Horario[]
  observacoes: string
  agenda_url: string
}

export type RedesSociais = {
  whatsapp: string // só dígitos com DDI, ex.: 5533998735429
  email: string
  instagram: string
  youtube: string
  tiktok: string
  facebook: string
  linkedin: string
  doctoralia: string
}

export type FaqItem = { id: string; pergunta: string; resposta: string; ordem: number; ativo: boolean; pagina: 'home' | 'telemedicina' }

export type Aviso = { id: string; texto: string; link: string; ativo: boolean; inicio: string | null; fim: string | null }

export type ConteudoSite = {
  hero_titulo: string
  hero_subtitulo: string
  instagram_posts: string[] // URLs de publicações do Instagram para o embed
  ga4_id: string
  gtm_id: string
  meta_pixel_id: string
}

export type SiteData = {
  locais: Local[]
  telemedicina: ConfigTelemedicina
  redes: RedesSociais
  faq: FaqItem[]
  avisos: Aviso[]
  conteudo: ConteudoSite
}

export type MensagemContato = {
  id: string
  created_at: string
  nome: string
  telefone: string
  email: string
  cidade: string
  modalidade: string
  mensagem: string
  consentimento: boolean
  lida: boolean
}
