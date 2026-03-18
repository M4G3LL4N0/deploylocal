import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SiteJson = {
  headline?: string;
  subheadline?: string;
  services?: string[];
  about?: string;
  cta?: string;
  faq?: { question: string; answer: string }[];
};

export default async function SitePreviewPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const supabase = await createClient();

  const { data: site } = await supabase
    .from("generated_sites")
    .select("*")
    .eq("subdomain", subdomain)
    .single();

  if (!site) {
    notFound();
  }

  const data = (site.site_json ?? {}) as SiteJson;

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="border-b bg-yellow-100 px-6 py-3 text-sm text-yellow-900">
        DeployLocal Preview · This site is in preview mode and not yet activated.
      </div>

      <div className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="text-5xl font-bold">
          {data.headline || site.business_name}
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-zinc-700">
          {data.subheadline || "Professional local business website preview."}
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {(data.services ?? []).map((service) => (
            <div key={service} className="rounded-2xl border p-4">
              {service}
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-3xl text-zinc-700">
          {data.about || "No about section available yet."}
        </div>

        {data.faq && data.faq.length > 0 ? (
          <div className="mt-12 space-y-4">
            {data.faq.map((item) => (
              <div key={item.question} className="rounded-2xl border p-4">
                <div className="font-semibold">{item.question}</div>
                <div className="mt-2 text-zinc-700">{item.answer}</div>
              </div>
            ))}
          </div>
        ) : null}

        <button className="mt-12 rounded-full bg-black px-6 py-3 text-white">
          {data.cta || "Request Activation"}
        </button>
      </div>
    </main>
  );
}
