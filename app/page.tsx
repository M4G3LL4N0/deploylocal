import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              DeployLocal
            </div>

            <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">
              Launch websites fast. Find leads faster.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              DeployLocal gives businesses a fast AI website builder — and gives
              the owner/admin a private lead engine to discover, score, and
              generate websites for local businesses before outreach.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/builder"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black"
              >
                Build Your Website
              </Link>

              <Link
                href="/app"
                className="rounded-full border border-white/15 px-6 py-3 text-sm text-white"
              >
                Admin Dashboard
              </Link>
            </div>

            <div className="mt-10 grid gap-4 text-sm text-zinc-400 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Public website builder
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Private lead engine
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="text-sm font-medium">DeployLocal has two engines</div>

            <div className="mt-8 grid gap-6">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="text-sm uppercase tracking-[0.15em] text-zinc-500">
                  For businesses
                </div>
                <h2 className="mt-3 text-2xl font-semibold">
                  Build a website quickly
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                  <li>• Generate a website in minutes</li>
                  <li>• Preview it on a DeployLocal subdomain</li>
                  <li>• Log in to review and activate it</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="text-sm uppercase tracking-[0.15em] text-zinc-500">
                  For the owner/admin
                </div>
                <h2 className="mt-3 text-2xl font-semibold">
                  Find, score, and generate before outreach
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                  <li>• Find local businesses with missing or weak websites</li>
                  <li>• Score the best opportunities first</li>
                  <li>• Generate websites instantly from a private dashboard</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm text-zinc-400">Public product</div>
              <h3 className="mt-3 text-2xl font-semibold">Website builder</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                A self-serve builder for businesses who visit DeployLocal and want
                a fast site creation flow.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm text-zinc-400">Private system</div>
              <h3 className="mt-3 text-2xl font-semibold">Lead intelligence</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                A private admin dashboard that searches local businesses, detects
                website gaps, and ranks which leads should be targeted now.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm text-zinc-400">Client portal</div>
              <h3 className="mt-3 text-2xl font-semibold">Secure previews</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Prospects and customers log in to preview their site under a
                controlled DeployLocal workflow before activation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
