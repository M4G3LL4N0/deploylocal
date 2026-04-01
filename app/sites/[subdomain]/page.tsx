"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";

type PageContent = {
  headline: string;
  subheadline?: string;
  content?: string;
  cta?: string;
  sections?: {
    title: string;
    items: string[];
  }[];
};

type SitePages = {
  home: PageContent;
  services: PageContent;
  about: PageContent;
  contact: PageContent;
  [key: string]: PageContent;
};

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
    pages?: SitePages;
    // Backwards compatible fields
    headline?: string;
    subheadline?: string;
    services?: string[];
    about?: string;
    cta?: string;
    faq?: { question: string; answer: string }[];
    emergency?: string;
    testimonials?: string[];
    menu_highlights?: string[];
    team?: { name: string; role: string }[];
  };
  template: {
    type: string;
    layout: string;
    sections: string[];
  };
};

export default function AdminSiteDetailPage() {
  const supabase = createClient();
  const params = useParams();
  const id = params.id as string;
  const [site, setSite] = useState<GeneratedSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

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

  function renderPageContent() {
    if (!site) return null;

    // Backwards compatibility for older sites
    if (!site.site_json.pages) {
      return (
        <div className="mt-8 space-y-8">
          <h2 className="text-3xl font-semibold tracking-tight">
            {site.site_json.headline || site.business_name}
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            {site.site_json.subheadline || "Professional services"}
          </p>
          
          {site.site_json.services && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Our Services</h3>
              <ul className="mt-2 list-disc pl-5">
                {site.site_json.services.map((service, i) => (
                  <li key={i} className="mt-1 text-zinc-400">
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    const page = site.site_json.pages[currentPage];
    if (!page) return null;

    return (
      <div className="mt-8 space-y-8">
        <h2 className="text-3xl font-semibold tracking-tight">
          {page.headline}
        </h2>
        
        {page.subheadline && (
          <p className="text-lg text-zinc-400">{page.subheadline}</p>
        )}

        {page.content && (
          <div className="prose prose-invert max-w-none">
            <p>{page.content}</p>
          </div>
        )}

        {page.sections && page.sections.map((section, i) => (
          <div key={i} className="mt-6">
            <h3 className="text-xl font-semibold">{section.title}</h3>
            <ul className="mt-2 list-disc pl-5">
              {section.items.map((item, j) => (
                <li key={j} className="mt-1 text-zinc-400">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {page.cta && (
          <div className="mt-8">
            <button className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black">
              {page.cta}
            </button>
          </div>
        )}
      </div>
    );
  }

  function renderNavigation() {
    if (!site?.site_json?.pages) return null;

    return (
      <nav className="flex flex-wrap gap-4 border-b border-white/10 pb-4">
        {Object.keys(site.site_json.pages).map((pageKey) => (
          <button
            key={pageKey}
            onClick={() => setCurrentPage(pageKey)}
            className={`px-3 py-2 text-sm font-medium ${
              currentPage === pageKey
                ? 'text-white border-b-2 border-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {pageKey.charAt(0).toUpperCase() + pageKey.slice(1)}
          </button>
        ))}
      </nav>
    );
  }

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
            <p className="mt-2 text-sm text-zinc-500">
              Template: {site.template.type} ({site.template.layout} layout)
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

        <div className="mt-8 grid gap-4 md:grid-cols-5">
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
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Template</div>
            <div className="mt-2 text-lg font-semibold">{site.template.type}</div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
          {site.status === "preview" && (
            <div className="mb-6 rounded-2xl border border-yellow-500/50 bg-yellow-500/10 p-4 text-center text-yellow-300">
              Preview — Not Live
            </div>
          )}
          
          {renderNavigation()}
          {renderPageContent()}
        </div>
      </div>
    </main>
  );
}
