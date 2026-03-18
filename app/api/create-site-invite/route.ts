import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

function generateToken() {
  return crypto.randomUUID().replace(/-/g, "");
}

export async function POST(req: Request) {
  try {
    const { supabase } = await requireAdmin();
    const body = await req.json();

    const siteId = typeof body.siteId === "string" ? body.siteId : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!siteId || !email) {
      return NextResponse.json(
        { error: "siteId and email are required" },
        { status: 400 }
      );
    }

    const { data: site, error: siteError } = await supabase
      .from("generated_sites")
      .select("*")
      .eq("id", siteId)
      .single();

    if (siteError || !site) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }

    const token = generateToken();

    const { data: invite, error: inviteError } = await supabase
      .from("client_site_invites")
      .insert({
        generated_site_id: siteId,
        email,
        token,
        claimed: false,
      })
      .select()
      .single();

    if (inviteError) {
      return NextResponse.json(
        { error: inviteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      invite,
      claimUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/claim/${token}`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create invite";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
