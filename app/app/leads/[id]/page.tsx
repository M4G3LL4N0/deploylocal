"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { searchBusinesses, saveLeads, bulkGenerateSites, generateSite } from "@/lib/api/client";

type LeadRecord = {
  id: string;
  business_name: string;
  category: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  website_url: string | null;
  has_website: boolean;
  rating: number | null;
  review_count: number | null;
  score: number;
  outreach_status: string | null;
  generated_site_id: string | null;
};

const statuses = ["new", "queued", "contacted", "interested", "closed", "dead"];

export default function LeadDetailPage() {
  const supabase = createClient();
  const router = useRouter();
  const leadId = router.query.id as string;

  const [lead, setLead] = useState<LeadRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [siteGenerating, setSiteGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLead() {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .single();

      setLead((data as LeadRecord | null) ?? null);
      setLoading(false);
    }

    if (leadId) {
      loadLead();
    }
  }, [leadId, supabase]);

  async function updateStatus(nextStatus: string) {
    setStatusUpdating(true);
    setError("");
    setMessage("");

    try {
      const { data: updatedLead } = await supabase
        .from("leads")
        .update({
          outreach_status: nextStatus,
        })
        .eq("id", leadId)
        .single();

      setLead(updatedLead);
      setMessage("Lead status updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed");
    } finally {
      setStatusUpdating(false);
    }
  }

  async function generateSite() {
    if (!lead) return;

    setSiteGenerating(true);
    setError("");
    setMessage("");

    try {
      const { data: site } = await generateSite({
        businessName: lead.business_name,
        category: lead.category || "local business",
        city: lead.city || "local market",
        leadId: lead.id,
      });

      const { data: refreshedLead } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .single();

      setLead((refreshedLead as LeadRecord | null) ?? lead);
      setMessage("Site created successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Site generation failed");
    } finally {
      setSiteGenerating(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-6 text-zinc-500">
          Loading lead...
        </div>
      </main>
    );
  }

  if (!lead) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-6 text-zinc-500">
          Lead not found.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Lead Detail
            </div>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight">
              {lead.business_name}
            </h1>
            <p className="mt-4 text-zinc-400">
              {lead.city || "—"} · {lead.category || "—"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={generateSite}
              disabled={siteGenerating}
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black disabled:opacity-60"
            >
              {siteGenerating ? "Generating..." : "Generate Site"}
            </button>

            {lead.generated_site_id ? (
              <Link
                href={`/app/sites/${lead.generated_site_id}`}
                className="rounded-full border border-white/15 px-5 py-3 text-sm text-white"
              >
                View Site
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Score</div>
            <div className="mt-2 text-3xl font-semibold">{lead.score}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Website</div>
            <div className="mt-2 text-lg font-semibold">
              {lead.has_website ? "Has website" : "Missing website"}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Outreach Status</div>
            <div className="mt-2 text-lg font-semibold">
              {lead.outreach_status || "new"}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="grid gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <div className="text-sm text-zinc-400">Phone</div>
              <div className="mt-2">{lead.phone || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-zinc-400">Address</div>
              <div className="mt-2">{lead.address || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-zinc-400">Rating</div>
              <div className="mt-2">{lead.rating ?? "—"}</div>
            </div>
            <div>
              <div className="text-sm text-zinc-400">Review Count</div>
              <div className="mt-2">{lead.review_count ?? "—"}</div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-zinc-400">Update Outreach Status</div>
          <div className="mt-4 flex flex-wrap gap-3">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => updateStatus(status)}
                disabled={statusUpdating}
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white disabled:opacity-60"
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {message ? (
          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}
      </div>
    </main>
  );
}
