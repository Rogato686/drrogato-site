# Site do Dr. Rogato

## Problema e objetivo
Apresentar o Dr. Rogato Abrantes de Quadros Filho (médico, CRM-MG 83269) e levar o paciente a agendar uma consulta pelo WhatsApp, presencial ou por telemedicina. Tudo dentro das regras de publicidade médica do CFM e da LGPD.

## Público e papéis
- Visitante: paciente ou interessado, quase sempre no celular.
- Administrador: o próprio médico (e quem ele autorizar em `admins_autorizados`). Edita conteúdo, horários, locais e lê as mensagens em `/admin`.

## Fluxos publicados
- Páginas públicas: início, sobre, tratamentos (emagrecimento, performance, longevidade), consultório, telemedicina, contato, links (bio do Instagram) e páginas legais.
- Agendamento: botões abrem o WhatsApp (33) 99873-5429 com uma mensagem pronta.
- Formulário de contato: grava em `mensagens_contato` e avisa por e-mail, via Resend, se a chave estiver configurada.
- Painel `/admin`: login com e-mail e senha (Supabase Auth); conteúdo, FAQ, avisos, locais e horários, telemedicina, redes e rastreamento, mensagens.

## Locais
- Clínica Medcenter (CRM-MG 33563), Av. Dr. Júlio Rodrigues 650, 4º andar, Teófilo Otoni/MG. Quinta, 08:30 às 13h.
- Clínica IMO, Malacacheta/MG. Segunda e sexta, 08 às 14h.
- Telemedicina para todo o Brasil.

## Fora do escopo
Agendamento online próprio, pagamentos, prontuário, área do paciente e blog.

## Requisitos e restrições
- **CFM 2.336/2023:**
  - Pós-graduação divulgada só como "Médico pós-graduado em Endocrinologia pelo IPEMED, NÃO ESPECIALISTA".
  - Sem "especialista" e sem tratamento de órgãos ou doenças.
  - Sem promessa de resultado, antes e depois, depoimentos ou preços.
  - Clínica com registro e diretor técnico no rodapé.
- **Resolução CFM 2.333/2023:** hormônios só para deficiência diagnosticada.
- **Resolução CFM 2.314/2022:** a telemedicina informa a receita digital e o encaminhamento ao presencial.
- **LGPD:** cookies de análise e marketing só com aceite; consentimento no formulário; políticas publicadas.
- **Segurança:** RLS em todas as tabelas, privilégios mínimos, CSP e HSTS. Relatório em `/mnt/project-files/site/auditoria-seguranca.md`, fora do repositório.

## Suposições e decisões pendentes
- O diretor técnico da Medcenter foi assumido como o próprio Dr. Rogato (falta confirmar).
- A logo oficial ainda tem a tagline "ENDOCRINOLOGIA". O site usa a versão sem tagline.

## Critérios de aceite
- `npm run check` passa, e a checagem de termos CFM não encontra nada.
- O site publicado abre em `www.drrogato.com.br` (a raiz redireciona com 308) sem erros de CSP.
- Visitante anônimo não lê mensagens nem dados de admin (teste de RLS no `docs/quality.md`).

## Manutenção
Qualquer texto novo segue as restrições acima. Mudança de escopo ou de regra é registrada aqui.
