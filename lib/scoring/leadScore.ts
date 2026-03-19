export interface LeadForScoring {
  has_website: boolean;
  rating: number | null;
  review_count: number | null;
  phone: string;
  category: string;
  business_name: string;
  website_quality_score?: number | null;
}

const HIGH_VALUE_CATEGORIES = [
  "plumber",
  "electrician",
  "contractor",
  "roofer",
  "hvac",
  "dentist",
  "lawyer",
  "accountant",
  "real estate agent",
  "insurance agent",
  "mortgage broker",
];

const CHAIN_KEYWORDS = [
  "mcdonald",
  "starbucks",
  "walmart",
  "target",
  "subway",
  "burger king",
  "domino",
  "chipotle",
  "kfc",
  "mcdonalds",
  "starbuck",
];

export function scoreLead(lead: LeadForScoring): number {
  let score = 0;

  // Website presence (major weight)
  if (lead.has_website) {
    score += 30;
    // If we have a quality score, adjust: lower quality means more points (higher opportunity)
    if (lead.website_quality_score !== null && lead.website_quality_score !== undefined) {
      score += (100 - lead.website_quality_score) * 0.5;
    }
  }

  // Rating scoring
  if (lead.rating !== null) {
    if (lead.rating >= 4.5) {
      score += 25;
    } else if (lead.rating >= 4.0) {
      score += 15;
    } else if (lead.rating >= 3.5) {
      score += 5;
    }
    // Below 3.5 gets no points
  }

  // Review count scoring (more is better)
  if (lead.review_count !== null) {
    if (lead.review_count > 100) {
      score += 20;
    } else if (lead.review_count >= 50) {
      score += 15;
    } else if (lead.review_count >= 20) {
      score += 10;
    } else if (lead.review_count >= 10) {
      score += 5;
    }
    // Less than 10 gets no points
  }

  // Phone presence
  if (lead.phone && lead.phone.trim().length > 0) {
    score += 10;
  }

  // Category competitiveness (high-value categories get bonus)
  const categoryLower = lead.category.toLowerCase();
  const isHighValueCategory = HIGH_VALUE_CATEGORIES.some((cat) =>
    categoryLower.includes(cat)
  );
  if (isHighValueCategory) {
    score += 15;
  }

  // Chain penalty
  const businessNameLower = lead.business_name.toLowerCase();
  const isChain = CHAIN_KEYWORDS.some((keyword) =>
    businessNameLower.includes(keyword)
  );
  if (isChain) {
    score -= 20;
  }

  // Normalize to 0-100 range
  return Math.max(0, Math.min(100, score));
}
