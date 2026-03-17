import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Dashboard
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Welcome to DeployLocal
            </h1>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Search businesses, score leads, generate websites, and build your
              outreach queue.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/app/leads"
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
            >
              View Leads
            </Link>
            <Link
              href="/app/generate"
              className="rounded-full border border-white/15 px-5 py-3 text-sm text-white"
            >
              Generate Site
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Signed in as</div>
            <div className="mt-2 text-lg font-semibold">{user.email}</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Lead Engine</div>
            <div className="mt-2 text-lg font-semibold">Ready</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Site Generator</div>
            <div className="mt-2 text-lg font-semibold">Ready</div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Next Steps</h2>
            <ul className="mt-4 space-y-3 text-zinc-400">
              <li>• Search local businesses by city and category</li>
              <li>• Score the strongest website opportunities</li>
              <li>• Generate a site preview in one click</li>
              <li>• Build your daily outreach queue</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Quick Actions</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/app/leads"
                className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
              >
                Open Leads
              </Link>
              <Link
                href="/app/queue"
                className="rounded-full border border-white/15 px-5 py-3 text-sm text-white"
              >
                Open Queue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
