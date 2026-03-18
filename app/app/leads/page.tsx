"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [results, setResults] = useState<LeadResult[]>([]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/search-businesses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city,
          category,
          radius: Number(radius),
        }),
      });

      const data = (await res.json()) as SearchResponse | { error: string };

      if (!res.ok) {
        throw new Error("error" in data ? data.error : "Search failed");
      }

      setResults((data as SearchResponse).results || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
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
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        throw new Error("Please log in first.");
      }

      const leadsToInsert = results.map((lead) => ({
        user_id: user.id,
        external_id: lead.id,
        business_name: lead.business_name,
        category: lead.category,
        phone: lead.phone,
        address: lead.address,
        city: lead.city,
        website_url: lead.website_url,
        has_website: lead.has_website,
        rating: lead.rating,
        review_count: lead.review_count,
        score: lead.score,
        status: "new",
      }));

      const insertPromises = leadsToInsert.map((lead) =>
        supabase.from("leads").insert(lead).select("id").single()
      );

      const insertResults = await Promise.allSettled(insertPromises);

      const successCount = insertResults.filter(
        (result) => result.status === "fulfilled"
      ).length;

      setMessage(`Saved ${successCount} lead${successCount === 1 ? "" : "s"}.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save leads";
      setError(msg);
    } finally {
      setSaving(false);
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
              This is admin-only. Search local businesses, detect weak or missing
              websites, score the best opportunities, and save them into your lead system.
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
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Leads"}
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-10 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-4"
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
                      colSpan={8}
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
