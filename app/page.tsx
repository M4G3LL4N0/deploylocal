import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-black text-white">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Dual-Powered Website Engine
            </div>

            <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">
              Websites Built Fast.
              <br />
              Leads Found Faster.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              DeployLocal combines a public AI website builder for businesses with a private lead engine for admins - delivering websites and opportunities at unmatched speed.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/builder"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90 transition-colors"
              >
                Build Your Website →
              </Link>
              <Link
                href="/app"
                className="rounded-full border border-white/15 px-6 py-3 text-sm text-white hover:bg-white/5 transition-colors"
              >
                Access Lead Engine →
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="grid gap-6">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
                <div className="text-sm uppercase tracking-[0.15em] text-zinc-500">
                  For Businesses
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  Instant Website Creation
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                  <li>• AI-generated websites in minutes</li>
                  <li>• Industry-specific templates</li>
                  <li>• Preview & activate workflow</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
                <div className="text-sm uppercase tracking-[0.15em] text-zinc-500">
                  For Admins
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  Lead Intelligence Engine
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                  <li>• Find website gaps in your market</li>
                  <li>• Score & prioritize opportunities</li>
                  <li>• Generate sites before outreach</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              The DeployLocal Process
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Simple. Fast. Effective.
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm text-zinc-400">Step 1</div>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Input & Generate
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Businesses provide basic details or admins discover leads - DeployLocal generates a complete website instantly.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm text-zinc-400">Step 2</div>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Preview & Refine
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Review the AI-generated site, make any adjustments, and preview it on a secure subdomain.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm text-zinc-400">Step 3</div>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Activate & Grow
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Launch the website and start attracting customers - or use it as a powerful outreach tool.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why DeployLocal Section */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Why Choose DeployLocal
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Built for Speed & Results
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm text-zinc-400">Speed</div>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Websites in Minutes
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Generate complete websites faster than traditional development.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm text-zinc-400">Intelligence</div>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Lead Scoring Engine
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Identify and prioritize the best opportunities automatically.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm text-zinc-400">Control</div>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Complete Workflow
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Manage everything from generation to activation in one platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to Transform Your Website Workflow?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-zinc-300">
              Whether you're a business looking for a fast website or an admin seeking better leads, DeployLocal has you covered.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/builder"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90 transition-colors"
              >
                Start Building →
              </Link>
              <Link
                href="/app"
                className="rounded-full border border-white/15 px-6 py-3 text-sm text-white hover:bg-white/5 transition-colors"
              >
                Explore Leads →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
