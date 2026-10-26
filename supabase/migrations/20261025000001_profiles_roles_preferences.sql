-- PDZ-011/012: perfis, papéis e preferências com RLS (deny por padrão).

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_path text,
  locale text not null default 'br',
  region text not null default 'br',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','content_editor','moderator','market_resolver','admin')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  locale text not null default 'br',
  display_currency text not null default 'BRL',
  timezone text,
  updated_at timestamptz not null default now()
);

create or replace function public.has_role(required_role text)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = required_role
  )
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.user_preferences (user_id) values (new.id);
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.user_preferences enable row level security;

-- profiles: leitura/escrita do próprio; admin lê todos.
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (auth.uid() = id or public.has_role('admin'));
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- user_preferences: leitura/escrita do próprio; admin lê todos.
create policy prefs_select_own on public.user_preferences
  for select to authenticated
  using (auth.uid() = user_id or public.has_role('admin'));
create policy prefs_update_own on public.user_preferences
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- user_roles: leitura do próprio ou admin; escrita somente via
-- service_role (RLS nega insert/update/delete para authenticated).
create policy roles_select_own on public.user_roles
  for select to authenticated
  using (auth.uid() = user_id or public.has_role('admin'));
