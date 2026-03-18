import Link from "next/link";
import { requireClient } from "@/lib/auth";

export default async function ClientDashboardPage() {
  const { user } = await requireClient();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Client Portal
            </div>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight">
              Review your website previews
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-zinc-400">
              Log in to view your DeployLocal-generated website previews, review
              site status, and prepare for activation.
            </p>
            <p className="mt-3 text-sm text-zinc-500">{user.email}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/client/sites"
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
            >
              My Sites
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
