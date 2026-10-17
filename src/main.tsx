import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { SiteDataProvider } from './lib/SiteDataContext'
import { capturarOrigem } from './lib/whatsapp'
// Fontes servidas pelo próprio site (sem depender do Google Fonts nem bloquear o carregamento)
import '@fontsource/jost/latin-300.css'
import '@fontsource/jost/latin-400.css'
import '@fontsource/jost/latin-500.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import './index.css'

capturarOrigem()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SiteDataProvider>
        <App />
      </SiteDataProvider>
    </BrowserRouter>
  </StrictMode>,
)
