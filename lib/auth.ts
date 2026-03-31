import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ApiResponse } from "@/types";

type Profile = {
  id: string;
  email: string | null;
  role: "admin" | "client";
  created_at: string;
};

export async function getCurrentUser(): Promise<{
  supabase: ReturnType<typeof createClient>;
  user: { id: string; email?: string | null } | null;
  profile: Profile | null;
}> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user || error) {
      return { supabase, user: null, profile: null };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, role, created_at")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError.message);
      return { supabase, user, profile: null };
    }

    return { supabase, user, profile };
  } catch (error) {
    console.error("Auth fetch error:", error);
    throw new Error("Failed to fetch current user");
  }
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
