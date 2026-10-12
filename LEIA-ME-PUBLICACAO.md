# Como colocar o site no ar (drrogato.com.br)

O código está pronto. Faltam só as contas, que precisam ser criadas por você. Siga na ordem; cada etapa leva poucos minutos.

## 1. Supabase (banco de dados e login do painel)

Já feito: o projeto `drrogato-site` (São Paulo) foi criado na sua conta Supabase, com tabelas, regras de segurança,
os 2 consultórios reais, contatos, perguntas frequentes e a função de e-mail `notificar-contato`.
Endereço e chave pública já estão em `.env.production` (a chave anon é pública por natureza; quem protege os dados são as regras RLS).

Falta você (3 minutos), em https://supabase.com/dashboard/project/qksctznipxugqixcogvy :
1. **Authentication → Users → Add user → Create new user**: e-mail `rogatoquadros@live.com`, uma senha forte, marque **Auto Confirm User**.
   Pronto: esse e-mail vira administrador automaticamente (não precisa rodar SQL).
   - Para a secretária: rode no SQL Editor `insert into public.admins_autorizados (email, nome) values ('email-dela', 'Nome');` e depois crie o usuário dela.
2. **Authentication → URL Configuration**:
   - Site URL: `https://drrogato.com.br`
   - Redirect URLs: `https://drrogato.com.br/admin/nova-senha` (usado na recuperação de senha)

### E-mail de aviso quando alguém preencher o formulário (opcional)
1. Crie uma conta gratuita em https://resend.com e gere uma **API Key**.
2. No Supabase: **Edge Functions → Secrets**, adicione `RESEND_API_KEY` com essa chave (e, se quiser, `NOTIFICAR_PARA` com outro e-mail).
   - Opcionais: `NOTIFICAR_DE` (ex.: `Site Dr. Rogato <contato@drrogato.com.br>`, exige domínio verificado no Resend) e `ORIGENS_PERMITIDAS`.
   Por segurança, a função só envia e-mail de mensagens que acabaram de ser gravadas no banco (evita spam).
   Sem isso o formulário continua funcionando: as mensagens ficam salvas no painel, em **Mensagens**.

## 2. Vercel (hospedagem, HTTPS automático)

1. O código já está em https://github.com/Rogato686/drrogato-site.
2. Crie uma conta em https://vercel.com com o seu GitHub e clique em **Add New → Project → Import** nesse repositório.
   - Framework: **Vite** (detectado sozinho). Build: `npm run build`. Output: `dist`.
3. Não precisa cadastrar variáveis: o endereço e a chave pública do Supabase já estão no arquivo `.env.production`.
4. Clique em **Deploy**. Em 1 a 2 minutos o site abre num endereço `.vercel.app` para você conferir.

## 3. Domínio no Registro.br

1. Na Vercel: **Project → Settings → Domains**, adicione `drrogato.com.br` e depois `www.drrogato.com.br`.
   Escolha redirecionar o `www` para `drrogato.com.br` (o `vercel.json` também já faz isso).
2. No Registro.br: **Painel → Domínios → drrogato.com.br → DNS → Editar zona** (se pedir, ative "Usar DNS do Registro.br") e crie:
   | Tipo | Nome | Valor |
   |---|---|---|
   | A | (vazio) | `76.76.21.21` |
   | CNAME | `www` | `cname.vercel-dns.com` |
   Se a Vercel mostrar valores diferentes na tela de Domains, **use os da Vercel**.
3. Salve e aguarde a propagação (minutos a algumas horas). A Vercel emite o HTTPS sozinha.

## 4. Depois de publicado

- Entre em `https://drrogato.com.br/admin` com o e-mail e a senha do passo 1.3 e confira consultórios, horários e redes.
- **Google Search Console**: adicione `drrogato.com.br` (verificação por registro TXT no mesmo editor de zona) e envie `https://drrogato.com.br/sitemap.xml`.
- **Perfil da Empresa no Google** de cada consultório: coloque o link `https://drrogato.com.br/consultorio`.
- **Bio do Instagram**: `drrogato.com.br/links`.
- **Google Analytics 4 / Tag Manager / Meta Pixel**: crie as contas e cole os IDs no painel em **Conteúdo → Rastreamento**. Eles só carregam para quem aceitar os cookies.
- **Instagram na home**: no painel, em **Conteúdo → Instagram**, cole os links das publicações que quer destacar. Sem links, a home mostra um cartão "Seguir no Instagram".
- **Links de mapa**: no painel, em cada consultório, cole o link do Google Maps do endereço (botão Compartilhar no Maps) para o mapa ficar exato.

## Desenvolvimento local (opcional)

```
npm install
cp .env.example .env.local   # preencha com os dados do Supabase
npm run dev
```
`npm run build` confere automaticamente se algum texto usa termos proibidos pelo CFM para quem não tem RQE.
