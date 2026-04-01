"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";

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
  const params = useParams();
  const leadId = params.id as string;

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
      const res = await fetch("/api/update-lead-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId,
          outreachStatus: nextStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Status update failed");
      }

      setLead(data.lead);
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
      const res = await fetch("/api/generate-and-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName: lead.business_name,
          category: lead.category || "local business",
          city: lead.city || "local market",
          leadId: lead.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Site generation failed");
      }

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

  async function handleGenerateSMS() {
    try {
      const res = await fetch("/api/generate-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId: lead.id,
          phone: lead.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "SMS generation failed");
      }

      navigator.clipboard.writeText(data.message);
      setMessage("SMS message copied to clipboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "SMS generation failed");
    }
  }

  async function handleGenerateEmail() {
    try {
      const res = await fetch("/api/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId: lead.id,
          email: lead.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Email generation failed");
      }

      navigator.clipboard.writeText(data.message);
      setMessage("Email message copied to clipboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email generation failed");
    }
  }

  async function handleCopyPreviewLink() {
    if (!lead.generated_site_id) return;

    try {
      const { data: site } = await supabase
        .from("generated_sites")
        .select("preview_token")
        .eq("id", lead.generated_site_id)
        .single();

      if (!site?.preview_token) {
        throw new Error("Preview token not found");
      }

      const previewUrl = `${window.location.origin}/preview/${site.preview_token}`;
      navigator.clipboard.writeText(previewUrl);
      setMessage("Preview link copied to clipboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to copy preview link");
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

        {/* Lead Metrics */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Score</div>
            <div className="mt-2 text-3xl font-semibold">{lead.score}</div>
            <div className="mt-1 text-sm text-zinc-400">
              {lead.score > 70 ? 'High Priority' :
               lead.score > 40 ? 'Medium Priority' : 'Low Priority'}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Website</div>
            <div className="mt-2 text-lg font-semibold">
              {lead.has_website ? "Has website" : "Missing website"}
            </div>
            {lead.website_quality_score !== null && (
              <div className="mt-1 text-sm text-zinc-400">
                Quality: {lead.website_quality_score}/100
              </div>
            )}
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Outreach Status</div>
            <div className="mt-2 text-lg font-semibold capitalize">
              {lead.outreach_status || "new"}
            </div>
            <div className="mt-1 text-sm text-zinc-400">
              Last updated: {new Date(lead.updated_at || lead.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Lead Details */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="text-sm text-zinc-400">Phone</div>
              <div className="mt-2 flex items-center gap-2">
                {lead.phone || "—"}
                {lead.phone && (
                  <>
                    <button
                      onClick={() => navigator.clipboard.writeText(lead.phone!)}
                      className="text-zinc-400 hover:text-white transition"
                      title="Copy phone"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-zinc-400 hover:text-white transition"
                      title="Call lead"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </a>
                  </>
                )}
              </div>
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

        {/* Outreach Actions */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-zinc-400">Outreach Actions</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {/* Status Update */}
            <div>
              <div className="text-sm text-zinc-400 mb-2">Update Status</div>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateStatus(status)}
                    disabled={statusUpdating}
                    className="rounded-full border border-white/15 px-3 py-1 text-sm text-white disabled:opacity-60"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Communication Actions */}
            <div>
              <div className="text-sm text-zinc-400 mb-2">Communicate</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleGenerateSMS()}
                  className="rounded-full border border-white/15 px-3 py-1 text-sm text-white"
                >
                  Generate SMS
                </button>
                <button
                  onClick={() => handleGenerateEmail()}
                  className="rounded-full border border-white/15 px-3 py-1 text-sm text-white"
                >
                  Generate Email
                </button>
                {lead.generated_site_id && (
                  <button
                    onClick={() => handleCopyPreviewLink()}
                    className="rounded-full border border-white/15 px-3 py-1 text-sm text-white"
                  >
                    Copy Preview Link
                  </button>
                )}
              </div>
            </div>
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
