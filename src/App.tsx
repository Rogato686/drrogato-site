import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'

const Sobre = lazy(() => import('./pages/Sobre'))
const Tratamentos = lazy(() => import('./pages/Tratamentos'))
const TratamentoArea = lazy(() => import('./pages/TratamentoArea'))
const Consultorio = lazy(() => import('./pages/Consultorio'))
const Telemedicina = lazy(() => import('./pages/Telemedicina'))
const Contato = lazy(() => import('./pages/Contato'))
const Links = lazy(() => import('./pages/Links'))
const Legal = lazy(() => import('./pages/Legal'))
const NaoEncontrada = lazy(() => import('./pages/NaoEncontrada'))
const Admin = lazy(() => import('./admin/AdminApp'))

const Carregando = () => <div className="min-h-[60vh]" aria-busy="true" />

export function App() {
  return (
    <Suspense fallback={<Carregando />}>
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/links" element={<Links />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/tratamentos" element={<Tratamentos />} />
          <Route path="/tratamentos/:area" element={<TratamentoArea />} />
          <Route path="/consultorio" element={<Consultorio />} />
          <Route path="/telemedicina" element={<Telemedicina />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/politica-de-privacidade" element={<Legal tipo="privacidade" />} />
          <Route path="/termos-de-uso" element={<Legal tipo="termos" />} />
          <Route path="/politica-de-cookies" element={<Legal tipo="cookies" />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
