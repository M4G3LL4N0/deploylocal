"use client";

import { useState } from "react";
import Link from "next/link";

type GeneratedContent = {
  headline: string;
  subheadline: string;
  services: string[];
  about: string;
  cta: string;
  faq: Array<{ question: string; answer: string }>;
};

type SitePreview = {
  businessName: string;
  city: string;
  businessType: string;
  subdomain: string;
  content: GeneratedContent;
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
        content: data,
      });
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 mb-4">
            DeployLocal Builder
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Create Your Business Website
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Enter your business details below and get an instant, professional website preview. No credit card required.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Form Section */}
          <div className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-2xl font-semibold mb-6">Business Details</h2>
              <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-zinc-400 mb-2">
                    Business Name
                  </label>
                  <input
                    id="businessName"
                    className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none focus:border-white/30 transition"
                    placeholder="e.g. Downtown Plumbing"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-zinc-400 mb-2">
                    Category
                  </label>
                  <input
                    id="businessType"
                    className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none focus:border-white/30 transition"
                    placeholder="e.g. plumber, restaurant, salon"
                    value={businessType}
                    onChange={e => setBusinessType(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-zinc-400 mb-2">
                    City
                  </label>
                  <input
                    id="city"
                    className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none focus:border-white/30 transition"
                    placeholder="e.g. San Francisco"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-white px-6 py-4 text-base font-semibold text-black transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    "Generate Website Preview"
                  )}
                </button>
              </form>
              {error && (
                <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}
            </div>

            {/* Benefits */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-zinc-400 text-sm mb-1">Instant Setup</div>
                <div className="font-medium">Live in seconds</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-zinc-400 text-sm mb-1">Premium Design</div>
                <div className="font-medium">Professional look</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-zinc-400 text-sm mb-1">Mobile Ready</div>
                <div className="font-medium">Responsive layout</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-zinc-400 text-sm mb-1">SEO Optimized</div>
                <div className="font-medium">Built to rank</div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            {preview ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                {/* Preview Header */}
                <div className="bg-black/40 px-6 py-4 border-b border-white/10 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="ml-4 text-xs text-zinc-400 font-mono">
                    {preview.subdomain}
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-8 space-y-8">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3">
                      {preview.businessType} in {preview.city}
                    </div>
                    <h1 className="text-4xl font-bold leading-tight mb-4">
                      {preview.content.headline}
                    </h1>
                    <p className="text-xl text-zinc-300 leading-relaxed">
                      {preview.content.subheadline}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {preview.content.services.map((service, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-white flex-shrink-0" />
                        <span className="text-zinc-300">{service}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-8">
                    <h2 className="text-xl font-semibold mb-4">About Us</h2>
                    <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
                      {preview.content.about}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-8">
                    <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                      {preview.content.faq.map((item, idx) => (
                        <div key={idx}>
                          <h3 className="font-medium mb-2">{item.question}</h3>
                          <p className="text-zinc-400 text-sm">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-8">
                    <button className="w-full rounded-full bg-white px-6 py-4 text-base font-semibold text-black hover:opacity-90 transition">
                      {preview.content.cta}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 h-full min-h-[600px] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Website Preview</h3>
                  <p className="text-zinc-400 max-w-sm mx-auto">
                    Fill in your business details and click generate to see a live preview of your professional website.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-10">
            <h2 className="text-3xl font-bold mb-4">Ready to launch your site?</h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              After generating your preview, sign up to claim your subdomain and publish your site instantly.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/signup"
                className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-black hover:opacity-90 transition"
              >
                Get Started Free
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-white/15 px-8 py-3 text-sm text-white hover:bg-white/5 transition"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
