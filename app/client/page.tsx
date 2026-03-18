import { requireClient } from "@/lib/auth";
import Link from "next/link";

export default async function ClientDashboard() {
  const user = await requireClient();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Client Portal</h1>
          <p className="mt-2 text-zinc-400">
            Welcome, {user.email}! Manage your sites and account below.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-lg font-semibold mb-2">My Sites</div>
            <p className="mb-4 text-zinc-400">View and manage your deployed sites.</p>
            <Link
              href="/client/sites"
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black"
            >
              Go to My Sites
            </Link>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-lg font-semibold mb-2">Settings</div>
            <p className="mb-4 text-zinc-400">Update your account and preferences.</p>
            <Link
              href="/client/settings"
              className="rounded-full border border-white/15 px-5 py-2 text-sm text-white"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
