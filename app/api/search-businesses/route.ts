import { NextResponse } from "next/server";

type SearchRequestBody = {
  city?: string;
  category?: string;
  radius?: number;
};

type LeadResult = {
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
};

function scoreLead(input: {
  hasWebsite: boolean;
  rating: number | null;
  reviewCount: number | null;
  category: string;
  businessName: string;
}) {
  let score = 0;

  if (!input.hasWebsite) score += 35;

  if (input.rating !== null) {
    if (input.rating >= 4.5) score += 15;
    else if (input.rating >= 4.0) score += 10;
    else if (input.rating >= 3.5) score += 5;
  }

  if (input.reviewCount !== null) {
    if (input.reviewCount < 10) score += 20;
    else if (input.reviewCount < 30) score += 12;
    else if (input.reviewCount < 75) score += 6;
  }

  const serviceKeywords = [
    "plumber",
    "electrician",
    "contractor",
    "roofer",
    "hvac",
    "salon",
    "barber",
    "dentist",
    "cleaner",
    "landscaper",
    "painter",
    "locksmith",
    "mechanic",
  ];

  if (
    serviceKeywords.some((keyword) =>
      input.category.toLowerCase().includes(keyword)
    )
  ) {
    score += 10;
  }

  const chainKeywords = [
    "mcdonald",
    "starbucks",
    "walmart",
    "target",
    "subway",
    "burger king",
    "domino",
    "chipotle",
  ];

  if (
    chainKeywords.some((keyword) =>
      input.businessName.toLowerCase().includes(keyword)
    )
  ) {
    score -= 25;
  }

  return Math.max(0, Math.min(100, score));
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SearchRequestBody;

    const city = body.city?.trim();
    const category = body.category?.trim();
    const radius = typeof body.radius === "number" ? body.radius : 5000;

    if (!city || !category) {
      return NextResponse.json(
        { error: "City and category are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GOOGLE_MAPS_API_KEY" },
        { status: 500 }
      );
    }

    const sampleBusinesses = [
      {
        id: "lead_1",
        business_name: `${city} ${category} Co.`,
        category,
        phone: "(555) 111-2222",
        address: `101 Main St, ${city}`,
        city,
        website_url: null,
        has_website: false,
        rating: 4.6,
        review_count: 8,
      },
      {
        id: "lead_2",
        business_name: `${city} Elite ${category}`,
        category,
        phone: "(555) 333-4444",
        address: `202 Oak Ave, ${city}`,
        city,
        website_url: "https://example.com",
        has_website: true,
        rating: 4.2,
        review_count: 18,
      },
      {
        id: "lead_3",
        business_name: `${city} Premier ${category} Services`,
        category,
        phone: "(555) 777-8888",
        address: `303 Pine Rd, ${city}`,
        city,
        website_url: null,
        has_website: false,
        rating: 4.8,
        review_count: 4,
      },
    ];

    const results: LeadResult[] = sampleBusinesses
      .map((item) => ({
        ...item,
        score: scoreLead({
          hasWebsite: item.has_website,
          rating: item.rating,
          reviewCount: item.review_count,
          category: item.category,
          businessName: item.business_name,
        }),
      }))
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({
      city,
      category,
      radius,
      results,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Search failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
