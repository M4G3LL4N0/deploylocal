"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type GeneratedSite = {
  id: string;
  business_name: string;
  city: string | null;
  category: string | null;
  subdomain: string;
  site_type: "admin_generated" | "self_serve";
  status: "preview" | "active";
  preview_token: string | null;
  created_at: string;
};

export default function AdminSitesPage() {
  const supabase = createClient();
  const [sites, setSites] = useState<GeneratedSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    async function loadSites() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("generated_sites")
        .select("*")
        .eq("owner_user_id", user.id)
        .order("created_at", { ascending: false });

      setSites((data as GeneratedSite[]) || []);
      setLoading(false);
    }

    loadSites();
  }, [supabase]);

  async function handleCreateInvite(siteId: string) {
    const email = inviteEmail[siteId]?.trim().toLowerCase() || "";

    if (!email) {
      setMessages((prev) => ({
        ...prev,
        [siteId]: "Enter an email address first.",
      }));
      return;
    }

    setBusyId(siteId);
    setMessages((prev) => ({ ...prev, [siteId]: "" }));

    try {
      const res = await fetch("/api/create-site-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteId,
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invite failed");
      }

      setMessages((prev) => ({
        ...prev,
        [siteId]: `Invite created: ${data.claimUrl}`,
      }));
    } catch (error) {
      setMessages((prev) => ({
        ...prev,
        [siteId]:
          error instanceof Error ? error.message : "Invite failed",
      }));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          Admin Sites
        </div>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight">
          Generated websites
        </h1>

        {loading ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-zinc-500">
            Loading sites...
          </div>
        ) : (
          <div className="mt-10 grid gap-6">
            {sites.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-zinc-500">
                No generated sites yet.
              </div>
            ) : (
              sites.map((site) => {
                const previewUrl = `https://${site.subdomain}.deploylocal.app${
                  site.preview_token ? `?token=${site.preview_token}` : ""
                }`;

                return (
                  <div
                    key={site.id}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="text-2xl font-semibold">
                          {site.business_name}
                        </div>
                        <div className="mt-2 text-sm text-zinc-400">
                          {site.city || "—"} · {site.category || "—"} ·{" "}
                          {site.subdomain}.deploylocal.app
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs">
                            {site.site_type}
                          </span>
                          <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs">
                            {site.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={previewUrl}
                          target="_blank"
                          className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
                        >
                          Preview
                        </Link>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
                      <input
                        className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                        placeholder="Client email to invite"
                        value={inviteEmail[site.id] || ""}
                        onChange={(e) =>
                          setInviteEmail((prev) => ({
                            ...prev,
                            [site.id]: e.target.value,
                          }))
                        }
                      />

                      <button
                        type="button"
                        onClick={() => handleCreateInvite(site.id)}
                        disabled={busyId === site.id}
                        className="rounded-full border border-white/15 px-5 py-3 text-sm text-white disabled:opacity-60"
                      >
                        {busyId === site.id ? "Creating Invite..." : "Create Invite"}
                      </button>
                    </div>

                    {messages[site.id] ? (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300">
                        {messages[site.id]}
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </main>
  );
}
