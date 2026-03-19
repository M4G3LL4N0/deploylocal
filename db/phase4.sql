alter table public.generated_sites
  add column if not exists preview_token text,
  add column if not exists preview_enabled boolean default true;

create table if not exists public.client_site_invites (
  id uuid primary key default gen_random_uuid(),
  generated_site_id uuid not null references public.generated_sites(id) on delete cascade,
  email text not null,
  token text not null unique,
  claimed boolean default false,
  created_at timestamptz default now()
);

alter table public.client_site_invites enable row level security;

drop policy if exists "client_site_invites_owner_select" on public.client_site_invites;
create policy "client_site_invites_owner_select"
on public.client_site_invites
for select
using (
  exists (
    select 1
    from public.generated_sites gs
    where gs.id = generated_site_id      and gs.owner_user_id = auth.uid()
  )
);

drop policy if exists "client_site_invites_owner_insert" on public.client_site_invites;
create policy "client_site_invites_owner_insert"
on public.client_site_invites
for insert
with check (
  exists (
    select 1
    from public.generated_sites gs
    where gs.id = generated_site_id
      and gs.owner_user_id = auth.uid()
  )
);

drop policy if exists "client_site_invites_owner_update" on public.client_site_invites;
create policy "client_site_invites_owner_update"
on public.client_site_invites
for update
using (
  exists (
    select 1
    from public.generated_sites gs
    where gs.id = generated_site_id
      and gs.owner_user_id = auth.uid()
  )
);

-- Add call tracking columns to leads table
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS call_attempts INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_called_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS notes TEXT;
