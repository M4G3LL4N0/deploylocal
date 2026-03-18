import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="text-4xl font-bold mb-6">Pricing</h1>
        <p className="mb-8 text-zinc-400">
          DeployLocal offers flexible pricing for both admins and clients.
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-lg font-semibold mb-2">Admin Platform</div>
            <div className="mb-2 text-zinc-300">Lead engine, outreach, site generator</div>
            <div className="mb-4 text-3xl font-bold">$99/mo</div>
            <ul className="mb-4 text-zinc-400 text-sm space-y-1">
              <li>• Unlimited lead searches</li>
              <li>• Unlimited site previews</li>
              <li>• Outreach queue & CRM</li>
              <li>• Client onboarding tools</li>
            </ul>
            <Link
              href="/signup"
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black"
            >
              Start Free Trial
            </Link>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-lg font-semibold mb-2">Client Portal</div>
            <div className="mb-2 text-zinc-300">Site management, upgrades, analytics</div>
            <div className="mb-4 text-3xl font-bold">$29/mo</div>
            <ul className="mb-4 text-zinc-400 text-sm space-y-1">
              <li>• Manage your live site</li>
              <li>• Upgrade features</li>
              <li>• Access analytics</li>
              <li>• Priority support</li>
            </ul>
            <Link
              href="/signup"
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
