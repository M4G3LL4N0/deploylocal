import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Profile = {
  id: string;
  email: string | null;
  role: "admin" | "client";
};

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, profile: null as Profile | null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("id", user.id)
    .single();

  return {
    supabase,
    user,
    profile: (profile as Profile | null) ?? null,
  };
}

export async function requireAdmin() {
  const { supabase, user, profile } = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  return { supabase, user, profile };
}

export async function requireClient() {
  const { supabase, user, profile } = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!profile || profile.role !== "client") {
    redirect("/");
  }

  return { supabase, user, profile };
}
