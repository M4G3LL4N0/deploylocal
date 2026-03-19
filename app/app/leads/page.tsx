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
            <button
              type="button"
              onClick={handleSaveLeads}
              disabled={saving || results.length === 0}
              className="rounded-full border border-white/15 px-5 py-3 text-sm text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Leads"}
            </button>
            <button
              type="button"
              onClick={handleBulkGenerate}
              disabled={bulkGenerating || results.length === 0 || selectedIds.length === 0}
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {bulkGenerating
                ? "Generating..."
                : `Generate Sites (${selectedIds.length})`}
            </button>
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
                  <th className="px-4 py-4 font-medium">Select</th>
                  <th className="px-4 py-4 font-medium">Business</th>
                  <th className="px-4 py-4 font-medium">Category</th>
                  <th className="px-4 py-4 font-medium">Phone</th>
                  <th className="px-4 py-4 font-medium">Address</th>
                  <th className="px-4 py-4 font-medium">Website</th>
                  <th className="px-4 py-4 font-medium">Rating</th>
                  <th className="px-4 py-4 font-medium">Reviews</th>
                  <th className="px-4 py-4 font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-10 text-center text-zinc-500"
                    >
                      No leads yet. Search by city and category to begin.
                    </td>
                  </tr>
                ) : (
                  results.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-white/5 last:border-b-0"
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(lead.id)}
                          onChange={() => toggleLead(lead.id)}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-white">
                          {lead.business_name}
                        </div>
                        <div className="text-xs text-zinc-500">{lead.city}</div>
                      </td>
                      <td className="px-4 py-4 text-zinc-300">
                        {lead.category || "—"}
                      </td>
                      <td className="px-4 py-4 text-zinc-300">
                        {lead.phone || "—"}
                      </td>
                      <td className="px-4 py-4 text-zinc-300">
                        {lead.address || "—"}
                      </td>
                      <td className="px-4 py-4">
                        {lead.has_website ? (
                          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                            Yes
                          </span>
                        ) : (
                          <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-zinc-300">
                        {lead.rating ?? "—"}
                      </td>
                      <td className="px-4 py-4 text-zinc-300">
                        {lead.review_count ?? "—"}
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white">
                          {lead.score}
                        </span>
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
