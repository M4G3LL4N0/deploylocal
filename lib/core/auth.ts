import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UserRole } from "./types";

export interface CurrentUser {
  supabase: ReturnType<typeof createClient>;
  user: { id: string; email?: string | null } | null;
  profile: Profile | null;
}

interface Profile {
  id: string;
  email: string | null;
  role: UserRole;
  created_at: string;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user || error) {
    return { supabase, user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, role, created_at")
    .eq("id", user.id)
    .single();

  return { supabase, user, profile };
}

export async function requireRole(role: UserRole): Promise<CurrentUser> {
  const { supabase, user, profile } = await getCurrentUser();

  if (!user) redirect("/login");
  if (!profile || profile.role !== role) redirect("/");

  return { supabase, user, profile };
}

// Convenience wrappers
export const requireAdmin = () => requireRole("admin");
export const requireClient = () => requireRole("client");
export const requireReseller = () => requireRole("reseller");
