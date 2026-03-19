import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

function createPreviewToken() {
  return crypto.randomUUID().replace(/-/g, "");
}

type GenerateSiteResponse = {
  site: Record<string, unknown>;
  subdomain: string;
  error?: string;
};

export async function POST(req: Request) {
  try {
    const { supabase, user } = await requireAdmin();
    const body = await req.json();

    const leadIds = Array.isArray(body.leadIds)
      ? body.leadIds.filter((id: unknown): id is string => typeof id === "string")
      : [];

    if (leadIds.length === 0) {
      return NextResponse.json(
        { error: "No leadIds provided" },
        { status: 400 }
      );
    }

    const { data: leads, error: leadsError } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", user.id)
      .in("id", leadIds);

    if (leadsError) {
      return NextResponse.json({ error: leadsError.message }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const created: Array<{ leadId: string; siteId: string; previewUrl: string }> = [];
    const failed: Array<{ leadId: string; reason: string }> = [];

    for (const lead of leads || []) {
      try {
        const genRes = await fetch(`${appUrl}/api/generate-site`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            businessName: lead.business_name,
            category: lead.category || "local business",
            city: lead.city || "local market",
          }),
        });

        const genData = (await genRes.json()) as GenerateSiteResponse;

        if (!genRes.ok || !genData.site || !genData.subdomain) {
          failed.push({
            leadId: lead.id,
            reason: genData.error || "Generation failed",
          });
          continue;
        }

        const previewToken = createPreviewToken();

        const { data: site, error: siteError } = await supabase
          .from("generated_sites")
          .insert({
            owner_user_id: user.id,
            business_name: lead.business_name,
            category: lead.category,
            city: lead.city,
            subdomain: genData.subdomain,
            site_json: genData.site,
            site_type: "admin_generated",
            status: "preview",
            preview_token: previewToken,
            lead_id: lead.id,
          })
          .select()
          .single();

        if (siteError || !site) {
          failed.push({
            leadId: lead.id,
            reason: siteError?.message || "Insert failed",
          });
          continue;
        }

        await supabase
          .from("leads")
          .update({
            generated_site_id: site.id,
            outreach_status: "queued",
          })
          .eq("id", lead.id)
          .eq("user_id", user.id);

        created.push({
          leadId: lead.id,
          siteId: site.id,
          previewUrl: `${appUrl}/sites/${site.subdomain}?token=${site.preview_token}`,
        });
      } catch (error) {
        failed.push({
          leadId: lead.id,
          reason: error instanceof Error ? error.message : "Unknown failure",
        });
      }
    }

    return NextResponse.json({
      success: true,
      created,
      failed,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Bulk generation failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
