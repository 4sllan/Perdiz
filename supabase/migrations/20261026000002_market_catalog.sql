-- PDZ-013: catálogo de mercados (categorias, mercados, traduções, outcomes).

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  icon text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.category_translations (
  category_id uuid not null references categories(id) on delete cascade,
  locale text not null check (locale in ('br','us','pt','es')),
  name text not null,
  description text,
  primary key (category_id, locale)
);

create table public.markets (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid not null references categories(id),
  status text not null default 'draft' check (status in
    ('draft','review','open','paused','closed','resolving','resolved','cancelled')),
  market_type text not null default 'binary' check (market_type in ('binary','multi')),
  tick_size numeric(10,6) not null default 0.01,
  min_price numeric(10,6) not null default 0.01,
  max_price numeric(10,6) not null default 0.99,
  opens_at timestamptz,
  closes_at timestamptz,
  resolved_at timestamptz,
  resolution_outcome_id uuid,
  created_by uuid references auth.users(id),
  version bigint not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.market_translations (
  market_id uuid not null references markets(id) on delete cascade,
  locale text not null check (locale in ('br','us','pt','es')),
  title text not null,
  description text not null default '',
  resolution_rules text not null default '',
  resolution_source_url text,
  publish_state text not null default 'draft' check (publish_state in ('draft','published')),
  primary key (market_id, locale)
);

create table public.market_outcomes (
  id uuid primary key default gen_random_uuid(),
  market_id uuid not null references markets(id) on delete cascade,
  outcome_key text not null,
  sort_order int not null default 0,
  is_winner boolean,
  unique (market_id, outcome_key)
);

alter table markets
  add constraint markets_resolution_outcome_fk
  foreign key (resolution_outcome_id) references market_outcomes(id);

create index markets_status_idx on markets(status);
create index markets_category_idx on markets(category_id);
create index markets_closes_idx on markets(closes_at);
create index market_translations_pub_idx on market_translations(locale, publish_state);
create index outcomes_market_idx on market_outcomes(market_id);

alter table public.categories enable row level security;
alter table public.category_translations enable row level security;
alter table public.markets enable row level security;
alter table public.market_translations enable row level security;
alter table public.market_outcomes enable row level security;

-- Leitura pública: categorias ativas e mercados publicados (open+).
create policy categories_public_read on public.categories
  for select to anon, authenticated using (is_active);
create policy category_translations_public_read on public.category_translations
  for select to anon, authenticated using (true);
create policy markets_public_read on public.markets
  for select to anon, authenticated
  using (status in ('open','paused','closed','resolving','resolved','cancelled'));
create policy market_translations_public_read on public.market_translations
  for select to anon, authenticated using (publish_state = 'published');
create policy outcomes_public_read on public.market_outcomes
  for select to anon, authenticated using (
    exists (select 1 from markets m
            where m.id = market_id and m.status in
              ('open','paused','closed','resolving','resolved','cancelled')));

-- Admin/editor lê tudo; escrita exclusiva via service_role.
create policy categories_admin_read on public.categories
  for select to authenticated using (public.has_role('admin') or public.has_role('content_editor'));
create policy markets_admin_read on public.markets
  for select to authenticated using (public.has_role('admin') or public.has_role('content_editor'));
create policy market_translations_admin_read on public.market_translations
  for select to authenticated using (public.has_role('admin') or public.has_role('content_editor'));
create policy category_translations_admin_read on public.category_translations
  for select to authenticated using (public.has_role('admin') or public.has_role('content_editor'));
create policy outcomes_admin_read on public.market_outcomes
  for select to authenticated using (public.has_role('admin') or public.has_role('content_editor'));
