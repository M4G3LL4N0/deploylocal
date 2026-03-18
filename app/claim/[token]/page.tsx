"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClaimSitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleClaim() {
    const { token } = await params;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/claim-site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Claim failed");
      }

      router.push(`/client/sites/${data.siteId}`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Claim failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          Claim Site
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Claim your website preview
        </h1>
        <p className="mt-4 text-zinc-400">
          Sign in with the invited email address, then claim access to your DeployLocal site.
        </p>

        <button
          onClick={handleClaim}
          disabled={loading}
          className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-medium text-black disabled:opacity-60"
        >
          {loading ? "Claiming..." : "Claim My Site"}
        </button>

        {message ? (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {message}
          </div>
        ) : null}
      </div>
    </main>
  );
}
