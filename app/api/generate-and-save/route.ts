import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type GenerateAndSaveBody = {
  businessName?: string;
  category?: string;
  city?: string;
  leadId?: string | null;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

function uniqueSubdomain(base: string) {
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateAndSaveBody;
    const businessName = body.businessName?.trim();
    const category = body.category?.trim();
    const city = body.city?.trim();
    const leadId = body.leadId ?? null;

    if (!businessName || !category || !city) {
      return NextResponse.json(
        { error: "Missing businessName, category, or city" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const genRes = await fetch(`${appUrl}/api/generate-site`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ businessName, category, city }),
      cache: "no-store",
    });

    const genData = await genRes.json();

    if (!genRes.ok) {
      return NextResponse.json(
        { error: genData.error || "Generation failed" },
        { status: 500 }
      );
    }

    const site = genData.site;
    const suggestedSubdomain =
      typeof genData.subdomain === "string" && genData.subdomain.length > 0
        ? genData.subdomain
        : slugify(businessName);

    const subdomain = uniqueSubdomain(suggestedSubdomain);

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
        lead_id: leadId,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      site: data,
      previewPath: `/sites/${subdomain}`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate and save site";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
