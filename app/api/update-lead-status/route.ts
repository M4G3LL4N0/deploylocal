import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

const allowedStatuses = ["new", "queued", "contacted", "interested", "closed", "dead"];

export async function POST(req: Request) {
  try {
    const { supabase, user } = await requireAdmin();
    const body = await req.json();

    const leadId = typeof body.leadId === "string" ? body.leadId : "";
    const outreachStatus =
      typeof body.outreachStatus === "string" ? body.outreachStatus : "";

    if (!leadId || !allowedStatuses.includes(outreachStatus)) {
      return NextResponse.json(
        { error: "Invalid leadId or outreachStatus" },
        { status: 400 }
      );
    }

    const updates: Record<string, string | null> = {
      outreach_status: outreachStatus,
    };

    if (outreachStatus === "contacted") {
      updates.last_contacted_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", leadId)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, lead: data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update lead";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
