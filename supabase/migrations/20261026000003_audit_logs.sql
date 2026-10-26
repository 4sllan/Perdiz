-- PDZ-015: trilha de auditoria (append-only no domínio).

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  reason text,
  request_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index audit_entity_idx on audit_logs(entity_type, entity_id);
create index audit_actor_idx on audit_logs(actor_user_id);

alter table public.audit_logs enable row level security;

-- Somente admin lê; escrita exclusiva via service_role.
create policy audit_admin_read on public.audit_logs
  for select to authenticated using (public.has_role('admin'));
