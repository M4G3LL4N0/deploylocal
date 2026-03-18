import { NextResponse }import { NextRespr"i

ttttttttttttttttttttttttttttttttt?:tttttttttttttttttttttttttint;
                                   ul            s                                   at                    ne   tring;  hasWebsite: boolean;
  r:   rating: number | nu:   r:   rating: number |bs  r:   rating: number | nu: er  r:   rating: numco  r:   rating: number sc  r:   r:   rating: e G  r:   rating: number | nu:   r:   r  n  r:   rating: number | nu:   r:   rating: number |bs  r:   rating: number | nu: er  r:   rating: numco  r:   rating: wo  r:   rating: number | nu:   r:   rating: n  "cont  r:   rating: number | nu:   r:   rating: number |bs  r:   rating: number | nu: er  r:   rating: numco  r:   rating: number sc  "l  r:   rating: number | nu:   r:   rating: numbviceKeywords.some((keyword) =>
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

async function fetchPlaceDetails(
  placeId: string,
  apiKey: string
): Promise<{ phone: string; website: string | null }> {
  const detailsUrl = new URL(
    "https://maps.googleapis.com/maps/api/place/details/json"
  );
  detailsUrl.searchParams.set("place_id", placeId);
  detailsUrl.searchParams.set("fields", "formatted_phone_number,website");
  detailsUrl.searchParams.set("key", apiKey);

  const detailsResponse = await fetch(detailsUrl.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!detailsResponse.ok) {
    return { phone: "", website: null };
  }

  const detailsData =
    (await detailsResponse.json()) as GooglePlaceDetailsResponse;

  return {
    phone: detailsData.result?.formatted_phone_number ?? "",
    website: detailsData.result?.website ?? null,
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

    const textSearchUrl = new URL(
      "https://maps.googleapis.com/maps/api/place/textsearch/json"
    );
    textSearchUrl.searchParams.set("query", `${category} in ${city}`);
    textSearchUrl.searchParams.set("radius", String(radiusInMeters));
    textSearchUrl.searchParams.set("key", apiKey);

    const textSearchResponse = await fetch(textSearchUrl.toString(), {
      method: "GET",
      cache: "no-store",
    });

    if (!textSearchResponse.ok) {
      const errorText = await textSearchResponse.text();
      return NextResponse.json(
        { error: `Google Places request failed: ${errorText}` },
        { status: 502 }
      );
    }

    const textSearchData =
      (await textSearchResponse.json()) as GoogleTextSearchResponse;

    const rawPlaces = textSearchData.results ?? [];
    const limitedPlaces = rawPlaces.slice(0, 20);

    const enrichedResults = await Promise.all(
      limitedPlaces.map(async (place, index): Promise<LeadResult> => {
        const placeId = place.place_id ?? `generated_${index}`;
        const details = place.place_id
          ? await fetchPlaceDetails(place.place_id, apiKey)
          : { phone: "", website: null };

        const businessName = place.name ?? `${category} in ${city}`;
        const derivedCategory =
          place.types?.[0]?.replaceAll("_", " ") ?? category;
        const hasWebsite = Boolean(details.website);

        return {
          id: placeId,
          business_name: businessName,
          category: derivedCategory,
          phone: details.phone,
          address: place.formatted_address ?? "",
          city,
          website_url: details.website,
          has_website: hasWebsite,
          rating: typeof place.rating === "number" ? place.rating : null,
          review_count:
            typeof place.user_ratings_total === "number"
              ? place.user_ratings_total
              : null,
          score: scoreLead({
            hasWebsite,
            rating: typeof place.rating === "number" ? place.rating : null,
            reviewCount:
              typeof place.user_ratings_total === "number"
                ? place.user_ratings_total
                : null,
            category: derivedCategory,
            businessName,
          }),
        };
      })
    );

    const results = enrichedResults.sort((a, b) => b.score - a.score);

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
