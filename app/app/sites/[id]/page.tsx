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

  // Template-specific rendering
  const renderTemplateContent = () => {
    switch (site.template.type) {
      case "plumber":
        return (
          <div className="space-y-8">
            <section>
              <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                Hero
              </div>
              <h2 className="mt-3 text-4xl font-semibold">
                {site.site_json?.headline || site.business_name}
              </h2>
              <p className="mt-4 text-zinc-400">
                {site.site_json?.subheadline || "Professional plumbing services"}
              </p>
            </section>

            <section>
              <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
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
            </section>

            {site.site_json?.emergency && (
              <section>
                <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                  Emergency Services
                </div>
                <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                  {site.site_json.emergency}
                </div>
              </section>
            )}

            <section>
              <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                About
              </div>
              <p className="mt-4 text-zinc-400">
                {site.site_json?.about || "Professional plumbing services"}
              </p>
            </section>
          </div>
        );

      case "dentist":
        return (
          <div className="space-y-8">
            <section>
              <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                Hero
              </div>
              <h2 className="mt-3 text-4xl font-semibold">
                {site.site_json?.headline || site.business_name}
              </h2>
              <p className="mt-4 text-zinc-400">
                {site.site_json?.subheadline || "Comprehensive dental care"}
              </p>
            </section>

            <section>
              <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                Services
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {(site.site_json?.services || []).map((service) => (
                  <div
                    key={service}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-300"
                  >
                    {service}
                  </div>
                ))}
              </div>
            </section>

            {site.site_json?.testimonials && site.site_json.testimonials.length > 0 && (
              <section>
                <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                  Patient Testimonials
                </div>
                <div className="mt-4 space-y-4">
                  {site.site_json.testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-300"
                    >
                      "{testimonial}"
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                About
              </div>
              <p className="mt-4 text-zinc-400">
                {site.site_json?.about || "Comprehensive dental care"}
              </p>
            </section>
          </div>
        );

      case "restaurant":
        return (
          <div className="space-y-8">
            <section>
              <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                Hero
              </div>
              <h2 className="mt-3 text-4xl font-semibold">
                {site.site_json?.headline || site.business_name}
              </h2>
              <p className="mt-4 text-zinc-400">
                {site.site_json?.subheadline || "Fine dining experience"}
              </p>
            </section>

            <section>
              <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                Menu Highlights
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {(site.site_json?.menu_highlights || []).map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                About
              </div>
              <p className="mt-4 text-zinc-400">
                {site.site_json?.about || "Fine dining experience"}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {site.site_json?.hours && (
                <section>
                  <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                    Hours
                  </div>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-300">
                    {site.site_json.hours}
                  </div>
                </section>
              )}

              {site.site_json?.location && (
                <section>
                  <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                    Location
                  </div>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-300">
                    {site.site_json.location}
                  </div>
                </section>
              )}
            </div>
          </div>
        );

      case "barber":
        return (
          <div className="space-y-8">
            <section>
              <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                Hero
              </div>
              <h2 className="mt-3 text-4xl font-semibold">
                {site.site_json?.headline || site.business_name}
              </h2>
              <p className="mt-4 text-zinc-400">
                {site.site_json?.subheadline || "Professional barber services"}
              </p>
            </section>

            <section>
              <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
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
            </section>

            {site.site_json?.team && site.site_json.team.length > 0 && (
              <section>
                <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                  Our Team
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {site.site_json.team.map((member, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4"
                    >
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-zinc-400">{member.role}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                About
              </div>
              <p className="mt-4 text-zinc-400">
                {site.site_json?.about || "Professional barber services"}
              </p>
            </section>
          </div>
        );

      default:
        return (
          <div className="space-y-8">
            <section>
              <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                Hero
              </div>
              <h2 className="mt-3 text-4xl font-semibold">
                {site.site_json?.headline || site.business_name}
              </h2>
              <p className="mt-4 text-zinc-400">
                {site.site_json?.subheadline || "Your business website"}
              </p>
            </section>

            <section>
              <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
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
            </section>

            <section>
              <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                About
              </div>
              <p className="mt-4 text-zinc-400">
                {site.site_json?.about || "Your business description"}
              </p>
            </section>
          </div>
        );
    }
  };

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
          {renderTemplateContent()}
        </div>
      </div>
    </main>
  );
}
