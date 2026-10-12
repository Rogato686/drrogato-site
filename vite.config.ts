import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// Tag do Google no <head> com Modo de Consentimento v2: tudo começa negado (sem cookies)
// e só é liberado quando a pessoa aceita no aviso de cookies (LGPD).
function tagGoogle(ga4: string): Plugin {
  return {
    name: 'tag-google',
    transformIndexHtml(html) {
      const id = /^G-[A-Z0-9]{4,}$/.test(ga4) ? ga4 : ''
      const tag = `<script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });
      try { var c = JSON.parse(localStorage.getItem('drr_cookies') || 'null'); if (c) gtag('consent', 'update', { analytics_storage: c.analise ? 'granted' : 'denied', ad_storage: c.marketing ? 'granted' : 'denied', ad_user_data: c.marketing ? 'granted' : 'denied', ad_personalization: c.marketing ? 'granted' : 'denied' }); } catch (e) {}
      ${id ? `window.__ga4 = '${id}'; gtag('js', new Date()); gtag('config', '${id}');` : ''}
    </script>${id ? `\n    <script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>` : ''}`
      return html.replace('<!--GTAG-->', tag)
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tagGoogle(loadEnv(mode, process.cwd(), 'VITE_').VITE_GA4_ID || '')],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  build: {
    rollupOptions: {
      output: {
        manualChunks: { supabase: ['@supabase/supabase-js'], react: ['react', 'react-dom', 'react-router-dom'] },
      },
    },
  },
}))
