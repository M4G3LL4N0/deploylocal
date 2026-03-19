import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { scoreLead } from '@/lib/scoring/leadScore';

/**
 * This endpoint is intended to be called by a daily cron job (e.g., Vercel Cron).
 * Set up a cron job to POST to this endpoint with the header x-pipeline-secret: $DAILY_PIPELINE_SECRET
 *
 * Required environment variables:
 * - TARGET_CITIES: comma-separated list of cities to search
 * - TARGET_CATEGORIES: comma-separated list of business categories to search
 * - DAILY_PIPELINE_SECRET: secret for authenticating the cron job
 * - NEXT_PUBLIC_SITE_URL: your site URL (e.g., https://yourdomain.com)
 * - MAX_LEADS_PER_RUN (optional): maximum number of top leads to save (default: 1000)
 *
 * Note: The leads table must have a unique constraint on the `place_id` column
 * to support upsert. If not, add a unique index: CREATE UNIQUE INDEX idx_leads_place_id ON leads(place_id);
 */
export async function POST(req: Request) {
  try {
    // Authentication via secret header
    const secret = req.headers.get('x-pipeline-secret');
    const expectedSecret = process.env.DAILY_PIPELINE_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get configuration
    const targetCities = process.env.TARGET_CITIES?.split(',').map(s => s.trim()).filter(Boolean) || [];
    const targetCategories = process.env.TARGET_CATEGORIES?.split(',').map(s => s.trim()).filter(Boolean) || [];
    const maxLeads = parseInt(process.env.MAX_LEADS_PER_RUN || '1000', 10);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const maxQueueLeads = parseInt(process.env.MAX_QUEUE_LEADS || '10', 10); // Default to top 10 leads

    if (targetCities.length === 0 || targetCategories.length === 0) {
      return NextResponse.json({ error: 'Missing TARGET_CITIES or TARGET_CATEGORIES environment variables' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // Collect all leads from all city/category combinations
    const allLeads: any[] = [];

    for (const city of targetCities) {
      for (const category of targetCategories) {
        try {
          const searchUrl = `${siteUrl}/api/search-businesses`;
          const response = await fetch(searchUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ city, category })
          });

          if (!response.ok) {
            console.error(`Search failed for ${city}, ${category}: ${response.status}`);
            continue;
          }

          const data = await response.json();
          if (data.results && Array.isArray(data.results)) {
            allLeads.push(...data.results);
          }
        } catch (error) {
          console.error(`Error searching ${city}, ${category}:`, error);
        }
      }
    }

    // Deduplicate by Google Place ID (the 'id' field from search results)
    const leadMap = new Map<string, any>();
    for (const lead of allLeads) {
      const placeId = lead.id;
      if (!placeId) continue;
      const existing = leadMap.get(placeId);
      if (!existing || (lead.rating || 0) > (existing.rating || 0)) {
        leadMap.set(placeId, lead);
      }
    }
    const uniqueLeads = Array.from(leadMap.values());

    // Score each lead using the proper scoring function
    const scoredLeads = uniqueLeads.map(lead => ({
      ...lead,
      score: scoreLead(lead)
    }));

    // Sort by score descending
    scoredLeads.sort((a, b) => b.score - a.score);

    // Take top N for queueing (default to top 10)
    const topLeads = scoredLeads.slice(0, maxQueueLeads);

    // Queue these leads for site generation
    const queueEntries: any[] = [];
    for (const lead of topLeads) {
      queueEntries.push({
        lead_id: lead.id,
        status: 'queued',
        created_at: new Date().toISOString(),
      });
    }

    // Insert into queue table
    const { error: queueError } = await supabaseAdmin
      .from('lead_queue')
      .insert(queueEntries)
      .on_conflict('lead_id')
      .ignore();

    if (queueError) {
      console.error('Failed to queue leads:', queueError);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      totalFound: allLeads.length,
      uniqueLeads: uniqueLeads.length,
      topLeads: topLeads.length,
      queued: queueEntries.length
    });
  } catch (error) {
    console.error('Pipeline error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
