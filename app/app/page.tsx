import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const { user } = await requireAdmin();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Admin Dashboard
            </div>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight">
              Private lead and website engine
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-zinc-400">
              This area is only for the owner/admin. Find leads, score businesses,
              generate websites, and manage outreach from one private system.
            </p>
            <p className="mt-3 text-sm text-zinc-500">{user.email}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/app/leads"
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
            >
              Leads
            </Link>
            <Link
              href="/app/sites"
              className="rounded-full border border-white/15 px-5 py-3 text-sm text-white"
            >
              Sites
            </Link>
            <Link
              href="/app/queue"
              className="rounded-full border border-white/15 px-5 py-3 text-sm text-white"
            >
              Queue
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
