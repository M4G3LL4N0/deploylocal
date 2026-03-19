import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

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
    const supabaseAdmin = createAdminClient();

    // Get queued leads (limit to prevent overwhelming the system)
    const { data: queuedLeads, error: queueError } = await supabaseAdmin
      .from('lead_queue')
      .select('*')
      .eq('status', 'queued')
      .order('created_at', { ascending: true })
      .limit(20); // Process up to 20 at a time

    if (queueError) {
      return NextResponse.json({ error: queueError.message }, { status: 500 });
    }

    if (!queuedLeads || queuedLeads.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No leads in queue',
        processed: 0,
        failed: 0
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const processed: Array<{ leadId: string; siteId: string; previewUrl: string }> = [];
    const failed: Array<{ leadId: string; reason: string }> = [];

    // Process each queued lead
    for (const queueEntry of queuedLeads) {
      try {
        // Get lead details
        const { data: lead, error: leadError } = await supabaseAdmin
          .from('leads')
          .select('*')
          .eq('id', queueEntry.lead_id)
          .single();

        if (leadError || !lead) {
          failed.push({
            leadId: queueEntry.lead_id,
            reason: leadError?.message || 'Lead not found'
          });
          continue;
        }

        // Generate site
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
            leadId: queueEntry.lead_id,
            reason: genData.error || "Generation failed",
          });
          continue;
        }

        const previewToken = createPreviewToken();

        // Create generated site
        const { data: site, error: siteError } = await supabaseAdmin
          .from("generated_sites")
          .insert({
            owner_user_id: lead.user_id,
            business_name: lead.business_name,
            category: lead.category,
            city: lead.city,
            subdomain: genData.subdomain,
            site_json: genData.site,
            site_type: "auto_generated",
            status: "preview",
            preview_token: previewToken,
            lead_id: lead.id,
          })
          .select()
          .single();

        if (siteError || !site) {
          failed.push({
            leadId: queueEntry.lead_id,
            reason: siteError?.message || "Site creation failed",
          });
          continue;
        }

        // Update lead with generated site ID
        await supabaseAdmin
          .from("leads")
          .update({
            generated_site_id: site.id,
            outreach_status: "queued",
          })
          .eq("id", lead.id);

        // Update queue entry
        await supabaseAdmin
          .from('lead_queue')
          .update({
            status: 'completed',
            processed_at: new Date().toISOString(),
            site_id: site.id
          })
          .eq('id', queueEntry.id);

        processed.push({
          leadId: lead.id,
          siteId: site.id,
          previewUrl: `${appUrl}/sites/${site.subdomain}?token=${site.preview_token}`,
        });

      } catch (error) {
        // Update queue entry with error
        await supabaseAdmin
          .from('lead_queue')
          .update({
            status: 'failed',
            processed_at: new Date().toISOString(),
            error_message: error instanceof Error ? error.message : 'Unknown error'
          })
          .eq('id', queueEntry.id);

        failed.push({
          leadId: queueEntry.lead_id,
          reason: error instanceof Error ? error.message : "Unknown failure",
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: processed.length,
      failed: failed.length,
      processedLeads: processed,
      failedLeads: failed
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Queue processing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
