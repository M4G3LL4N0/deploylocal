import Link from "next/link";
import { notFound } from "next/navigation";
import { requireClient } from "@/lib/auth";

type SiteJson = {
  headline?: string;
  subheadline?: string;
  services?: string[];
  about?: string;
  cta?: string;
  faq?: { question: string; answer: string }[];
};

export default async function ClientSiteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ upgrade?: string }>;
}) {
  const { id } = await params;
  const { upgrade } = await searchParams;
  const { supabase, user } = await requireClient();

  const { data: site } = await supabase
    .from("generated_sites")
    .select("*")
    .eq("id", id)
    .eq("client_user_id", user.id)
    .single();

  if (!site) {
    notFound();
  }

  const siteJson = (site.site_json ?? {}) as SiteJson;

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Website Preview
            </div>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight">
              {site.business_name}
            </h1>
            <p className="mt-4 text-zinc-400">
              Status: {site.status} · Subdomain: {site.subdomain}.deploylocal.app
            </p>
          </div>

          <form action="/api/create-checkout" method="post">
            <input type="hidden" name="siteId" value={site.id} />
          </form>

          <button
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
            formAction="#"
          >
            Activate Site
          </button>
        </div>

        {upgrade ? (
          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            Activation flow placeholder ready. Stripe can be connected next.
          </div>
        ) : null}

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <section>
            <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
              Hero
            </div>
            <h2 className="mt-3 text-4xl font-semibold">
              {siteJson.headline || site.business_name}
            </h2>
            <p className="mt-4 max-w-2xl text-zinc-400">
              {siteJson.subheadline || "Your generated website preview appears here."}
            </p>
            <div className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-black">
              {siteJson.cta || "Request Activation"}
            </div>
          </section>

          <section className="mt-10">
            <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
              Services
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {(siteJson.services || []).map((service) => (
                <div
                  key={service}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-300"
                >
                  {service}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
              About
            </div>
            <p className="mt-4 text-zinc-400">
              {siteJson.about || "No about section has been generated yet."}
            </p>
          </section>

          {(siteJson.faq || []).length > 0 ? (
            <section className="mt-10">
              <div className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                FAQ
              </div>
              <div className="mt-4 space-y-3">
                {(siteJson.faq || []).map((item) => (
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
          ) : null}

          <div className="mt-10">
            <Link
              href={`/sites/${site.subdomain}${site.preview_token ? `?token=${site.preview_token}` : ""}`}
              target="_blank"
              className="rounded-full border border-white/15 px-5 py-3 text-sm text-white"
            >
              Open Preview
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
