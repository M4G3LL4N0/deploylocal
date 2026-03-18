import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col gap-16 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 mb-2">
              DeployLocal
            </div>
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
              The dual engine for local business growth.
            </h1>
            <p className="mt-6 text-lg text-zinc-400">
              <span className="font-semibold text-white">DeployLocal</span> is a two-sided SaaS platform:
              <br />
              <span className="font-semibold text-white">1. Admins</span> find, score, and generate sites for local businesses—then manage outreach and sales.
              <br />
              <span className="font-semibold text-white">2. Clients</span> get a portal to manage their new site, upgrade, and access exclusive tools.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/builder"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black"
              >
                Try the Builder
              </Link>
              <Link
                href="/app"
                className="rounded-full border border-white/20 px-6 py-3 text-sm text-white"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">What DeployLocal Does</div>
            <div className="mt-6 flex flex-col gap-4 text-sm text-zinc-300">
              <div>• Scrapes & scores local businesses</div>
              <div>• Detects missing/weak websites</div>
              <div>• Instantly generates high-converting sites</div>
              <div>• Admin dashboard for outreach & sales</div>
              <div>• Client portal for site management</div>
            </div>
          </div>
        </div>
        <div className="mt-24 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Step 1</div>
            <div className="mt-2 text-xl font-semibold">
              Find & Score Businesses
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              Search any city + category and get ranked leads instantly.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Step 2</div>
            <div className="mt-2 text-xl font-semibold">
              Generate & Preview Sites
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              One click creates a live, high-converting site you can show or sell.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Step 3</div>
            <div className="mt-2 text-xl font-semibold">
              Sell & Onboard Clients
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              Close deals, then invite clients to their own portal for upgrades and management.
            </p>
          </div>
        </div>
        <div className="mt-24 flex flex-col items-center text-center">
          <h2 className="text-3xl font-semibold">
            DeployLocal is not just a website builder.
          </h2>
          <p className="mt-4 max-w-xl text-zinc-400">
            It’s a full distribution engine for local business growth—combining lead generation, instant site creation, and client onboarding.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/builder"
              className="rounded-full bg-white px-8 py-4 text-sm font-medium text-black"
            >
              Try the Builder
            </Link>
            <Link
              href="/app"
              className="rounded-full border border-white/20 px-8 py-4 text-sm text-white"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
