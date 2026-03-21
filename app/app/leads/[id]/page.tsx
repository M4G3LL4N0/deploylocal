"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { generateSite } from "@/lib/api/client";
import { generateOutreachMessage } from "@/lib/ai/outreach";

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
  website_quality_score: number | null;
  call_attempts: number;
  last_called_at: string | null;
  notes: string;
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
  const [pitchGenerating, setPitchGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [outreachMessages, setOutreachMessages] = useState<{
    callScript: string;
    sms: string;
    email: { subject: string; body: string };
  } | null>(null);
  const [callLog, setCallLog] = useState<Array<{ outcome: string; timestamp: string }>>([]);
  const [notes, setNotes] = useState("");

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
          call_attempts: lead.call_attempts + 1,
          last_called_at: new Date().toISOString(),
          notes: notes,
        })
        .eq("id", leadId)
        .eq("user_id", lead?.client_user_id ?? "")
        .select("*")
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

      const { data: refreshedLead } = await supabase        .from("leads")
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

  async function generatePitch() {
    if (!lead || !lead.generated_site_id) return;

    setPitchGenerating(true);
    setError("");
    setMessage("");

    try {
      const sitePreviewUrl = `/${lead.generated_site_id}`;
      const messages = generateOutreachMessage(lead, sitePreviewUrl);
      setOutreachMessages(messages);
      setMessage("Pitch generated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pitch generation failed");
    } finally {
      setPitchGenerating(false);
    }
  }

  const handleLogCall = () => {
    setCallLog([...callLog, { outcome: "no answer", timestamp: new Date().toISOString() }]);
  };

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
              <>
                <Link
                  href={`/app/sites/${lead.generated_site_id}`}
                  className="rounded-full border border-white/15 px-5 py-3 text-sm text-white"
                >
                  View Site
                </Link>
                <button
                  type="button"
                  onClick={generatePitch}
                  disabled={pitchGenerating}
                  className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-medium text-black disabled:opacity-60"
                >
                  {pitchGenerating ? "Generating..." : "Generate Pitch"}
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* Call Tracking Section */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-zinc-400">Call Tracking</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <div>Attempts: <strong>{lead.call_attempts}</strong></div>
            <div>Last Called: <strong>{lead.last_called_at ? new Date(lead.last_called_at).toLocaleString() : "—"}</strong></div>
          </div>
          <div className="mt-2 text-sm text-zinc-400">Notes</div>
          <textarea
            className="mt-1 rounded-2xl border border-white/10 bg-black px-4 py-2 text-white w-full"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about the call"
          />
          {lead.notes && (
            <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-2 text-xs">
              {lead.notes}
            </div>
          )}
          <button
            type="button"
            onClick={handleLogCall}
            className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={callLog.length >= 5}
          >
            {callLog.length < 5 ? "Log Call" : "Log Limit Reached"}
          </button>
        </div>

        {callLog.length > 0 && (
          <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-zinc-400">Recent Call Log</div>
            {callLog.map((entry, idx) => (
              <div key={idx} className="border-t border-white/5 pt-2 mt-2">
                <span className="text-sm text-zinc-300">
                  {entry.outcome} at {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Score Breakdown */}
        <Card title="Lead Score" description="How we evaluate this lead's potential">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="text-sm text-zinc-400">Overall Score</div>
              <div className="text-3xl font-semibold">{lead.score}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-zinc-400">Website</div>
              <div className="text-lg font-semibold">
                {lead.has_website ? (
                  <span className="text-emerald-500">Has website</span>
                ) : (
                  <span className="text-red-500">Missing website</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-zinc-400">Reviews</div>
              <div className="text-lg font-semibold">
                {lead.review_count || 0} reviews
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-zinc-400">Contact Info</div>
              <div className="text-lg font-semibold">
                {lead.phone ? (
                  <span className="text-emerald-500">Available</span>
                ) : (
                  <span className="text-red-500">Missing</span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-sm text-zinc-400">Score Breakdown</div>
            <div className="space-y-1">
              {Object.entries(scoreBreakdown).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="capitalize">{key}</span>
                  <span className="font-medium">{value} pts</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
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
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Website Quality</div>
            <div className="mt-2 text-3xl font-semibold">
              {lead.website_quality_score !== null ? lead.website_quality_score : "—"}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Phone</div>
            <div className="mt-2">{lead.phone || "—"}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Address</div>
            <div className="mt-2">{lead.address || "—"}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Rating</div>
            <div className="mt-2">{lead.rating ?? "—"}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Review Count</div>
            <div className="mt-2">{lead.review_count ?? "—"}</div>
          </div>
        </div>

        {outreachMessages && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Generated Outreach Messages</div>
                        <div className="mt-6 space-y-6">
              <div className="border border-white/5 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3">Cold Call Script</h3>
                <p className="text-zinc-300 whitespace-pre-line">{outreachMessages.callScript}</p>
              </div>
              
              <div className="border border-white/5 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3">SMS Message</h3>
                <p className="text-zinc-300 whitespace-pre-line">{outreachMessages.sms}</p>
              </div>
              
              <div className="border border-white/5 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3">Email</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-zinc-400">Subject: </span>
                    <span className="text-white">{outreachMessages.email.subject}</span>
                  </div>
                  <div className="text-zinc-300 whitespace-pre-line">{outreachMessages.email.body}</div>
                </div>
              </div>
            </div>
          </div>
        )}

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
