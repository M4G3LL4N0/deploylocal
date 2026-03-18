import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export default async function QueuePage() {
  const { supabase, user } = await requireAdmin();

  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", user.id)
    .order("score", { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Outreach Queue
            </div>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight">
              Highest-priority businesses to contact today
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-zinc-400">
              DeployLocal ranks businesses by website gap, quality signals, and
              outreach value so you know exactly who to call first.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/app/leads"
              className="rounded-full border border-white/15 px-5 py-3 text-sm text-white"
            >
              View Leads
            </Link>
            <Link
              href="/app/sites"
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
            >
              View Sites
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Queued Leads</div>
            <div className="mt-2 text-3xl font-semibold">{leads?.length ?? 0}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Top Priority</div>
            <div className="mt-2 text-3xl font-semibold">
              {leads?.[0]?.score ?? 0}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Missing Websites</div>
            <div className="mt-2 text-3xl font-semibold">
              {(leads || []).filter((lead) => !lead.has_website).length}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Suggested Action</div>
            <div className="mt-2 text-lg font-semibold">Call highest scores first</div>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="border-b border-white/10 bg-black/30 text-zinc-400">
                <tr>
                  <th className="px-4 py-4 font-medium">Priority</th>
                  <th className="px-4 py-4 font-medium">Business</th>
                  <th className="px-4 py-4 font-medium">Phone</th>
                  <th className="px-4 py-4 font-medium">Category</th>
                  <th className="px-4 py-4 font-medium">City</th>
                  <th className="px-4 py-4 font-medium">Website</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {!leads || leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-10 text-center text-zinc-500"
                    >
                      No prioritized leads yet. Search businesses first.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead, index) => (
                    <tr
                      key={lead.id}
                      className="border-b border-white/5 last:border-b-0"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-500">{index + 1}</span>
                          <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white">
                            {lead.score ?? 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-white">
                          {lead.business_name}
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">
                          {lead.address || "No address"}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-zinc-300">
                        {lead.phone || "—"}
                      </td>
                      <td className="px-4 py-4 text-zinc-300">
                        {lead.category || "—"}
                      </td>
                      <td className="px-4 py-4 text-zinc-300">
                        {lead.city || "—"}
                      </td>
                      <td className="px-4 py-4">
                        {lead.has_website ? (
                          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                            Has website
                          </span>
                        ) : (
                          <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
                            Missing website
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-zinc-300">
                        {lead.outreach_status || "new"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/app/leads/${lead.id}`}
                            className="rounded-full border border-white/15 px-3 py-2 text-xs text-white"
                          >
                            View Lead
                          </Link>
                          {lead.generated_site_id ? (
                            <Link
                              href={`/app/sites/${lead.generated_site_id}`}
                              className="rounded-full bg-white px-3 py-2 text-xs font-medium text-black"
                            >
                              View Site
                            </Link>
                          ) : null}
                        </div>
                      </td>
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
