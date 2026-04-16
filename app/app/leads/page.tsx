"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { searchBusinesses, saveLeads, bulkGenerateSites } from "@/lib/api/client";

type LeadResult = {
  id: string;
  business_name: string;
  category: string;
  phone: string;
  address: string;
  city: string;
  website_url: string | null;
  has_website: boolean;
  rating: number | null;
  review_count: number | null;
  score: number;
  website_quality_score: number | null;
};

type SearchResponse = {
  city: string;
  category: string;
  radius: number;
  results: LeadResult[];
};

export default function LeadsPage() {
  const supabase = createClient();

  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [radius, setRadius] = useState("5000");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [results, setResults] = useState<LeadResult[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const topFiveIds = useMemo(
    () => results.slice(0, 5).map((lead) => lead.id),
    [results]
  );

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setResults([]);
    setSelectedIds([]);

    try {
      const { data: user } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Unauthorized");
      }

      const response = await searchBusinesses({
        city,
        category,
        radius: Number(radius),
      });

      const leads = response.results || [];
      setResults(leads);
      setSelectedIds(leads.slice(0, 5).map((lead) => lead.id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Search failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveLeads() {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const { data: user } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Unauthorized");
      }

      if (!user) {
        throw new Error("Please log in first.");
      }

      const response = await saveLeads(results);
      setMessage(`Saved ${response.inserted} leads.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save leads";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleBulkGenerate() {
    setBulkGenerating(true);
    setError("");
    setMessage("");

    try {
      if (selectedIds.length === 0) {
        throw new Error("Select at least one lead first.");
      }

      const { data: user } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Unauthorized");
      }

      if (!user) {
        throw new Error("Please log in first.");
      }

      const saveResponse = await saveLeads(results);
      if (!user) {
        throw new Error("User not found");
      }

      const { data: savedLeads, error: leadsError } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", user.id)
        .in("external_id", selectedIds);

      if (leadsError) {
        throw new Error(leadsError.message);
      }

      const internalLeadIds = (savedLeads || []).map((lead) => lead.id);

      const bulkResponse = await bulkGenerateSites(internalLeadIds);
      setMessage(
        `Created ${bulkResponse.created?.length || 0} sites. Failed: ${bulkResponse.failed?.length || 0}.`
      );
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Bulk generation failed";
      setError(msg);
    } finally {
      setBulkGenerating(false);
    }
  }

  function toggleLead(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function selectTopFive() {
    setSelectedIds(topFiveIds);
  }

  async function handleGenerateSite(leadId: string) {
    try {
      const lead = results.find(l => l.id === leadId);
      if (!lead) return;

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

      if (!res.ok) {
        throw new Error("Site generation failed");
      }

      setMessage("Site generated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Site generation failed");
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Admin Lead Engine
            </div>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight">
              Private lead discovery dashboard
            </h1>
            <p className="mt-4 text-lg text-zinc-400">
              Search local businesses, detect weak or missing websites, score the
              best opportunities, save them, and generate websites at scale from
              your admin-only dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/app/queue"
              className="rounded-full border border-white/15 px-5 py-3 text-sm text-white"
            >
              View Queue
            </Link>
            <Button
              variant="secondary"
              size="md"
              onClick={handleSaveLeads}
              disabled={saving || results.length === 0}
              className="rounded-full"
            >
              {saving ? "Saving..." : "Save Leads"}
            </Button>
            <Button
              variant="bulk"
              size="md"
              onClick={handleBulkGenerate}
              disabled={bulkGenerating || results.length === 0 || selectedIds.length === 0}
              className="rounded-full"
            >
              {bulkGenerating
                ? "Generating..."
                : `Generate Sites (${selectedIds.length})`}
            </Button>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-10 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-[420px_1fr]"
        >
          <input
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <input
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            placeholder="Category (e.g. plumber)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <input
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            placeholder="Radius in meters"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search Businesses"}
          </button>
        </form>

        {results.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={selectTopFive}
              className="rounded-full border border-white/15 px-4 py-2 text-xs text-white"
            >
              Select Top 5
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(results.map((lead) => lead.id))}
              className="rounded-full border border-white/15 px-4 py-2 text-xs text-white"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="rounded-full border border-white/15 px-4 py-2 text-xs text-white"
            >
              Clear
            </button>
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {message}
          </div>
        ) : null}

        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="border-b border-white/10 bg-black/30 text-zinc-400">
                <tr>
                  <th className="px-4 py-4 font-medium">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === results.length}
                      onChange={() => 
                        selectedIds.length === results.length 
                          ? setSelectedIds([])
                          : setSelectedIds(results.map(lead => lead.id))
                      }
                    />
                  </th>
                  <th className="px-4 py-4 font-medium">Business</th>
                  <th className="px-4 py-4 font-medium">Category</th>
                  <th className="px-4 py-4 font-medium">Phone</th>
                  <th className="px-4 py-4 font-medium">Website</th>
                  <th className="px-4 py-4 font-medium">Score</th>
                  <th className="px-4 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-10 text-center text-zinc-500"
                    >
                      No leads yet. Search by city and category to begin.
                    </td>
                  </tr>
                ) : (
                  results.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(lead.id)}
                          onChange={() => toggleLead(lead.id)}
                          className="rounded border-white/20 focus:ring-white/50"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-white">
                          {lead.business_name}
                        </div>
                        <div className="text-xs text-zinc-500">{lead.city}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white">
                          {lead.category || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {lead.phone ? (
                          <div className="flex items-center gap-2">
                            <span className="text-white">{lead.phone}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(lead.phone)}
                              className="text-zinc-400 hover:text-white transition"
                              title="Copy phone"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <span className="text-zinc-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {lead.website_url ? (
                          <a
                            href={lead.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:underline flex items-center gap-1"
                          >
                            Visit
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          </a>
                        ) : (
                          <span className="text-zinc-500">No website</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-white/10 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                lead.score > 70 ? 'bg-green-500' :
                                lead.score > 40 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} 
                              style={{ width: `${lead.score}%` }}
                            />
                          </div>
                          <span className="text-xs text-zinc-400">
                            {lead.score.toFixed(0)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/app/leads/${lead.id}`}
                            className="text-zinc-400 hover:text-white transition"
                            title="View lead"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleGenerateSite(lead.id)}
                            className="text-zinc-400 hover:text-white transition"
                            title="Generate site"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                              <polyline points="13 2 13 9 20 9"></polyline>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
