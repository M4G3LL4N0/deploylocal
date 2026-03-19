import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const token = typeof body.token === "string" ? body.token : "";

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const { data: invite, error: inviteError } = await supabase
      .from("client_site_invites")
      .select("*")
      .eq("token", token)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json({ error: "Invalid invite" }, { status: 404 });
    }

    if (invite.claimed) {
      return NextResponse.json({ error: "Invite already claimed" }, { status: 400 });
    }

    const { data: authUser } = await supabase.auth.getUser();
    const email = authUser.user?.email?.toLowerCase() || "";

    if (!email || email !== invite.email) {
      return NextResponse.json(
        { error: "Signed-in email does not match invite email" },
        { status: 403 }
      );
    }

    const { error: siteError } = await supabase
      .from("generated_sites")
      .update({
        client_user_id: user.id,
        status: "active", // Transition to active mode
      })
      .eq("id", invite.generated_site_id);

    if (siteError) {
      return NextResponse.json({ error: siteError.message }, { status: 500 });
    }

    const { error: inviteUpdateError } = await supabase
      .from("client_site_invites")
      .update({
        claimed: true,
      })
      .eq("id", invite.id);

    if (inviteUpdateError) {
      return NextResponse.json({ error: inviteUpdateError.message }, { status: 500 });
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role: "client" })
      .eq("id", user.id);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      siteId: invite.generated_site_id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to claim site";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
