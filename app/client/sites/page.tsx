import Link from "next/link";
import { requireClient } from "@/lib/auth";

export default async function ClientSitesPage() {
  const { supabase, user } = await requireClient();

  const { data: sites } = await supabase
    .from("generated_sites")
    .select("*")
    .eq("client_user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          Client Sites
        </div>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight">
          Your website previews
        </h1>

        <div className="mt-10 grid gap-4">
          {!sites || sites.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-zinc-500">
              No sites assigned yet.
            </div>
          ) : (
            sites.map((site) => (
              <Link
                key={site.id}
                href={`/client/sites/${site.id}`}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-2xl font-semibold">{site.business_name}</div>
                    <div className="mt-2 text-sm text-zinc-400">
                      {site.subdomain}.deploylocal.app · {site.status}
                    </div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm">
                    View Site
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
