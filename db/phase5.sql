alter table public.leads
  add column if not exists outreach_status text default 'new',
  add column if not exists contact_email text,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists generated_site_id uuid references public.generated_sites(id) on delete set null;

create index if not exists leads_user_id_score_idx
  on public.leads (user_id, score desc);

create index if not exists generated_sites_owner_user_id_idx
  on public.generated_sites (owner_user_id, created_at desc);
