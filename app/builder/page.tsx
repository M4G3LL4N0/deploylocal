"use client";

import { useState } from "react";

type GeneratedSite = {
  headline: string;
  subheadline: string;
  services: string[];
  about: string;
  cta: string;
  faq: { question: string; answer: string }[];
};

export default function BuilderPage() {
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [site, setSite] = useState<GeneratedSite | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSite(null);

    try {
      const res = await fetch("/api/generate-site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName,
          category,
          city,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setSite(data.site);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Public Builder
          </div>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">
            Generate a website in minutes
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            Enter your business details and DeployLocal will create a fast website
            preview under our platform workflow.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[420px_1fr]">
          <form
            onSubmit={handleGenerate}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <div className="space-y-4">
              <input
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                placeholder="Business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
              <input
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
              <input
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-black disabled:opacity-60"
              >
                {loading ? "Generating..." : "Generate Website"}
              </button>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}
          </form>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            {!site ? (
              <div className="text-zinc-500">
                Your generated website preview will appear here.
              </div>
            ) : (
              <div className="space-y-8">
                <section>
                  <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                    Hero
                  </div>
                  <h2 className="mt-3 text-4xl font-semibold">{site.headline}</h2>
                  <p className="mt-4 text-zinc-400">{site.subheadline}</p>
                  <div className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-black">
                    {site.cta}
                  </div>
                </section>

                <section>
                  <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                    Services
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {site.services.map((service) => (
                      <div
                        key={service}
                        className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-300"
                      >
                        {service}
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                    About
                  </div>
                  <p className="mt-4 text-zinc-400">{site.about}</p>
                </section>

                <section>
                  <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                    FAQ
                  </div>
                  <div className="mt-4 space-y-3">
                    {site.faq.map((item) => (
                      <div
                        key={item.question}
                        className="rounded-2xl border border-white/10 bg-black/30 p-4"
                      >
                        <div className="font-medium">{item.question}</div>
                        <div className="mt-2 text-sm text-zinc-400">
                          {item.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
