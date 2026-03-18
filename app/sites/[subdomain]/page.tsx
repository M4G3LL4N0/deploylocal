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

export default async function SitePage({
  params,
  searchParams,
}: {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { subdomain } = await params;
  const { token } = await searchParams;

  const supabase = await createClient();

  const { data: site } = await supabase
    .from("generated_sites")
    .select("*")
    .eq("subdomain", subdomain)
    .single();

  if (!site) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAssignedClient = Boolean(user && site.client_user_id && user.id === site.client_user_id);
  const isOwner = Boolean(user && site.owner_user_id && user.id === site.owner_user_id);
  const hasPreviewToken =
    typeof token === "string" &&
    typeof site.preview_token === "string" &&
    token.length > 0 &&
    token === site.preview_token;

  if (!isAssignedClient && !isOwner && !hasPreviewToken) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Preview Locked
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            This website preview requires access
          </h1>
          <p className="mt-4 text-zinc-400">
            Ask DeployLocal for your private preview link or sign in to your client portal.
          </p>
        </div>
      </main>
    );
  }

  const data = (site.site_json || {}) as SiteJson;

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="border-b bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-900">
        DeployLocal Preview · This site is in preview mode and not yet activated.
      </div>

      <div className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="text-5xl font-bold">
          {data.headline || site.business_name}
        </h1>
        <p className="mt-4 text-lg">
          {data.subheadline || "Your generated website preview appears here."}
        </p>

        <div className="mt-10 grid gap-4">
          {(data.services || []).map((s) => (
            <div key={s} className="rounded-xl border p-4">
              {s}
            </div>
          ))}
        </div>

        <p className="mt-10 text-base">
          {data.about || "No about copy available yet."}
        </p>

        <button className="mt-10 rounded-full bg-black px-6 py-3 text-white">
          {data.cta || "Request Activation"}
        </button>

        {(data.faq || []).length > 0 ? (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold">FAQ</h2>
            <div className="mt-6 space-y-4">
              {(data.faq || []).map((item) => (
                <div key={item.question} className="rounded-xl border p-4">
                  <div className="font-medium">{item.question}</div>
                  <div className="mt-2 text-zinc-700">{item.answer}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
