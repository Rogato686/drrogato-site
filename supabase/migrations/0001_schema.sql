-- Site drrogato.com.br: estrutura, segurança (RLS) e tempo real.

create extension if not exists pgcrypto;

-- Administradores (médico e secretária). Só quem está aqui escreve no painel.
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nome text not null default '',
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create table public.locais (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  endereco text not null default '',
  numero text not null default '',
  complemento text not null default '',
  bairro text not null default '',
  cidade text not null default '',
  uf char(2) not null default 'MG',
  cep text not null default '',
  maps_url text not null default '',
  telefone text not null default '',
  observacoes text not null default '',
  agenda_url text not null default '',
  ordem int not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.horarios_local (
  id uuid primary key default gen_random_uuid(),
  local_id uuid not null references public.locais(id) on delete cascade,
  dia_semana smallint not null check (dia_semana between 0 and 6), -- 0 = domingo
  inicio time not null,
  fim time not null,
  check (fim > inicio)
);
create index on public.horarios_local (local_id);

-- Férias, feriados e bloqueios. local_id nulo = vale para todos os locais.
create table public.excecoes (
  id uuid primary key default gen_random_uuid(),
  local_id uuid references public.locais(id) on delete cascade,
  data_inicio date not null,
  data_fim date not null,
  motivo text not null default '',
  check (data_fim >= data_inicio)
);

create table public.config_telemedicina (
  id int primary key default 1 check (id = 1),
  ativo boolean not null default true,
  horarios jsonb not null default '[]'::jsonb, -- [{dia_semana, inicio, fim}]
  observacoes text not null default '',
  agenda_url text not null default '',
  updated_at timestamptz not null default now()
);

create table public.redes_sociais (
  id int primary key default 1 check (id = 1),
  whatsapp text not null default '',
  email text not null default '',
  instagram text not null default '',
  youtube text not null default '',
  tiktok text not null default '',
  facebook text not null default '',
  linkedin text not null default '',
  doctoralia text not null default '',
  updated_at timestamptz not null default now()
);

create table public.faq (
  id uuid primary key default gen_random_uuid(),
  pagina text not null default 'home' check (pagina in ('home', 'telemedicina')),
  pergunta text not null,
  resposta text not null,
  ordem int not null default 0,
  ativo boolean not null default true
);

create table public.avisos (
  id uuid primary key default gen_random_uuid(),
  texto text not null,
  link text not null default '',
  ativo boolean not null default true,
  inicio date,
  fim date,
  created_at timestamptz not null default now()
);

create table public.conteudo_site (
  id int primary key default 1 check (id = 1),
  hero_titulo text not null default '',
  hero_subtitulo text not null default '',
  instagram_posts jsonb not null default '[]'::jsonb, -- URLs de publicações
  ga4_id text not null default '',
  gtm_id text not null default '',
  meta_pixel_id text not null default '',
  updated_at timestamptz not null default now()
);

-- Só dados de contato: nenhum dado de saúde é coletado pelo site.
create table public.mensagens_contato (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome text not null check (char_length(nome) between 2 and 120),
  telefone text not null check (char_length(telefone) between 8 and 30),
  email text not null default '' check (char_length(email) <= 160),
  cidade text not null default '' check (char_length(cidade) <= 120),
  modalidade text not null default '' check (modalidade in ('', 'presencial', 'online', 'duvida')),
  mensagem text not null default '' check (char_length(mensagem) <= 2000),
  consentimento boolean not null check (consentimento),
  lida boolean not null default false
);

-- RLS: leitura pública só do que é publicado; escrita só por admins.
alter table public.admins enable row level security;
alter table public.locais enable row level security;
alter table public.horarios_local enable row level security;
alter table public.excecoes enable row level security;
alter table public.config_telemedicina enable row level security;
alter table public.redes_sociais enable row level security;
alter table public.faq enable row level security;
alter table public.avisos enable row level security;
alter table public.conteudo_site enable row level security;
alter table public.mensagens_contato enable row level security;

create policy "admin vê admins" on public.admins for select using (public.is_admin());

create policy "público lê locais ativos" on public.locais for select using (ativo or public.is_admin());
create policy "admin escreve locais" on public.locais for all using (public.is_admin()) with check (public.is_admin());

create policy "público lê horários" on public.horarios_local for select
  using (exists (select 1 from public.locais l where l.id = local_id and (l.ativo or public.is_admin())));
create policy "admin escreve horários" on public.horarios_local for all using (public.is_admin()) with check (public.is_admin());

create policy "público lê exceções" on public.excecoes for select using (true);
create policy "admin escreve exceções" on public.excecoes for all using (public.is_admin()) with check (public.is_admin());

create policy "público lê telemedicina" on public.config_telemedicina for select using (true);
create policy "admin escreve telemedicina" on public.config_telemedicina for all using (public.is_admin()) with check (public.is_admin());

create policy "público lê redes" on public.redes_sociais for select using (true);
create policy "admin escreve redes" on public.redes_sociais for all using (public.is_admin()) with check (public.is_admin());

create policy "público lê faq ativo" on public.faq for select using (ativo or public.is_admin());
create policy "admin escreve faq" on public.faq for all using (public.is_admin()) with check (public.is_admin());

create policy "público lê avisos ativos" on public.avisos for select using (ativo or public.is_admin());
create policy "admin escreve avisos" on public.avisos for all using (public.is_admin()) with check (public.is_admin());

create policy "público lê conteúdo" on public.conteudo_site for select using (true);
create policy "admin escreve conteúdo" on public.conteudo_site for all using (public.is_admin()) with check (public.is_admin());

-- Visitante só pode inserir (com consentimento); só admin lê, marca como lida e apaga.
create policy "visitante envia mensagem" on public.mensagens_contato for insert to anon, authenticated
  with check (consentimento and not lida);
create policy "admin lê mensagens" on public.mensagens_contato for select using (public.is_admin());
create policy "admin atualiza mensagens" on public.mensagens_contato for update using (public.is_admin()) with check (public.is_admin());
create policy "admin apaga mensagens" on public.mensagens_contato for delete using (public.is_admin());

-- updated_at automático
create or replace function public.tocar_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger t_locais before update on public.locais for each row execute function public.tocar_updated_at();
create trigger t_tele before update on public.config_telemedicina for each row execute function public.tocar_updated_at();
create trigger t_redes before update on public.redes_sociais for each row execute function public.tocar_updated_at();
create trigger t_conteudo before update on public.conteudo_site for each row execute function public.tocar_updated_at();

-- Tempo real: o site atualiza na hora quando o painel salva.
alter publication supabase_realtime add table
  public.locais, public.horarios_local, public.excecoes, public.config_telemedicina,
  public.redes_sociais, public.faq, public.avisos, public.conteudo_site;
