import { requireClient } from "@/lib/auth";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ClientSitesPage() {
  const user = await requireClient();
  const supabase = await createClient();

  const { data: sites, error } = await supabase
    .from("generated_sites")
    .select("*")
    .eq("client_user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <h1 className="text-3xl font-bold mb-6">My Sites</h1>
        {(!sites || sites.length === 0) && (
          <div className="text-zinc-400 mb-8">No sites yet.</div>
        )}
        <div className="grid gap-6">
          {sites &&
            sites.map((site: any) => (
              <div
                key={site.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="text-lg font-semibold">{site.business_name}</div>
                  <div className="text-zinc-400 text-sm mb-2">
                    {site.subdomain}.deploylocal.app
                  </div>
                  <div className="text-xs text-zinc-500">
                    Status: {site.status}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex gap-3">
                  <Link
                    href={`/client/sites/${site.id}`}
                    className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black"
                  >
                    View Site
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
