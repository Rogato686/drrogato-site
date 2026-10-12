# Como colocar o site no ar (drrogato.com.br)

O código está pronto. Faltam só as contas, que precisam ser criadas por você. Siga na ordem; cada etapa leva poucos minutos.

## 1. Supabase (banco de dados e login do painel)

1. Crie uma conta gratuita em https://supabase.com e clique em **New project**.
   - Nome: `drrogato-site` · Região: **South America (São Paulo)** · anote a senha do banco.
2. No projeto, abra **SQL Editor → New query**, cole e rode, nesta ordem, o conteúdo dos arquivos:
   1. `supabase/migrations/0001_schema.sql` (tabelas e regras de segurança)
   2. `supabase/migrations/0002_seed.sql` (os 2 consultórios reais, contatos e perguntas frequentes)
3. Crie o seu usuário de administrador: **Authentication → Users → Add user → Create new user**
   - E-mail: `rogatoquadros@live.com` · escolha uma senha · marque **Auto Confirm User**.
4. Volte ao **SQL Editor** e rode `supabase/migrations/0003_primeiro_admin.sql`. Isso libera o painel para esse e-mail.
   - Para a secretária: crie o usuário dela do mesmo jeito e rode o mesmo SQL trocando o e-mail e o nome.
5. Em **Authentication → URL Configuration**:
   - Site URL: `https://drrogato.com.br`
   - Redirect URLs: `https://drrogato.com.br/admin/nova-senha` (usado na recuperação de senha)
6. Em **Project Settings → API**, copie o **Project URL** e a chave **anon public**. Você vai usá-los na Vercel.

### E-mail de aviso quando alguém preencher o formulário (opcional)
1. Crie uma conta gratuita em https://resend.com e gere uma **API Key**.
2. Instale o Supabase CLI (https://supabase.com/docs/guides/cli) e, na pasta do projeto, rode:
   ```
   supabase login
   supabase link --project-ref SEU-PROJECT-REF
   supabase secrets set RESEND_API_KEY=re_xxx NOTIFICAR_PARA=rogatoquadros@live.com
   # opcionais: NOTIFICAR_DE="Site Dr. Rogato <contato@drrogato.com.br>" (exige domínio verificado no Resend)
   #            ORIGENS_PERMITIDAS=https://drrogato.com.br,https://www.drrogato.com.br
   supabase functions deploy notificar-contato --no-verify-jwt
   ```
   Por segurança, a função só envia e-mail de mensagens que acabaram de ser gravadas no banco (evita spam).
   Sem isso o formulário continua funcionando: as mensagens ficam salvas no painel, em **Mensagens**.

## 2. Vercel (hospedagem, HTTPS automático)

1. Coloque o código num repositório do GitHub (ex.: `drrogato-site`).
2. Crie uma conta em https://vercel.com com o seu GitHub e clique em **Add New → Project → Import** nesse repositório.
   - Framework: **Vite** (detectado sozinho). Build: `npm run build`. Output: `dist`.
3. Em **Environment Variables**, cadastre:
   | Nome | Valor |
   |---|---|
   | `VITE_SUPABASE_URL` | Project URL do Supabase |
   | `VITE_SUPABASE_ANON_KEY` | chave anon public do Supabase |
   | `VITE_SITE_URL` | `https://drrogato.com.br` |
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
