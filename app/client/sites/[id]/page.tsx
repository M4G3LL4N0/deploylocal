import { requireClient } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type Site = {
  id: string;
  business_name: string;
  subdomain: string;
  status: string;
  site_json: any;
};

export default async function ClientSiteDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireClient();
  const supabase = await createClient();

  const { data: site, error } = await supabase
    .from("generated_sites")
    .select("*")
    .eq("id", params.id)
    .eq("client_user_id", user.id)
    .single();

  if (!site) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-zinc-400">Site not found.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="text-3xl font-bold mb-4">{site.business_name}</h1>
        <div className="mb-2 text-zinc-400">
          Subdomain: <span className="font-mono">{site.subdomain}.deploylocal.app</span>
        </div>
        <div className="mb-2 text-zinc-400">Status: {site.status}</div>
        <div className="mb-6">
          <pre className="bg-black/40 rounded p-2 text-xs text-zinc-300 overflow-x-auto">
            {JSON.stringify(site.site_json, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
