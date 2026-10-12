/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        marinho: { DEFAULT: '#142F5A', 50: '#EEF1F7', 100: '#DCE2EE', 200: '#B4C0D9', 300: '#7F93BA', 400: '#4A6596', 500: '#2A4677', 600: '#1C3B6E', 700: '#142F5A', 800: '#0F2446', 900: '#0A1931' },
        lilas: { DEFAULT: '#D0D2E3', 50: '#F6F6FA', 100: '#ECEDF4', 200: '#DFE0EC', 300: '#D0D2E3', 400: '#B3B6CF' },
        grafite: { DEFAULT: '#2B2B2D', foto: '#2C2726' },
      },
      fontFamily: {
        display: ['Jost', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { rotulo: '0.2em' },
      boxShadow: { suave: '0 10px 30px -12px rgba(20,47,90,0.18)', card: '0 2px 12px -4px rgba(20,47,90,0.12)' },
      maxWidth: { site: '1200px' },
    },
  },
  plugins: [],
}
