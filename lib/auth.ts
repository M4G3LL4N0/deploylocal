import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ApiResponse } from "@/types";

/**
 * Represents a user profile in the system
 */
export type Profile = {
  id: string;
  email: string | null;
  role: "admin" | "client";
  created_at: string;
};

/**
 * Represents the current authenticated user
 */
export type CurrentUser = {
  supabase: ReturnType<typeof createClient>;
  user: { id: string; email?: string | null } | null;
  profile: Profile | null;
};

/**
 * Gets the currently authenticated user with their profile
 * @returns Promise<CurrentUser>
 * @throws Error if authentication fails
 */
export async function getCurrentUser(): Promise<CurrentUser> {
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

/**
 * Checks if the current user has admin role
 * @returns Promise<CurrentUser>
 * @throws Redirects to login if not authenticated
 * @throws Redirects to home if not admin
 */
export async function requireAdmin(): Promise<CurrentUser> {
  const { supabase, user, profile } = await getCurrentUser();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin") redirect("/");

  return { supabase, user, profile };
}

/**
 * Checks if the current user has client role
 * @returns Promise<CurrentUser>
 * @throws Redirects to login if not authenticated
 * @throws Redirects to home if not client
 */
export async function requireClient(): Promise<CurrentUser> {
  const { supabase, user, profile } = await getCurrentUser();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "client") redirect("/");

  return { supabase, user, profile };
}

/**
 * Utility to check if user is authenticated
 * @returns Promise<boolean>
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const { user } = await getCurrentUser();
    return !!user;
  } catch {
    return false;
  }
}

/**
 * Utility to check if user has admin role
 * @returns Promise<boolean>
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const { profile } = await requireAdmin();
    return !!profile;
  } catch {
    return false;
  }
}

/**
 * Utility to check if user has client role
 * @returns Promise<boolean>
 */
export async function isClient(): Promise<boolean> {
  try {
    const { profile } = await requireClient();
    return !!profile;
  } catch {
    return false;
  }
}
