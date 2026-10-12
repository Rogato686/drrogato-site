-- Quem for criado (Authentication → Users) com um e-mail desta lista vira administrador automaticamente.
-- Para autorizar a secretária: insert into public.admins_autorizados (email, nome) values ('email@exemplo.com', 'Nome');
create table if not exists public.admins_autorizados (
  email text primary key,
  nome text not null default ''
);
alter table public.admins_autorizados enable row level security;
create policy "admin vê autorizados" on public.admins_autorizados for select using (public.is_admin());
create policy "admin escreve autorizados" on public.admins_autorizados for all using (public.is_admin()) with check (public.is_admin());
insert into public.admins_autorizados (email, nome) values ('rogatoquadros@live.com', 'Dr. Rogato') on conflict do nothing;

create or replace function public.promover_admin_autorizado() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.admins (user_id, nome)
  select new.id, a.nome from public.admins_autorizados a where lower(a.email) = lower(new.email)
  on conflict do nothing;
  return new;
end $$;
revoke execute on function public.promover_admin_autorizado() from public, anon, authenticated;

create trigger t_promover_admin after insert on auth.users
  for each row execute function public.promover_admin_autorizado();
