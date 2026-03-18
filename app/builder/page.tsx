"use client";

import { useState } from "react";
import Link from "next/link";

type SitePreview = {
  businessName: string;
  city: string;
  businessType: string;
  subdomain: string;
  siteJson: any;
};

export default function BuilderPage() {
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<SitePreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPreview(null);

    try {
      const res = await fetch("/api/generate-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          city,
          businessType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate site");
      setPreview({
        businessName,
        city,
        businessType,
        subdomain: `${businessName.replace(/\s+/g, "").toLowerCase()}.deploylocal.app`,
        siteJson: data.siteJson || {},
      });
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="text-4xl font-bold mb-6">Instant Website Builder</h1>
        <p className="mb-8 text-zinc-400">
          Enter your business details and generate a live preview site in seconds.
        </p>
        <form onSubmit={handleGenerate} className="space-y-4">
          <input
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            placeholder="Business Name"
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            required
          />
          <input
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            placeholder="Category (e.g. plumber)"
            value={businessType}
            onChange={e => setBusinessType(e.target.value)}
            required
          />
          <input
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            placeholder="City"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Site"}
          </button>
        </form>
        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
        {preview && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-2 text-zinc-400 text-xs">Preview</div>
            <div className="mb-2 text-lg font-semibold">{preview.businessName}</div>
            <div className="mb-2 text-zinc-300">{preview.businessType} in {preview.city}</div>
            <div className="mb-2 text-zinc-400 text-xs">
              Subdomain: <span className="font-mono">{preview.subdomain}</span>
            </div>
            <div className="mb-4">
              <pre className="bg-black/40 rounded p-2 text-xs text-zinc-300 overflow-x-auto">
                {JSON.stringify(preview.siteJson, null, 2)}
              </pre>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black"
              >
                Sign Up to Claim Site
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/15 px-5 py-2 text-sm text-white"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
