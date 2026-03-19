import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Pricing
          </div>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">
            Simple pricing for fast website launches
          </h1>
          <p className="mt-4 text-lg text-zinc-300">
            Start with a preview, review your site inside DeployLocal, and
            activate when you are ready.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="text-sm text-zinc-400">Starter</div>
            <div className="mt-4 text-4xl font-semibold">$49</div>
            <div className="mt-2 text-sm text-zinc-500">one-time setup</div>
            <ul className="mt-6 space-y-3 text-sm text-zinc-300">
              <li>• AI-generated site preview</li>
              <li>• DeployLocal subdomain</li>
              <li>• Client portal access</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="text-sm text-zinc-400">Growth</div>
            <div className="mt-4 text-4xl font-semibold">$99/mo</div>
            <div className="mt-2 text-sm text-zinc-500">managed website plan</div>
            <ul className="mt-6 space-y-3 text-sm text-zinc-300">
              <li>• Live website activation</li>
              <li>• Ongoing updates</li>
              <li>• Hosted under DeployLocal</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="text-sm text-zinc-400">Custom</div>
            <div className="mt-4 text-4xl font-semibold">Contact</div>
            <div className="mt-2 text-sm text-zinc-500">for advanced needs</div>
            <ul className="mt-6 space-y-3 text-sm text-zinc-300">
              <li>• Multi-location businesses</li>
              <li>• Custom domains</li>
              <li>• White-glove setup</li>
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/builder"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black"
          >
            Start Building
          </Link>
        </div>
      </div>
    </main>
  );
}
