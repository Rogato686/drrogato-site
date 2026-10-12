import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CabecalhoPagina } from '../components/Secoes'
import { useSite } from '../lib/SiteDataContext'
import { MEDICO } from '../lib/constantes'

type Tipo = 'privacidade' | 'termos' | 'cookies'

const ATUALIZACAO = '12 de outubro de 2026'
const EMAIL_PADRAO = 'rogatoquadros@live.com'

function Privacidade({ email }: { email: string }) {
  return (
    <>
      <p>
        Esta Política explica como o site <strong>drrogato.com.br</strong> trata dados pessoais, em conformidade com a Lei Geral de Proteção de
        Dados Pessoais (Lei nº 13.709/2018, LGPD). Ao usar o site, você declara ter lido e compreendido estas informações.
      </p>

      <h2>1. Quem é o controlador</h2>
      <p>
        O controlador dos dados é <strong>{MEDICO.nome}</strong>, médico, {MEDICO.crm}. Para qualquer assunto relacionado aos seus dados
        pessoais, o canal de atendimento ao titular é o e-mail <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <h2>2. Quais dados coletamos</h2>
      <p>O site coleta apenas os dados necessários para o contato e para o seu funcionamento:</p>
      <ul>
        <li>
          <strong>Formulário de contato:</strong> nome, telefone, e-mail (opcional), cidade (opcional), modalidade de interesse e a mensagem
          que você escrever, além do registro do seu consentimento e da data e hora do envio.
        </li>
        <li>
          <strong>Navegação:</strong> dados técnicos como endereço IP, tipo de navegador e dispositivo, páginas acessadas e origem da visita
          (por exemplo, parâmetros de campanha). Ferramentas de análise e de marketing só são ativadas com o seu consentimento, conforme a{' '}
          <Link to="/politica-de-cookies">Política de Cookies</Link>.
        </li>
        <li>
          <strong>Agendamento pelo WhatsApp:</strong> ao tocar em um botão de agendamento, você é levado ao WhatsApp, serviço de terceiros com
          política própria. A conversa acontece fora do site.
        </li>
      </ul>

      <h2>3. Não envie dados de saúde pelo site</h2>
      <p>
        O site não foi feito para receber informações sobre sintomas, exames, diagnósticos ou tratamentos. Esses dados são sensíveis e devem ser
        tratados somente na consulta, sob sigilo médico e registro em prontuário. Se você incluir informações desse tipo no formulário, elas
        serão descartadas.
      </p>

      <h2>4. Para que usamos os dados</h2>
      <ul>
        <li>Responder à sua mensagem e organizar o agendamento de consultas;</li>
        <li>Garantir a segurança do site e prevenir abusos e envios automatizados;</li>
        <li>Entender, de forma agregada, como o site é usado, para melhorá-lo (somente com consentimento);</li>
        <li>Medir o resultado de campanhas de divulgação (somente com consentimento).</li>
      </ul>

      <h2>5. Bases legais</h2>
      <ul>
        <li>
          <strong>Consentimento</strong> (art. 7º, I): envio do formulário de contato e uso de cookies de análise e de marketing;
        </li>
        <li>
          <strong>Procedimentos preliminares a pedido do titular</strong> (art. 7º, V): retorno do contato e agendamento;
        </li>
        <li>
          <strong>Legítimo interesse</strong> (art. 7º, IX): segurança e funcionamento essencial do site;
        </li>
        <li>
          <strong>Cumprimento de obrigação legal</strong> (art. 7º, II): quando a lei exigir a guarda de registros.
        </li>
      </ul>

      <h2>6. Com quem compartilhamos</h2>
      <p>Os dados não são vendidos. Eles podem ser tratados por operadores que prestam serviços essenciais ao site:</p>
      <ul>
        <li>
          <strong>Supabase:</strong> banco de dados onde ficam as mensagens enviadas pelo formulário;
        </li>
        <li>
          <strong>Vercel:</strong> hospedagem do site;
        </li>
        <li>
          <strong>Google</strong> (Google Analytics 4 e Google Tag Manager) e <strong>Meta</strong> (Meta Pixel): somente se você aceitar os
          cookies de análise ou de marketing.
        </li>
      </ul>
      <p>
        Alguns desses fornecedores podem armazenar dados fora do Brasil. Nesses casos, a transferência internacional segue as salvaguardas
        previstas na LGPD. Os dados também podem ser compartilhados com autoridades, quando houver obrigação legal ou ordem judicial.
      </p>

      <h2>7. Por quanto tempo guardamos</h2>
      <p>
        As mensagens do formulário são mantidas por até 12 meses após o último contato, ou até que você peça a exclusão, o que ocorrer primeiro.
        Dados de navegação seguem os prazos das ferramentas de análise, configurados para o mínimo necessário. Registros exigidos por lei são
        guardados pelo prazo legal.
      </p>

      <h2>8. Seus direitos</h2>
      <p>Como titular, você pode, a qualquer momento e gratuitamente:</p>
      <ul>
        <li>confirmar se tratamos seus dados e acessá-los;</li>
        <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
        <li>pedir anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desacordo com a LGPD;</li>
        <li>pedir a portabilidade dos dados;</li>
        <li>saber com quem seus dados foram compartilhados;</li>
        <li>revogar o consentimento e pedir a eliminação dos dados tratados com base nele;</li>
        <li>apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).</li>
      </ul>
      <p>
        Para exercer seus direitos, escreva para <a href={`mailto:${email}`}>{email}</a>. Responderemos em até 15 dias.
      </p>

      <h2>9. Segurança</h2>
      <p>
        Adotamos medidas técnicas e administrativas para proteger os dados, como conexão criptografada (HTTPS), controle de acesso restrito ao
        painel administrativo e regras de segurança no banco de dados. Nenhum sistema é totalmente imune a incidentes; se algum ocorrer e puder
        gerar risco relevante, você e a ANPD serão comunicados.
      </p>

      <h2>10. Alterações</h2>
      <p>Esta Política pode ser atualizada. A versão vigente estará sempre nesta página, com a data da última atualização.</p>
    </>
  )
}

function Termos({ email }: { email: string }) {
  return (
    <>
      <p>
        Estes Termos regulam o uso do site <strong>drrogato.com.br</strong>, mantido por {MEDICO.nome}, {MEDICO.crm}. Ao navegar pelo site, você
        concorda com as condições abaixo.
      </p>

      <h2>1. Caráter informativo</h2>
      <p>
        O conteúdo do site tem finalidade exclusivamente informativa e educativa, sobre a atuação do médico e os serviços oferecidos. Ele não
        constitui orientação médica individual e <strong>não substitui a consulta</strong>, presencial ou por telemedicina. Não interrompa nem
        altere tratamentos com base em informações do site.
      </p>
      <p>Em caso de urgência ou emergência, procure imediatamente o pronto-atendimento mais próximo ou ligue 192 (SAMU).</p>

      <h2>2. Agendamento</h2>
      <p>
        Os botões de agendamento abrem o WhatsApp ou uma agenda online externa. A consulta só é confirmada após o retorno da equipe. Valores,
        formas de pagamento e políticas de remarcação são informados diretamente no agendamento.
      </p>

      <h2>3. Telemedicina</h2>
      <p>
        As teleconsultas seguem a Lei nº 14.510/2022 e a Resolução CFM nº 2.314/2022, com os mesmos deveres éticos e de sigilo da consulta
        presencial. O médico pode indicar avaliação presencial sempre que julgar necessário. O paciente é responsável por garantir conexão,
        equipamento adequado e um ambiente reservado.
      </p>

      <h2>4. Uso adequado</h2>
      <p>Ao usar o site, você se compromete a não:</p>
      <ul>
        <li>enviar informações falsas ou de terceiros sem autorização;</li>
        <li>enviar dados de saúde pelo formulário de contato;</li>
        <li>tentar acessar áreas restritas, interferir no funcionamento do site ou enviar mensagens automatizadas.</li>
      </ul>

      <h2>5. Propriedade intelectual</h2>
      <p>
        Textos, fotografias, logomarca, elementos visuais e código do site pertencem a {MEDICO.nome} ou são usados com autorização, e são
        protegidos pela legislação de direitos autorais e de marcas. É proibido copiar, reproduzir ou usar esse conteúdo para fins comerciais
        sem autorização prévia e por escrito. O compartilhamento de links para as páginas é livre.
      </p>

      <h2>6. Links externos</h2>
      <p>
        O site contém links para serviços de terceiros, como WhatsApp, Instagram, Google Maps, Waze e sites oficiais. Esses serviços têm termos
        e políticas próprios, pelos quais não nos responsabilizamos.
      </p>

      <h2>7. Disponibilidade</h2>
      <p>
        Buscamos manter o site disponível e com informações atualizadas, mas podem ocorrer interrupções ou mudanças de horários. Em caso de
        dúvida, confirme pelo WhatsApp.
      </p>

      <h2>8. Privacidade</h2>
      <p>
        O tratamento de dados pessoais está descrito na <Link to="/politica-de-privacidade">Política de Privacidade</Link> e na{' '}
        <Link to="/politica-de-cookies">Política de Cookies</Link>.
      </p>

      <h2>9. Legislação e contato</h2>
      <p>
        Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da comarca de Teófilo Otoni/MG, ressalvado o direito do consumidor
        de recorrer ao foro do seu domicílio. Dúvidas: <a href={`mailto:${email}`}>{email}</a>.
      </p>
    </>
  )
}

function Cookies() {
  return (
    <>
      <p>
        Cookies são pequenos arquivos guardados no seu navegador para que um site funcione e para lembrar suas preferências. Tecnologias
        semelhantes, como o armazenamento local do navegador, também são usadas. Esta Política explica quais usamos e como você pode
        controlá-las.
      </p>

      <h2>1. Essenciais</h2>
      <p>
        Necessários para o funcionamento e a segurança do site. Por exemplo: guardar a sua escolha sobre cookies, registrar a origem da visita
        para incluir na mensagem de agendamento e manter a sessão do painel administrativo. Não podem ser desativados, pois sem eles o site não
        funciona corretamente.
      </p>

      <h2>2. Análise</h2>
      <p>
        Usados pelo <strong>Google Analytics 4</strong> e pelo <strong>Google Tag Manager</strong> para entender, de forma agregada, quantas
        pessoas visitam o site, quais páginas são mais acessadas e de onde vêm as visitas. Só são ativados se você aceitar os cookies de
        análise.
      </p>

      <h2>3. Marketing</h2>
      <p>
        Usados pelo <strong>Meta Pixel</strong> (Facebook e Instagram) e por ferramentas de conversão do Google para medir o resultado de
        campanhas e exibir anúncios mais relevantes. Só são ativados se você aceitar os cookies de marketing.
      </p>

      <h2>4. Como mudar suas preferências</h2>
      <p>
        Na primeira visita, um aviso permite aceitar, recusar ou escolher quais categorias ativar. Você pode mudar sua escolha a qualquer
        momento:
      </p>
      <p>
        <button type="button" className="btn-primario" onClick={() => window.dispatchEvent(new Event('drr:abrir-cookies'))}>
          Alterar preferências de cookies
        </button>
      </p>
      <p>
        Também é possível apagar ou bloquear cookies nas configurações do seu navegador. Bloquear os essenciais pode prejudicar o funcionamento
        do site.
      </p>

      <h2>5. Mais informações</h2>
      <p>
        Para saber como tratamos seus dados pessoais, consulte a <Link to="/politica-de-privacidade">Política de Privacidade</Link>.
      </p>
    </>
  )
}

const PAGINAS: Record<Tipo, { titulo: string; rotulo: string; Conteudo: (p: { email: string }) => ReactNode }> = {
  privacidade: { titulo: 'Política de Privacidade', rotulo: 'LGPD', Conteudo: Privacidade },
  termos: { titulo: 'Termos de Uso', rotulo: 'Informações legais', Conteudo: Termos },
  cookies: { titulo: 'Política de Cookies', rotulo: 'LGPD', Conteudo: Cookies },
}

export default function Legal({ tipo }: { tipo: Tipo }) {
  const { redes } = useSite()
  const email = redes.email || EMAIL_PADRAO
  const { titulo, rotulo, Conteudo } = PAGINAS[tipo]
  return (
    <>
      <CabecalhoPagina rotulo={rotulo} titulo={titulo} texto={`Última atualização: ${ATUALIZACAO}.`} />
      <section className="secao">
        <article className="container-site">
          <div className="prosa mx-auto max-w-3xl text-grafite/90">
            <Conteudo email={email} />
          </div>
        </article>
      </section>
    </>
  )
}
