import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Simple scoring function - can be replaced with more sophisticated logic
function calculateScore(lead: any): number {
  let score = 0;
  // Rating is typically 0-5, scale to 0-100
  if (lead.rating) {
    score += lead.rating * 20;
  }
  // Prioritize businesses without a website
  if (!lead.has_website) {
    score += 30;
  }
  // Prioritize businesses with a phone number
  if (lead.phone) {
    score += 20;
  }
  return score;
}

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

    // Score each lead
    const scoredLeads = uniqueLeads.map(lead => ({
      ...lead,
      score: calculateScore(lead)
    }));

    // Sort by score descending
    scoredLeads.sort((a, b) => b.score - a.score);

    // Take top N
    const topLeads = scoredLeads.slice(0, maxLeads);

    // Upsert into leads table
    let insertedCount = 0;
    for (const lead of topLeads) {
      const { id: placeId, business_name, category, phone, address, city, website_url, has_website, rating } = lead;
      const { error } = await supabaseAdmin
        .from('leads')
        .upsert(
          {
            place_id: placeId,
            business_name,
            category,
            phone,
            address,
            city,
            website_url,
            has_website,
            rating
          },
          { onConflict: 'place_id' }
        );

      if (error) {
        console.error(`Failed to upsert lead ${placeId}:`, error);
      } else {
        insertedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      totalFound: allLeads.length,
      uniqueLeads: uniqueLeads.length,
      topLeads: topLeads.length,
      insertedOrUpdated: insertedCount
    });
  } catch (error) {
    console.error('Pipeline error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
