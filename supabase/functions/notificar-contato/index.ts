// Edge Function (Deno): envia por e-mail, via Resend, o aviso de nova mensagem do formulário de contato.
//
// Secrets (Supabase → Edge Functions → Secrets):
//   RESEND_API_KEY   chave da API do Resend (sem ela, a função responde {enviado:false} e nada é enviado)
//   NOTIFICAR_PARA   destinatário (padrão: rogatoquadros@live.com)
//   NOTIFICAR_DE     remetente (padrão: "Site Dr. Rogato <onboarding@resend.dev>"; troque por um domínio verificado no Resend)
//   ORIGENS_PERMITIDAS  opcional, lista separada por vírgula (padrão: https://drrogato.com.br,https://www.drrogato.com.br)
//
// Publicação: supabase functions deploy notificar-contato (com verificação de JWT; o site envia a chave anon)
// Chamada pelo site: supabase.functions.invoke('notificar-contato', { body: { nome, telefone, email, cidade, modalidade, mensagem } })
//
// Proteção contra abuso: quando SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão disponíveis (padrão nas Edge Functions),
// só envia e-mail se existir em mensagens_contato uma mensagem com o mesmo telefone gravada nos últimos 10 minutos.

const ORIGENS = (Deno.env.get('ORIGENS_PERMITIDAS') || 'https://drrogato.com.br,https://www.drrogato.com.br')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

function cors(origem: string | null): Record<string, string> {
  const local = origem && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origem)
  const permitida = origem && (ORIGENS.includes(origem) || local) ? origem : ORIGENS[0]
  return {
    'Access-Control-Allow-Origin': permitida,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

const LIMITES = { nome: 120, telefone: 30, email: 160, cidade: 120, modalidade: 20, mensagem: 2000 } as const
type Campos = Record<keyof typeof LIMITES, string>

const MODALIDADES: Record<string, string> = { presencial: 'Consulta presencial', online: 'Teleconsulta', duvida: 'Dúvida' }

function escapar(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

function limpar(v: unknown, max: number) {
  // remove caracteres de controle (exceto quebra de linha) e corta no limite
  return String(v ?? '')
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, max)
}

async function mensagemExiste(telefone: string): Promise<boolean> {
  const url = Deno.env.get('SUPABASE_URL')
  const chave = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !chave) return true // sem credenciais, não verifica
  const desde = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  const q = `${url}/rest/v1/mensagens_contato?select=id&telefone=eq.${encodeURIComponent(telefone)}&created_at=gte.${encodeURIComponent(desde)}&limit=1`
  try {
    const r = await fetch(q, { headers: { apikey: chave, Authorization: `Bearer ${chave}` } })
    if (!r.ok) return true // em caso de falha na verificação, não bloqueia o aviso
    const linhas = await r.json()
    return Array.isArray(linhas) && linhas.length > 0
  } catch {
    return true
  }
}

Deno.serve(async (req) => {
  const h = { ...cors(req.headers.get('Origin')), 'Content-Type': 'application/json; charset=utf-8' }
  const responder = (status: number, corpo: unknown) => new Response(JSON.stringify(corpo), { status, headers: h })

  if (req.method === 'OPTIONS') return new Response('ok', { headers: h })
  if (req.method !== 'POST') return responder(405, { erro: 'Método não permitido' })

  const bruto = await req.text()
  if (bruto.length > 10_000) return responder(413, { erro: 'Conteúdo muito grande' })
  let corpo: Record<string, unknown>
  try {
    corpo = JSON.parse(bruto)
    if (!corpo || typeof corpo !== 'object') throw new Error()
  } catch {
    return responder(400, { erro: 'JSON inválido' })
  }

  const c = Object.fromEntries(Object.entries(LIMITES).map(([k, max]) => [k, limpar(corpo[k], max)])) as Campos
  if (c.nome.length < 2 || c.telefone.replace(/\D/g, '').length < 8) return responder(400, { erro: 'Nome e telefone são obrigatórios' })
  const emailValido = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(c.email)

  const chave = Deno.env.get('RESEND_API_KEY')
  if (!chave) return responder(200, { enviado: false, motivo: 'RESEND_API_KEY não configurada' })

  if (!(await mensagemExiste(c.telefone))) return responder(200, { enviado: false, motivo: 'mensagem não encontrada' })

  const para = Deno.env.get('NOTIFICAR_PARA') || 'rogatoquadros@live.com'
  const de = Deno.env.get('NOTIFICAR_DE') || 'Site Dr. Rogato <onboarding@resend.dev>'
  const modalidade = MODALIDADES[c.modalidade] || 'Não informada'
  const zap = c.telefone.replace(/\D/g, '')
  const zapIntl = zap.length === 10 || zap.length === 11 ? `55${zap}` : zap

  const linha = (rotulo: string, valor: string) =>
    valor
      ? `<tr><td style="padding:6px 12px 6px 0;color:#4A6596;font-size:13px;vertical-align:top;white-space:nowrap">${rotulo}</td><td style="padding:6px 0;color:#2B2B2D;font-size:15px">${valor}</td></tr>`
      : ''

  const html = `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#F6F6FA;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:24px">
  <div style="background:#142F5A;color:#fff;border-radius:16px 16px 0 0;padding:20px 24px;font-size:18px">Nova mensagem pelo site</div>
  <div style="background:#fff;border-radius:0 0 16px 16px;padding:20px 24px">
    <table role="presentation" style="border-collapse:collapse;width:100%">
      ${linha('Nome', escapar(c.nome))}
      ${linha('Telefone', `<a href="https://wa.me/${escapar(zapIntl)}" style="color:#142F5A">${escapar(c.telefone)}</a>`)}
      ${linha('E-mail', c.email ? (emailValido ? `<a href="mailto:${escapar(c.email)}" style="color:#142F5A">${escapar(c.email)}</a>` : escapar(c.email)) : '')}
      ${linha('Cidade', escapar(c.cidade))}
      ${linha('Interesse', escapar(modalidade))}
    </table>
    ${c.mensagem ? `<div style="margin-top:16px;padding:14px 16px;background:#ECEDF4;border-radius:12px;color:#2B2B2D;font-size:15px;line-height:1.5;white-space:pre-line">${escapar(c.mensagem)}</div>` : ''}
    <p style="margin-top:20px;color:#7F93BA;font-size:12px">Todas as mensagens ficam no painel: drrogato.com.br/admin/mensagens</p>
  </div>
</div></body></html>`

  const texto = [
    'Nova mensagem pelo site',
    '',
    `Nome: ${c.nome}`,
    `Telefone: ${c.telefone}`,
    c.email && `E-mail: ${c.email}`,
    c.cidade && `Cidade: ${c.cidade}`,
    `Interesse: ${modalidade}`,
    c.mensagem && `\nMensagem:\n${c.mensagem}`,
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: de,
        to: para.split(',').map((s) => s.trim()).filter(Boolean),
        subject: `Nova mensagem do site: ${c.nome.replace(/[\r\n]+/g, ' ')}`,
        html,
        text: texto,
        ...(emailValido ? { reply_to: c.email } : {}),
      }),
    })
    if (!r.ok) {
      console.error('Resend falhou', r.status, await r.text())
      return responder(502, { enviado: false, erro: 'Falha ao enviar o e-mail' })
    }
    return responder(200, { enviado: true })
  } catch (e) {
    console.error('Erro ao chamar o Resend', e)
    return responder(502, { enviado: false, erro: 'Falha ao enviar o e-mail' })
  }
})
