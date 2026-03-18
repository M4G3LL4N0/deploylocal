import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function createPreviewToken() {
  return crypto.randomUUID().replace(/-/g, "");
}

export async function POST(req: Request) {
  try {
    const { businessName, category, city, leadId } = await req.json();

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const genRes = await fetch(`${appUrl}/api/generate-site`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ businessName, category, city }),
    });

    const genData = await genRes.json();

    if (!genRes.ok) {
      return NextResponse.json(
        { error: genData.error || "Generation failed" },
        { status: 500 }
      );
    }

    const { site, subdomain } = genData;

    const { data, error } = await supabase
      .from("generated_sites")
      .insert({
        owner_user_id: user.id,
        business_name: businessName,
        category,
        city,
        subdomain,
        site_json: site,
        site_type: "admin_generated",
        status: "preview",
        preview_token: createPreviewToken(),
        lead_id: leadId || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      site: data,
      previewUrl: `${appUrl}/sites/${data.subdomain}?token=${data.preview_token}`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
