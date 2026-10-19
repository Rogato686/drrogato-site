import { test } from 'node:test'
import assert from 'node:assert/strict'
import { limparTexto } from '../src/lib/textoSeguro.ts'

test('mantém links e textos normais', () => {
  for (const v of ['https://www.instagram.com/rogatoquadros', 'https://maps.app.goo.gl/x', 'Clínica Medcenter', '']) {
    assert.equal(limparTexto(v), v)
  }
})

test('descarta javascript:, data: e vbscript:, inclusive disfarçados', () => {
  for (const v of ['javascript:alert(1)', 'JaVaScRiPt:alert(1)', ' \tjavascript:alert(1)', 'java\nscript:alert(1)', 'data:text/html,<script>', 'vbscript:x']) {
    assert.equal(limparTexto(v), '', JSON.stringify(v))
  }
})
