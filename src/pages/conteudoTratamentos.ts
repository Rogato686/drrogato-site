import { IconeBalanca, IconeCoracao, IconeMolecula, IconeRaio } from '../components/Icones'
import type { AreaSlug } from '../lib/constantes'
import type { FaqItem } from '../lib/types'

export const ICONES_AREA = { balanca: IconeBalanca, raio: IconeRaio, coracao: IconeCoracao, molecula: IconeMolecula } as const

export type ConteudoArea = {
  chamada: string
  introducao: string
  paraQuem: string[]
  sinais: string[]
  abordagem: { titulo: string; texto: string }[]
  observacao: string
  faq: FaqItem[]
}

const faq = (slug: string, itens: [string, string][]): FaqItem[] =>
  itens.map(([pergunta, resposta], i) => ({ id: `${slug}-${i + 1}`, pergunta, resposta, ordem: i + 1, ativo: true, pagina: 'home' }))

const AVISO =
  'Este conteúdo é informativo e não substitui a consulta médica. Cada pessoa responde de forma diferente, e a indicação de qualquer exame ou tratamento depende da avaliação individual.'

export const CONTEUDO_AREAS: Record<AreaSlug, ConteudoArea> = {
  emagrecimento: {
    chamada: 'Emagrecer com estratégia, segurança e acompanhamento',
    introducao:
      'A obesidade é uma doença crônica, com causas biológicas, comportamentais e ambientais. O cuidado médico começa por entender por que o peso aumentou e o que dificulta a perda, para então construir um plano que caiba na sua rotina.',
    paraQuem: [
      'Quem tem sobrepeso ou obesidade e quer um acompanhamento médico estruturado',
      'Quem já tentou várias dietas e voltou a ganhar peso',
      'Quem tem doenças associadas ao excesso de peso, como pressão alta, gordura no fígado ou pré-diabetes',
      'Quem deseja avaliar, com critério, se há indicação de medicamentos para obesidade',
    ],
    sinais: [
      'Ganho de peso progressivo, principalmente na região abdominal',
      'Fome difícil de controlar ou episódios de compulsão',
      'Cansaço, sono ruim e pouca disposição para atividade física',
      'Alterações em exames: glicose, triglicerídeos, colesterol ou enzimas do fígado',
      'Dores nas articulações, ronco ou falta de ar aos esforços',
    ],
    abordagem: [
      { titulo: 'Avaliação completa', texto: 'Histórico do peso, rotina, sono, alimentação, medicamentos em uso, saúde emocional e objetivos.' },
      { titulo: 'Exames e composição corporal', texto: 'Investigação de causas hormonais e metabólicas e, na consulta presencial, bioimpedância quando indicada.' },
      { titulo: 'Plano individualizado', texto: 'Orientações de alimentação, atividade física e sono e, quando houver indicação, tratamento medicamentoso com segurança.' },
      { titulo: 'Acompanhamento', texto: 'Retornos para avaliar a evolução, ajustar condutas e trabalhar a manutenção do peso a longo prazo.' },
    ],
    observacao: AVISO,
    faq: faq('emagrecimento', [
      ['Vou precisar usar remédio para emagrecer?', 'Não necessariamente. Medicamentos podem ser indicados em situações específicas, depois de avaliar benefícios, riscos e contraindicações. A base do tratamento continua sendo a mudança de hábitos.'],
      ['Em quanto tempo vejo resultado?', 'Não há um prazo igual para todos. A evolução depende de cada organismo, da adesão ao plano e de outras condições de saúde. O acompanhamento serve justamente para medir o progresso e ajustar o caminho.'],
      ['Preciso fazer dieta restritiva?', 'O objetivo é um padrão alimentar possível de manter. Dietas muito restritivas costumam ser difíceis de sustentar e favorecem o reganho de peso.'],
      ['A teleconsulta funciona para emagrecimento?', 'Sim. A consulta online permite avaliação, pedido de exames, prescrição e acompanhamento. Quando a avaliação presencial for importante, isso é orientado.'],
    ]),
  },
  performance: {
    chamada: 'Composição corporal, energia e desempenho com base em evidências',
    introducao:
      'Performance não é só estética: é ter massa muscular, força e energia para treinar, trabalhar e viver bem. O acompanhamento médico avalia o que pode estar limitando seus resultados e orienta ajustes seguros.',
    paraQuem: [
      'Quem treina com regularidade e quer melhorar a composição corporal',
      'Quem sente que estagnou, mesmo com treino e alimentação organizados',
      'Quem quer cuidar da saúde enquanto busca desempenho, sem atalhos arriscados',
      'Quem tem dúvidas sobre suplementos e deseja orientação médica',
    ],
    sinais: [
      'Dificuldade para ganhar massa magra ou reduzir gordura',
      'Cansaço excessivo, recuperação lenta entre os treinos',
      'Queda de rendimento, de libido ou de disposição',
      'Sono de má qualidade e alterações de humor',
      'Uso de suplementos sem orientação ou com dúvidas sobre segurança',
    ],
    abordagem: [
      { titulo: 'Avaliação clínica', texto: 'Rotina de treinos, alimentação, sono, estresse, suplementos e histórico de saúde.' },
      { titulo: 'Composição corporal', texto: 'Bioimpedância na consulta presencial para acompanhar massa magra, gordura e hidratação ao longo do tempo.' },
      { titulo: 'Exames direcionados', texto: 'Investigação hormonal e metabólica quando indicada, para identificar fatores que interferem no desempenho.' },
      { titulo: 'Plano e ajustes', texto: 'Orientações integradas a treino e nutrição, com retornos para medir a evolução e corrigir a rota.' },
    ],
    observacao: `${AVISO} O uso de hormônios com finalidade estética ou de desempenho não é indicado e não faz parte do atendimento.`,
    faq: faq('performance', [
      ['Posso receber hormônios para ganhar massa muscular?', 'Não. Hormônios são prescritos apenas para tratar deficiências diagnosticadas, conforme as normas do Conselho Federal de Medicina. Usá-los para estética ou desempenho traz riscos importantes à saúde.'],
      ['A bioimpedância é obrigatória?', 'Ela é realizada na consulta presencial, quando indicada, porque ajuda a acompanhar a composição corporal. Na teleconsulta, outras formas de acompanhamento podem ser combinadas.'],
      ['Preciso parar meus suplementos antes da consulta?', 'Não pare nada por conta própria. Leve a lista do que você usa, com marcas e doses, para avaliarmos juntos.'],
      ['O atendimento substitui o nutricionista ou o educador físico?', 'Não. O trabalho é complementar, e o ideal é que os profissionais conversem entre si quando possível.'],
    ]),
  },
  longevidade: {
    chamada: 'Cuidar hoje do metabolismo para envelhecer com saúde e autonomia',
    introducao:
      'Longevidade com qualidade depende de prevenção. Identificar cedo fatores de risco cardiometabólicos e agir sobre eles com orientação médica ajuda a preservar energia, massa muscular, cognição e independência ao longo dos anos.',
    paraQuem: [
      'Adultos que querem fazer uma avaliação preventiva completa',
      'Quem tem histórico familiar de diabetes, infarto, AVC ou outras doenças metabólicas',
      'Quem percebe perda de massa muscular, força ou disposição com o passar dos anos',
      'Mulheres no climatério e na menopausa e homens a partir da meia-idade',
    ],
    sinais: [
      'Aumento da gordura abdominal e perda de massa muscular',
      'Pressão, glicose ou colesterol fora do ideal',
      'Cansaço, sono ruim e queda de disposição',
      'Sintomas do climatério, como ondas de calor e alterações do sono',
      'Exames preventivos atrasados ou sem acompanhamento',
    ],
    abordagem: [
      { titulo: 'Mapa de risco', texto: 'Histórico pessoal e familiar, hábitos e avaliação do risco cardiovascular e metabólico.' },
      { titulo: 'Exames com propósito', texto: 'Solicitação de exames com indicação clara, sem excessos, e interpretação cuidadosa dos resultados.' },
      { titulo: 'Prevenção ativa', texto: 'Plano para alimentação, atividade física, força muscular, sono e controle de fatores de risco.' },
      { titulo: 'Acompanhamento contínuo', texto: 'Revisões periódicas para manter as metas e antecipar ajustes ao longo da vida.' },
    ],
    observacao: AVISO,
    faq: faq('longevidade', [
      ['Existe um tratamento que retarda o envelhecimento?', 'Não existe fórmula mágica. O que a ciência mostra é que controlar fatores de risco, manter massa muscular, dormir bem e ter hábitos saudáveis faz diferença na saúde ao longo dos anos.'],
      ['Com que idade devo começar a cuidar da longevidade?', 'Quanto antes, melhor. A prevenção é útil em qualquer fase da vida adulta, e o plano é adaptado à sua idade e ao seu histórico.'],
      ['A reposição hormonal faz parte do cuidado?', 'A reposição hormonal pode ser indicada em situações específicas, como no climatério ou em deficiências diagnosticadas, sempre após avaliação individual de benefícios e riscos.'],
      ['Quais exames vou precisar fazer?', 'Depende do seu histórico e da avaliação clínica. Os exames são escolhidos para responder a perguntas concretas sobre a sua saúde.'],
    ]),
  },
  endocrinologia: {
    chamada: 'Tireoide, diabetes e hormônios com avaliação cuidadosa',
    introducao:
      'Os hormônios regulam metabolismo, energia, peso, humor e muitas outras funções. Alterações hormonais podem ser silenciosas no início, por isso a avaliação clínica atenta e os exames bem indicados são importantes para o diagnóstico e o acompanhamento.',
    paraQuem: [
      'Quem tem ou suspeita de alterações na tireoide, como hipotireoidismo, hipertireoidismo ou nódulos',
      'Pessoas com diabetes tipo 2, pré-diabetes ou resistência à insulina',
      'Quem tem exames hormonais alterados e precisa de orientação',
      'Mulheres com síndrome dos ovários policísticos ou irregularidade menstrual',
    ],
    sinais: [
      'Cansaço persistente, sonolência ou intolerância ao frio ou ao calor',
      'Alterações de peso sem causa aparente',
      'Sede excessiva, aumento da urina ou glicose alta nos exames',
      'Queda de cabelo, pele seca, palpitações ou alterações do humor',
      'Ciclos menstruais irregulares, acne ou aumento de pelos',
    ],
    abordagem: [
      { titulo: 'Escuta e exame clínico', texto: 'Sintomas, histórico pessoal e familiar, medicamentos em uso e exame físico direcionado.' },
      { titulo: 'Investigação', texto: 'Exames laboratoriais e de imagem quando indicados, com explicação clara de cada resultado.' },
      { titulo: 'Tratamento', texto: 'Conduta baseada nas diretrizes atuais, com metas definidas e orientação sobre o uso correto dos medicamentos.' },
      { titulo: 'Seguimento', texto: 'Retornos programados para monitorar a resposta, ajustar doses e prevenir complicações.' },
    ],
    observacao: AVISO,
    faq: faq('endocrinologia', [
      ['Hipotireoidismo engorda?', 'Pode contribuir para um pequeno ganho de peso, mas raramente explica sozinho um aumento importante. Por isso a avaliação considera outros fatores além da tireoide.'],
      ['Pré-diabetes tem volta?', 'Em muitos casos, mudanças de hábitos e acompanhamento adequado ajudam a normalizar a glicose e reduzir o risco de evolução para diabetes. A resposta varia de pessoa para pessoa.'],
      ['Preciso levar exames antigos?', 'Sim, se tiver. Exames anteriores ajudam a entender a evolução e podem evitar repetições desnecessárias.'],
      ['Diabetes pode ser acompanhado por teleconsulta?', 'Sim. Exames, glicemias registradas e a lista de medicamentos podem ser avaliados por vídeo, com prescrição digital válida em todo o Brasil.'],
    ]),
  },
}
