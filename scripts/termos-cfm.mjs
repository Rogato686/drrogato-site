// Regra da checagem de termos (CFM 2.336/2023), separada para ser testada em tests/termos-cfm.test.mjs.
export const PROIBIDOS = /endocrinologista|especialista|especializad[oa]s?|especialidade/i
export const AVISO = 'NÃO ESPECIALISTA'

/** true quando a linha anuncia especialidade ou cita a Endocrinologia sem "NÃO ESPECIALISTA". */
export function linhaProibida(linha) {
  const semAviso = linha.split(AVISO).join('')
  const posSemAviso = /endocrinologia/i.test(linha) && !linha.includes(AVISO)
  return PROIBIDOS.test(semAviso) || posSemAviso
}
