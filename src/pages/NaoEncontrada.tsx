import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { Hexagono } from '../components/Hexagono'
import { BotaoAgendar } from '../components/BotaoAgendar'
import { IconeSeta } from '../components/Icones'

export default function NaoEncontrada() {
  return (
    <section className="relative overflow-hidden bg-lilas-100 pb-24 pt-36 md:pb-32 md:pt-44">
      <Seo titulo="Página não encontrada | Dr. Rogato" noindex />
      <img src="/logo/simbolo-azul.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -right-20 top-10 w-80 opacity-[0.05] md:w-[440px]" />
      <div className="container-site relative text-center">
        <Hexagono tamanho={96} variante="marinho" className="mx-auto">
          <span className="font-display text-2xl font-light">404</span>
        </Hexagono>
        <h1 className="mt-8 font-display text-4xl font-light text-marinho md:text-5xl">Esta página não foi encontrada</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-grafite/80">
          O endereço pode ter mudado ou ter sido digitado de outro jeito. Que tal recomeçar pelo início ou agendar sua consulta?
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn-primario">
            Voltar ao início <IconeSeta tamanho={16} />
          </Link>
          <BotaoAgendar modalidade="geral" className="btn-contorno" rotulo="Página 404" />
        </div>
        <p className="mt-8 text-sm text-grafite/70">
          Ou veja{' '}
          <Link to="/tratamentos" className="link">
            os tratamentos
          </Link>
          ,{' '}
          <Link to="/consultorio" className="link">
            os consultórios
          </Link>{' '}
          e{' '}
          <Link to="/telemedicina" className="link">
            a teleconsulta
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
