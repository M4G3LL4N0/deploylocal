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
    const siteId = typeof body.siteId === "string" ? body.siteId : "";

    if (!siteId) {
      return NextResponse.json({ error: "Missing siteId" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.json({
      success: true,
      checkoutUrl: `${appUrl}/client/sites/${siteId}?upgrade=true`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Checkout creation failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
