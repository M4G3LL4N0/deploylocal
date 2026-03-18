import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              DeployLocal
            </div>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-6xl">
              We already built your website.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-zinc-400">
              DeployLocal finds local businesses without websites, builds one instantly,
              and helps you turn it into revenue. Generate sites, capture leads, and scale outreach —
              all in one system.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/app"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black"
              >
                Enter App
              </Link>

              <Link
                href="/app/leads"
                className="rounded-full border border-white/20 px-6 py-3 text-sm text-white"
              >
                Find Leads
              </Link>
            </div>
          </div>

          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">What this does</div>

            <div className="mt-6 flex flex-col gap-4 text-sm text-zinc-300">
              <div>• Scrapes local businesses</div>
              <div>• Detects missing / weak websites</div>
              <div>• Scores best opportunities</div>
              <div>• Generates websites instantly</div>
              <div>• Lets you sell before building anything</div>
            </div>
          </div>
        </div>

        <div className="mt-24 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Step 1</div>
            <div className="mt-2 text-xl font-semibold">
              Find high-value businesses
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              Search any city + category and get ranked leads instantly.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Step 2</div>
            <div className="mt-2 text-xl font-semibold">
              Generate their website
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              One click creates a live, high-converting site you can show them.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Step 3</div>
            <div className="mt-2 text-xl font-semibold">
              Close & monetize
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              Call, text, or email — and convert them into recurring revenue.
            </p>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center text-center">
          <h2 className="text-3xl font-semibold">
            This is not a website builder.
          </h2>
          <p className="mt-4 max-w-xl text-zinc-400">
            This is a distribution engine for local businesses.
          </p>

          <Link
            href="/app"
            className="mt-8 rounded-full bg-white px-8 py-4 text-sm font-medium text-black"
          >
            Launch Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
