import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

type LeadInput = {
  id: string;
  business_name: string;
  category: string;
  phone: string;
  address: string;
  city: string;
  website_url: string | null;
  has_website: boolean;
  rating: number | null;
  review_count: number | null;
  score: number;
  website_quality_score: number | null;
  // New fields for enhanced lead data
  email: string | null;
  business_hours: string | null;
  place_id: string | null;
  lat: number | null;
  lng: number | null;
};

export async function POST(req: Request) {
  try {
    const { supabase, user } = await requireAdmin();
    const body = await req.json();

    const results = Array.isArray(body.results) ? (body.results as LeadInput[]) : [];

    if (results.length === 0) {
      return NextResponse.json(
        { error: "No results provided" },
        { status: 400 }
      );
    }

    const rows = results.map((lead) => ({
      user_id: user.id,
      external_id: lead.id,
      business_name: lead.business_name,
      category: lead.category,
      phone: lead.phone,
      address: lead.address,
      city: lead.city,
      website_url: lead.website_url,
      has_website: lead.has_website,
      rating: lead.rating,
      review_count: lead.review_count,
      score: lead.score,
      website_quality_score: lead.website_quality_score,
      // New fields
      email: lead.email,
      business_hours: lead.business_hours,
      place_id: lead.place_id,
      lat: lead.lat,
      lng: lead.lng,
      status: "new",
      outreach_status: "new",
    }));

    const { data, error } = await supabase
      .from("leads")
      .insert(rows)
      .select("id");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      inserted: data?.length || 0,
      ids: data?.map((item) => item.id) || [],
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save search results";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
