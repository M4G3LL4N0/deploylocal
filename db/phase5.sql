alter table public.leads
  add column if not exists outreach_status text default 'new',
  add column if not exists contact_email text,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists generated_site_id uuid references public.generated_sites(id) on delete set null;

create index if not exists leads_user_id_score_idx
  on public.leads (user_id, score desc);

create index if not exists generated_sites_owner_user_id_idx
  on public.generated_sites (owner_user_id, created_at desc);

-- Add queue table for lead generation
CREATE TABLE IF NOT EXISTS lead_queue (
  id SERIAL PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'queued',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  site_id UUID REFERENCES generated_sites(id),
  error_message TEXT
);

-- Add indexes for queue processingCREATE INDEX IF NOT EXISTS lead_queue_status_idx ON public.lead_queue (status);
CREATE INDEX IF NOT EXISTS lead_queue_created_at_idx ON public.lead_queue (created_at);
