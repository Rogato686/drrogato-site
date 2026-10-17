import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { RedesSociais } from './RedesSociais'
import { useSite } from '../lib/SiteDataContext'
import { AREAS, CLINICA, MEDICO } from '../lib/constantes'
import { MENU } from './Header'
import { horariosPorDia } from '../lib/formatar'
import { linkWhatsApp, mensagemAgendamento } from '../lib/whatsapp'
import { rastrearWhatsApp } from '../lib/analytics'

export function Footer() {
  const { locais, redes, telemedicina } = useSite()
  const ano = new Date().getFullYear()
  const tel = redes.whatsapp.replace(/^55(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  return (
    <footer className="relative overflow-hidden bg-marinho text-lilas-200">
      <img src="/logo/simbolo-branco.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -right-24 -top-10 w-[420px] opacity-[0.04]" />
      <div className="container-site relative py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1fr_1.2fr_1.2fr_1.2fr]">
          <div className="md:col-span-2 lg:col-span-4 lg:flex lg:items-end lg:justify-between lg:gap-10 lg:border-b lg:border-white/10 lg:pb-10">
            <div>
              <Logo versao="horizontal-sem-tagline" cor="branco" className="h-auto w-[300px] max-w-full" alt="Dr. Rogato" />
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-lilas-200">
                Cuidado médico completo para o seu metabolismo, com ciência, escuta e um plano feito para a sua vida.
              </p>
            </div>
            <RedesSociais className="mt-4 -ml-3 lg:ml-0" itemClass="text-white hover:bg-white/10" />
          </div>
          <div>
            <h2 className="rotulo !text-lilas">Navegação</h2>
            <ul className="mt-3 text-sm">
              {MENU.map((m) => (
                <li key={m.to}><Link className="inline-flex min-h-[40px] items-center hover:text-white" to={m.to}>{m.rotulo}</Link></li>
              ))}
              <li><Link className="inline-flex min-h-[40px] items-center hover:text-white" to="/links">Links</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="rotulo !text-lilas">Tratamentos</h2>
            <ul className="mt-3 text-sm">
              {AREAS.map((a) => (
                <li key={a.slug}><Link className="inline-flex min-h-[40px] items-center hover:text-white" to={`/tratamentos/${a.slug}`}>{a.titulo}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="rotulo !text-lilas">Atendimento</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {locais.map((l) => (
                <li key={l.id}>
                  <Link to="/consultorio" className="inline-flex min-h-[40px] items-center font-medium text-white hover:underline">{l.cidade}/{l.uf}</Link>
                  <span className="block">{l.nome}</span>
                  {horariosPorDia(l.horarios).map((h) => (
                    <span key={h.dia} className="block text-lilas-300">{h.dia}, {h.faixas}</span>
                  ))}
                </li>
              ))}
              {telemedicina.ativo && (
                <li><Link to="/telemedicina" className="inline-flex min-h-[40px] items-center font-medium text-white hover:underline">Online para todo o Brasil</Link></li>
              )}
            </ul>
          </div>
          <div>
            <h2 className="rotulo !text-lilas">Contato</h2>
            <ul className="mt-3 text-sm">
              <li>
                <a
                  href={linkWhatsApp(mensagemAgendamento('geral'))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[40px] items-center hover:text-white"
                  onClick={() => rastrearWhatsApp('rodape')}
                >
                  WhatsApp {tel}
                </a>
              </li>
              {redes.email && <li><a className="inline-flex min-h-[40px] items-center break-all hover:text-white" href={`mailto:${redes.email}`}>{redes.email}</a></li>}
              {redes.instagram && <li><a className="inline-flex min-h-[40px] items-center hover:text-white" href={redes.instagram} target="_blank" rel="noopener noreferrer">Instagram @{redes.instagram.replace(/\/$/, '').split('/').pop()}</a></li>}
              <li><Link className="inline-flex min-h-[40px] items-center hover:text-white" to="/contato">Formulário de contato</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-[13px] leading-relaxed text-lilas-300">
          <p>
            <strong className="font-medium text-lilas-100">Responsável técnico:</strong> {MEDICO.nome} · {MEDICO.crm} · {MEDICO.titulo}.
          </p>
          <p className="mt-2">
            {CLINICA.nome} · Registro no {CLINICA.registroCrm} · Diretor técnico: {CLINICA.diretorTecnico}.
          </p>
          <p className="mt-2">As informações deste site têm caráter educativo e não substituem a consulta médica.</p>
          <ul className="mt-3 flex flex-wrap gap-x-5">
            <li><Link className="inline-flex min-h-[40px] items-center hover:text-white" to="/politica-de-privacidade">Política de Privacidade</Link></li>
            <li><Link className="inline-flex min-h-[40px] items-center hover:text-white" to="/termos-de-uso">Termos de Uso</Link></li>
            <li><Link className="inline-flex min-h-[40px] items-center hover:text-white" to="/politica-de-cookies">Política de Cookies</Link></li>
            <li>
              <button type="button" className="inline-flex min-h-[40px] items-center hover:text-white" onClick={() => window.dispatchEvent(new Event('drr:abrir-cookies'))}>
                Preferências de cookies
              </button>
            </li>
          </ul>
          <p className="mt-4">
            © {ano} {MEDICO.nome} · Médico · {MEDICO.crm} · {MEDICO.tituloCurto}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
