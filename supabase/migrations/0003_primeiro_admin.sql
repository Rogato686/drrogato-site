-- Primeiro administrador do painel (/admin).
--
-- Esta migração NÃO cria usuário nem senha. Antes de rodá-la:
--   1. No Supabase, abra Authentication → Users → Add user → Create new user.
--   2. Informe o e-mail rogatoquadros@live.com, defina uma senha forte e marque "Auto Confirm User".
--   3. Depois, rode o SQL abaixo no SQL Editor. Ele dá acesso de administrador a esse usuário.
--
-- Para incluir outra pessoa (por exemplo, a secretária), crie o usuário dela do mesmo jeito e rode:
--   insert into public.admins (user_id, nome) select id, 'Nome da pessoa' from auth.users where email = 'email@exemplo.com' on conflict do nothing;
-- Para remover o acesso:
--   delete from public.admins where user_id = (select id from auth.users where email = 'email@exemplo.com');
--
-- Se o usuário ainda não existir, o comando simplesmente não insere nada (sem erro).

insert into public.admins (user_id, nome) select id, 'Dr. Rogato' from auth.users where email = 'rogatoquadros@live.com' on conflict do nothing;
