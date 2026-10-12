// Ética médica (CFM 2.336/2023): o médico não tem RQE, então estes termos não podem aparecer no site.
import fs from 'node:fs'
import path from 'node:path'

const PROIBIDOS = /endocrinologista|especialista|especializad[oa]s?|especialidade/i
const raiz = path.resolve(import.meta.dirname, '..')
const pastas = ['src', 'public', 'index.html', 'supabase']
const erros = []

function varrer(p) {
  const st = fs.statSync(p)
  if (st.isDirectory()) return fs.readdirSync(p).forEach((f) => varrer(path.join(p, f)))
  if (!/\.(tsx?|jsx?|json|html|sql|md|txt|xml|webmanifest)$/.test(p)) return
  fs.readFileSync(p, 'utf8').split('\n').forEach((linha, i) => {
    if (PROIBIDOS.test(linha)) erros.push(`${path.relative(raiz, p)}:${i + 1}: ${linha.trim().slice(0, 120)}`)
  })
}
pastas.forEach((p) => fs.existsSync(path.join(raiz, p)) && varrer(path.join(raiz, p)))

if (erros.length) {
  console.error('Termos proibidos encontrados (use "médico pós-graduado em Endocrinologia pelo IPEMED"):\n' + erros.join('\n'))
  process.exit(1)
}
console.log('checar-termos: nenhum termo proibido encontrado')
