-- Audit logs to record admin actions and access

create table if not exists public.audit_logs (
    id uuid primary key default gen_random_uuid(),
    actor_id uuid references auth.users (id) on delete set null,
    action text not null,
    target_type text,
    target_id text,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_audit_logs_actor_id on public.audit_logs(actor_id);
create index if not exists idx_audit_logs_action on public.audit_logs(action);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);

-- RLS
alter table public.audit_logs enable row level security;

-- Only admins can read audit logs
drop policy if exists "Only admins can view audit logs" on public.audit_logs;
create policy "Only admins can view audit logs"
    on public.audit_logs for select
    using (public.is_admin());

-- Admins can insert audit events
drop policy if exists "Admins can insert audit logs" on public.audit_logs;
create policy "Admins can insert audit logs"
    on public.audit_logs for insert
    with check (public.is_admin());
