-- Dados reais iniciais (mesmos de src/lib/seed.ts).

with imo as (
  insert into public.locais (nome, endereco, numero, complemento, bairro, cidade, uf, cep, ordem)
  values ('Clínica IMO', 'Praça Fortunato Mendes', '48', 'Sala 1', 'Centro', 'Malacacheta', 'MG', '39690-000', 2)
  returning id
)
insert into public.horarios_local (local_id, dia_semana, inicio, fim)
select id, d, '08:00', '14:00' from imo, unnest(array[1, 5]) as d;

with to_ as (
  insert into public.locais (nome, endereco, numero, complemento, bairro, cidade, uf, cep, ordem)
  values ('Clínica Dr. Rogato Quadros', 'Av. Dr. Júlio Rodrigues', '650', '4º andar', '', 'Teófilo Otoni', 'MG', '39803-145', 1)
  returning id
)
insert into public.horarios_local (local_id, dia_semana, inicio, fim)
select id, 4, '08:30', '13:00' from to_;

insert into public.config_telemedicina (id, ativo) values (1, true);

insert into public.redes_sociais (id, whatsapp, email, instagram)
values (1, '5533998735429', 'rogatoquadros@live.com', 'https://instagram.com/rogatoquadros');

insert into public.conteudo_site (id, hero_titulo, hero_subtitulo) values (1,
  'Seu metabolismo, sua energia e sua longevidade merecem um cuidado completo',
  'Sou o Dr. Rogato, médico pós-graduado em Endocrinologia pelo IPEMED. Cuido de emagrecimento, performance, longevidade e saúde hormonal com avaliação detalhada e um plano feito para a sua rotina.');

insert into public.faq (pagina, ordem, pergunta, resposta) values
  ('home', 1, 'O atendimento é particular ou por convênio?', 'As informações sobre valores, convênios e reembolso são passadas pelo WhatsApp no momento do agendamento. Se o seu plano oferece reembolso, você recebe os documentos necessários para solicitá-lo.'),
  ('home', 2, 'Como faço para agendar?', 'Pelo WhatsApp (33) 99873-5429. Basta tocar em qualquer botão "Agendar" do site e a mensagem já vai pronta, indicando se você prefere a consulta presencial ou a teleconsulta.'),
  ('home', 3, 'Como funciona o retorno?', 'O retorno faz parte do acompanhamento: nele revisamos os exames solicitados, avaliamos sua evolução e ajustamos o plano. O prazo e as condições são informados no agendamento.'),
  ('home', 4, 'A receita da teleconsulta é válida?', 'Sim. Receitas, pedidos de exame e atestados são emitidos com assinatura eletrônica qualificada e têm validade em todo o Brasil, conforme a Lei 14.510/2022 e a Resolução CFM 2.314/2022.'),
  ('home', 5, 'O que devo levar na primeira consulta?', 'Documento com foto, exames dos últimos 12 meses, a lista dos medicamentos e suplementos que você usa (com as doses) e, se tiver, relatórios de outros médicos.'),
  ('home', 6, 'Preciso estar em jejum para a consulta?', 'Não. O jejum só é necessário para alguns exames de sangue, e as orientações vêm junto com o pedido.'),
  ('home', 7, 'Atende pacientes de outras cidades?', 'Sim. Além dos consultórios em Teófilo Otoni e Malacacheta, a teleconsulta atende pacientes de todo o Brasil.'),
  ('home', 8, 'A consulta presencial inclui bioimpedância?', 'A avaliação de composição corporal por bioimpedância faz parte da consulta presencial, quando indicada, para acompanhar massa magra, gordura e hidratação ao longo do tratamento.'),
  ('telemedicina', 1, 'Qual plataforma é usada na videochamada?', 'Uma plataforma segura de videochamada. O link chega pelo WhatsApp ou e-mail antes do horário marcado e funciona no celular ou no computador, sem instalar nada na maioria dos casos.'),
  ('telemedicina', 2, 'Como envio meus exames?', 'Você pode enviar os exames em PDF ou foto pelo WhatsApp antes da consulta, ou mostrá-los durante a chamada.'),
  ('telemedicina', 3, 'A receita digital vale em qualquer farmácia?', 'Sim. A receita com assinatura eletrônica qualificada é aceita em farmácias de todo o país. Alguns medicamentos controlados têm regras específicas, que são explicadas durante a consulta.'),
  ('telemedicina', 4, 'E se a conexão cair durante a consulta?', 'A chamada é retomada pelo mesmo link. Se não for possível, entramos em contato pelo WhatsApp para continuar ou remarcar.'),
  ('telemedicina', 5, 'Preciso fazer bioimpedância?', 'Na teleconsulta, a composição corporal pode ser acompanhada com exames feitos perto de você. Quando a avaliação presencial for importante, isso é orientado na consulta.'),
  ('telemedicina', 6, 'Meus dados ficam protegidos?', 'Sim. A teleconsulta segue as mesmas regras de sigilo médico da consulta presencial e a LGPD, e as informações ficam registradas em prontuário eletrônico.');
