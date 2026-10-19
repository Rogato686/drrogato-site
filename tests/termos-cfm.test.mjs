import { test } from 'node:test'
import assert from 'node:assert/strict'
import { linhaProibida } from '../scripts/termos-cfm.mjs'

test('aceita a pós-graduação seguida de NÃO ESPECIALISTA', () => {
  assert.equal(linhaProibida('Médico pós-graduado em Endocrinologia pelo IPEMED, NÃO ESPECIALISTA'), false)
})

test('bloqueia Endocrinologia sem NÃO ESPECIALISTA na mesma linha', () => {
  assert.equal(linhaProibida('Pós-graduado em Endocrinologia'), true)
})

test('bloqueia especialista, especializado e especialidade', () => {
  for (const t of ['Endocrinologista em Teófilo Otoni', 'médico especialista', 'atendimento especializado', 'minha especialidade']) {
    assert.equal(linhaProibida(t), true, t)
  }
})

test('"não especialista" em minúsculas não vale como aviso', () => {
  assert.equal(linhaProibida('Endocrinologia, não especialista'), true)
})

test('texto comum passa', () => {
  assert.equal(linhaProibida('Emagrecimento, Performance e Longevidade'), false)
})
