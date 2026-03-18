"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";

type GeneratedSite = {
  id: string;
  business_name: string;
  city: string | null;
  category: string | null;
  subdomain: string;
  site_type: "admin_generated" | "self_serve";
  status: "preview" | "active";
  preview_token: string | null;
  client_user_id: string | null;
  lead_id: string | null;
  site_json: {
    headline?: string;
    subheadline?: string;
    services?: string[];
    about?: string;
    cta?: string;
    faq?: { question: string; answer: string }[];
  };
};

export default function AdminSiteDetailPage() {
  const supabase = createClient();
  const params = useParams();
  const id = params.id as string;
  const [site, setSite] = useState<GeneratedSite | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSite() {
      const { data } = await supabase
        .from("generated_sites")
        .select("*")
        .eq("id", id)
        .single();

      setSite((data as GeneratedSite | null) ?? null);
      setLoading(false);
    }

    if (id) {
      loadSite();
    }
  }, [id, supabase]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-6 text-zinc-500">
          Loading site...
        </div>
      </main>
    );
  }

  if (!site) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-6 text-zinc-500">
          Site not found.
        </div>
      </main>
    );
  }

  const previewUrl = `/sites/${site.subdomain}${site.preview_token ? `?token=${site.preview_token}` : ""}`;

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Site Detail
            </div>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight">
              {site.business_name}
            </h1>
            <p className="mt-4 text-zinc-400">
              {site.subdomain}.deploylocal.app · {site.status}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={previewUrl}
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
            >
              Open Preview
            </Link>
            {site.lead_id ? (
              <Link
                href={`/app/leads/${site.lead_id}`}
                className="rounded-full border border-white/15 px-5 py-3 text-sm text-white"
              >
                View Lead
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Type</div>
            <div className="mt-2 text-lg font-semibold">{site.site_type}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Status</div>
            <div className="mt-2 text-lg font-semibold">{site.status}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">City</div>
            <div className="mt-2 text-lg font-semibold">{site.city || "—"}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Category</div>
            <div className="mt-2 text-lg font-semibold">{site.category || "—"}</div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
            Hero
          </div>
          <h2 className="mt-3 text-4xl font-semibold">
            {site.site_json?.headline || site.business_name}
          </h2>
          <p className="mt-4 text-zinc-400">
            {site.site_json?.subheadline || "No subheadline available."}
          </p>

          <div className="mt-8 text-xs uppercase tracking-[0.15em] text-zinc-500">
            Services
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(site.site_json?.services || []).map((service) => (
              <div
                key={service}
                className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-300"
              >
                {service}
              </div>
            ))}
          </div>

          <div className="mt-8 text-xs uppercase tracking-[0.15em] text-zinc-500">
            About
          </div>
          <p className="mt-4 text-zinc-400">
            {site.site_json?.about || "No about copy available."}
          </p>
        </div>
      </div>
    </main>
  );
}
