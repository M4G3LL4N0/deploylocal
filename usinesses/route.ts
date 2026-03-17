import { NextResponse } from 'next/server';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!GOOGLE_PLACES_API_KEY) {
  throw new Error('Missing GOOGLE_PLACES_API_KEY environment variable');
}

interface PlaceDetails {
  name: string;
  rating: number | null;
  user_ratings_total: number;
  formatted_phone_number: string | null;
  formatted_address: string | null;
  website: string | null;
  types: string[];
}

interface BusinessResult {
  businessName: string;
  category: string;
  phone: string | null;
  address: string | null;
  websitePresent: string;
  rating: number | null;
  reviewCount: number;
  score: number;
}

const SERVICE_CATEGORIES = [
  'plumber', 'electrician', 'hvac', 'landscaping', 'cleaning', 
  'painter', 'roofer', 'plumbing', 'electrical', 'contractor',
  'landscaper', 'gardener', 'pest control', 'locksmith'
];

const isServiceBusiness = (category: string): boolean => {
  const lowerCategory = category.toLowerCase();
  return SERVICE_CATEGORIES.some(serviceCat =>     lowerCategory.includes(serviceCat)
  );
};

const calculateScore = (
  websitePresent: boolean,
  rating: number | null,
  reviewCount: number,
  isService: boolean): number => {
  let score = 0;
    // No website: strong positive weight
  if (!websitePresent) score += 30;
  
  // Good rating: positive weight (rating >= 4.0)
  if (rating !== null && rating >= 4.0) score += 20;
    // Lower review count: positive weight (< 50 reviews)
  if (reviewCount < 50) score += 15;
  
  // Service business: positive weight  if (isService) score += 10;
  
  // Chain/franchise: negative weight (simplified heuristic)
  // In a real implementation, we'd check for known chain indicators
  // For now, we'll use a simple placeholder based on name patterns
  // This is a simplified version - in production you'd want a more robust method
  // if (isChain) score -= 25;
  
  return score;
};

export async function POST(request: Request) {
  try {
    const { city, category, radius } = await request.json();

    if (!city || !category || !radius) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert radius from miles to meters (1 mile = 1609.34 meters)
    const radiusInMeters = Math.min(radius * 1609.34, 50000); // Google Places max radius is 50000 meters

    // Text Search to find businesses
    const textSearchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    textSearchUrl.searchParams.set('query', `${category} in ${city}`);
    textSearchUrl.searchParams.set('radius', radiusInMeters.toString());
    textSearchUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY);

    const textSearchResponse = await fetch(textSearchUrl.toString());
    if (!textSearchResponse.ok) {
      throw new Error('Google Places Text Search failed');
    }
    const textSearchData = await textSearchResponse.json();

    if (textSearchData.status !== 'OK' && textSearchData.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places Text Search error: ${textSearchData.status}`);
    }

    const businesses: BusinessResult[] = [];
    const MAX_RESULTS = 10; // Limit to control costs

    for (const place of textSearchData.results.slice(0, MAX_RESULTS)) {
      try {
        // Get Place Details for website and other info
        const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
        detailsUrl.searchParams.set('place_id', place.place_id);
        detailsUrl.searchParams.set('fields', 'name,rating,user_ratings_total,formatted_phone_number,formatted_address,website,types');
        detailsUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY);

        const detailsResponse = await fetch(detailsUrl.toString());
        if (!detailsResponse.ok) {
          console.warn(`Failed to fetch details for place_id: ${place.place_id}`);
          continue;
        }
        const detailsData = await detailsResponse.json();

        if (detailsData.status !== 'OK') {
          console.warn(`Google Places Details error for ${place.place_id}: ${detailsData.status}`);
          continue;
        }

        const result = detailsData.result;
        const websitePresent = !!result.website;
        const rating = result.rating ?? null;
        const reviewCount = result.user_ratings_total ?? 0;
        const isService = isServiceBusiness(category);
        
        const score = calculateScore(
          websitePresent,
          rating,
          reviewCount,
          isService
        );

        businesses.push({
          businessName: result.name,
          category: category, // Using the searched category for consistency
          phone: result.formatted_phone_number ?? null,
          address: result.formatted_address ?? null,
          websitePresent: websitePresent ? 'Yes' : 'No',
          rating: rating,
          reviewCount: reviewCount,
          score: score
        });
      } catch (err) {
        console.error(`Error processing place ${place.place_id}:`, err);
        continue;
      }
    }

    // Sort by score descending (highest priority leads first)
    businesses.sort((a, b) => b.score - a.score);

    return NextResponse.json(businesses);
  } catch (error) {
    console.error('Error in search-businesses API:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
