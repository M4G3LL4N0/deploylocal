import { NextResponse } from "next/server";
import { scoreLead } from "@/lib/scoring/leadScore";

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

type PlacesSearchTextPlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  types?: string[];
};

type PlacesSearchTextResponse = {
  places?: PlacesSearchTextPlace[];
};

type PlaceDetailsResponse = {
  nationalPhoneNumber?: string;
  websiteUri?: string;
};

async function fetchPlaceDetails(
  placeId: string,
  apiKey: string
): Promise<{ phone: string; website: string | null }> {
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}`,
    {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "nationalPhoneNumber,websiteUri",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return { phone: "", website: null };
  }

  const data = (await res.json()) as PlaceDetailsResponse;

  return {
    phone: data.nationalPhoneNumber ?? "",
    website: data.websiteUri ?? null,
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SearchRequestBody;

    const city = body.city?.trim();
    const category = body.category?.trim();
    const radiusInMeters =
      typeof body.radius === "number" && Number.isFinite(body.radius)
        ? body.radius
        : 5000;

    if (!city || !category) {
      return NextResponse.json(
        { error: "City and category are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY ?? "";

    if (apiKey.length === 0) {
      return NextResponse.json(
        { error: "Missing GOOGLE_MAPS_API_KEY" },
        { status: 500 }
      );
    }

    const query = `${category} in ${city}`;

    const searchRes = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.types",
        },
        body: JSON.stringify({
          textQuery: query,
          pageSize: 20,
        }),
        cache: "no-store",
      }
    );

    if (!searchRes.ok) {
      const errorText = await searchRes.text();
      return NextResponse.json(
        { error: `Google Places search failed: ${errorText}` },
        { status: 502 }
      );
    }

    const searchData = (await searchRes.json()) as PlacesSearchTextResponse;
    const places = searchData.places ?? [];

    const results: LeadResult[] = await Promise.all(
      places.map(async (place, index): Promise<LeadResult> => {
        const placeId = place.id ?? `generated_${index}`;
        const details = place.id
          ? await fetchPlaceDetails(place.id, apiKey)
          : { phone: "", website: null };

        const businessName = place.displayName?.text ?? `${category} in ${city}`;
        const derivedCategory =
          place.types?.[0]?.replaceAll("_", " ") ?? category;
        const hasWebsite = Boolean(details.website);

        return {
          id: placeId,
          business_name: businessName,
          category: derivedCategory,
          phone: details.phone,
          address: place.formattedAddress ?? "",
          city,
          website_url: details.website,
          has_website: hasWebsite,
          rating: typeof place.rating === "number" ? place.rating : null,
          review_count:
            typeof place.userRatingCount === "number"
              ? place.userRatingCount
              : null,
          score: scoreLead({
            has_website: hasWebsite,
            rating: typeof place.rating === "number" ? place.rating : null,
            review_count:
              typeof place.userRatingCount === "number"
                ? place.userRatingCount
                : null,
            phone: details.phone,
            category: derivedCategory,
            business_name: businessName,
          }),
        };
      })
    );

    results.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      city,
      category,
      radius: radiusInMeters,
      results,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Search failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
