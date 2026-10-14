-- 0006: endurecimento de segurança (auditoria 14/10/2026)

-- 1) is_admin() fora do schema exposto pela API (não pode ser chamada via /rest/v1/rpc)
create schema if not exists privado;
revoke all on schema privado from public;
grant usage on schema privado to anon, authenticated;
alter function public.is_admin() set schema privado;
revoke all on function privado.is_admin() from public;
grant execute on function privado.is_admin() to anon, authenticated;
revoke all on function public.promover_admin_autorizado() from public, anon, authenticated;

-- 2) Privilégios mínimos nas tabelas (o RLS continua valendo por cima)
revoke all on all tables in schema public from anon, authenticated;
grant select on public.avisos, public.config_telemedicina, public.conteudo_site, public.excecoes,
  public.faq, public.horarios_local, public.locais, public.redes_sociais to anon, authenticated;
grant insert (id, nome, telefone, email, cidade, modalidade, mensagem, consentimento) on public.mensagens_contato to anon, authenticated;
grant insert, update, delete on public.avisos, public.config_telemedicina, public.conteudo_site, public.excecoes,
  public.faq, public.horarios_local, public.locais, public.redes_sociais to authenticated;
grant select, update, delete on public.mensagens_contato to authenticated;
grant select on public.admins to authenticated;
grant select, insert, update, delete on public.admins_autorizados to authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;

-- 3) Admin só é promovido depois de confirmar o e-mail
create or replace function public.promover_admin_autorizado()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.email_confirmed_at is null then return new; end if;
  insert into public.admins (user_id, nome)
  select new.id, a.nome from public.admins_autorizados a where lower(a.email) = lower(new.email)
  on conflict do nothing;
  return new;
end $$;

create or replace trigger t_promover_admin after insert or update of email_confirmed_at on auth.users
  for each row execute function public.promover_admin_autorizado();

-- 4) Formulário de contato: campos controlados pelo servidor e limite de envios
alter table public.mensagens_contato add column if not exists notificada boolean not null default false;

create or replace function privado.guardar_mensagem()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.created_at := now();
  new.lida := false;
  new.notificada := false;
  if (select count(*) from public.mensagens_contato
      where telefone = new.telefone and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'Muitas mensagens deste telefone. Tente mais tarde.' using errcode = 'P0001';
  end if;
  if (select count(*) from public.mensagens_contato where created_at > now() - interval '10 minutes') >= 30 then
    raise exception 'Muitas mensagens no momento. Tente mais tarde.' using errcode = 'P0001';
  end if;
  return new;
end $$;
revoke all on function privado.guardar_mensagem() from public, anon, authenticated;

create or replace trigger t_guardar_mensagem before insert on public.mensagens_contato
  for each row execute function privado.guardar_mensagem();
create index if not exists mensagens_contato_tel_data on public.mensagens_contato (telefone, created_at);
