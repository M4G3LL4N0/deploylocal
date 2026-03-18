import { requireAdmin } from "@/lib/auth";

export default async function AdminSitesPage() {
  const { supabase } = await requireAdmin();

  const { data: sites } = await supabase
    .from("generated_sites")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          Admin Sites
        </div>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight">
          Generated websites
        </h1>

        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="border-b border-white/10 bg-black/30 text-zinc-400">
                <tr>
                  <th className="px-4 py-4 font-medium">Business</th>
                  <th className="px-4 py-4 font-medium">City</th>
                  <th className="px-4 py-4 font-medium">Category</th>
                  <th className="px-4 py-4 font-medium">Subdomain</th>
                  <th className="px-4 py-4 font-medium">Type</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {!sites || sites.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-zinc-500"
                    >
                      No generated sites yet.
                    </td>
                  </tr>
                ) : (
                  sites.map((site) => (
                    <tr
                      key={site.id}
                      className="border-b border-white/5 last:border-b-0"
                    >
                      <td className="px-4 py-4 font-medium">{site.business_name}</td>
                      <td className="px-4 py-4 text-zinc-300">{site.city || "—"}</td>
                      <td className="px-4 py-4 text-zinc-300">{site.category || "—"}</td>
                      <td className="px-4 py-4 text-zinc-300">
                        {site.subdomain}.deploylocal.app
                      </td>
                      <td className="px-4 py-4 text-zinc-300">{site.site_type}</td>
                      <td className="px-4 py-4 text-zinc-300">{site.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
