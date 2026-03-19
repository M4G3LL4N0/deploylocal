const CTA_KEYWORDS = [
  "contact", "call", "book", "get started", "learn more", "sign up", "buy now",   "shop now", "request a quote", "schedule", "free", "trial", "demo", "consultation",   "estimate", "quote", "appointment", "call now", "click here", "more info", 
  "details", "info", "contact us", "call us", "book now", "get quote", 
  "start now", "begin", "join", "subscribe", "register", "sign in", "log in", 
  "apply", "hire", "buy", "purchase", "order", "shop", "store", "visit", 
  "explore", "discover", "see more", "read more", "view", "open", "download", 
  "listen", "watch", "play", "try", "start", "begin", "go", "click", "tap", 
  "press", "enter", "submit", "send", "email", "message", "chat", "call", 
  "phone", "text", "sms", "whatsapp"
];

export function analyzeWebsite(html: string): number {
  let score = 0;
  const lowerHtml = html.toLowerCase();

  // Meta description (15 points)
  if (lowerHtml.includes('<meta name="description"') || 
      lowerHtml.includes('<meta property="og:description"')) {
    score += 15;
  }

  // Viewport meta (15 points)
  if (lowerHtml.includes('<meta name="viewport"')) {
    score += 15;
  }

  // H1 heading (15 points)
  if (lowerHtml.includes('<h1')) {
    score += 15;
  }

  // Header tag (15 points)
  if (lowerHtml.includes('<header')) {
    score += 15;
  }

  // Footer tag (15 points)
  if (lowerHtml.includes('<footer')) {
    score += 15;
  }

  // CTA keywords (25 points)
  const hasCTA = CTA_KEYWORDS.some(keyword => lowerHtml.includes(keyword));
  if (hasCTA) {
    score += 25;
  }

  return score;
}

// Helper functions to extract additional lead data from HTML

export function extractEmail(html: string): string | null {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = html.match(emailRegex);
  return matches?.[0] ?? null;
}

export function extractBusinessHours(html: string): string | null {
  // Simple heuristic: look for common patterns like "Mon-Fri 9am-5pm"
  const hoursRegex = /(?:mon|tue|wed|thu|fri|sat|sun)[^\d]*?(\d{1,2})(?::?(\d{2}))?\s*-\s*(\d{1,2})(?::?(\d{2}))?/gi;
  const matches = html.match(hoursRegex);
  if (matches) {
    // Return the first found range in a simple format
    const start = matches[0];
    return start.replace(/\s+/g, ' ').trim();
  }
  return null;
}

export function extractPlaceId(html: string): string | null {
  // Look for Google Place ID patterns like "Place ID: ChIJ... " or "g/place/id/..."
  const placeIdRegex = /(?:place[_-]?id|google[_-]?place[_-]?id|pid)=([a-zA-Z0-9-_]+)/i;
  const match = html.match(placeIdRegex);
  return match?.[1] ?? null;
}

export function extractCoordinates(html: string): { lat: number | null; lng: number | null } | null {
  // Look for latitude/longitude patterns like "lat":12.34,"lng":56.78
  const coordRegex = /["']?lat["']?\s*:\s*([-\d.]+)\s*,\s*["']?lng["']?\s*:\s*([-\d.]+)/i;
  const match = html.match(coordRegex);
  if (match) {
    return {
      lat: parseFloat(match[1]),
      lng: parseFloat(match[2])
    };
  }
  return null;
}

export async function fetchWebsiteHtml(url: string, timeout = 5000): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DeployLocalBot/1.0)'
      }
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
