// Links perigosos (javascript:, data:, vbscript:) viram texto vazio antes de chegar a qualquer href/src.
const PERIGOSO = /^(javascript|data|vbscript):/i

export function limparTexto(v: string): string {
  // eslint-disable-next-line no-control-regex -- o navegador ignora esses caracteres no início de URLs
  return PERIGOSO.test(v.replace(/[\u0000-\u0020]/g, '')) ? '' : v
}
