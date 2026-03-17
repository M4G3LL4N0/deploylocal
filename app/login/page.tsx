"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/app");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          Log in
        </div>
        <h1 className="mt-4 text-4xl font-semibold">Welcome back</h1>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <input
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
          <input
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-black"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {message ? (
          <p className="mt-4 text-sm text-zinc-400">{message}</p>
        ) : null}
      </div>
    </main>
  );
}
