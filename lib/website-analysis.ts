const CTA_KEYWORDS = [
  "contact", "call", "book", "get started", "learn more", "sign up", "buy now", 
  "shop now", "request a quote", "schedule", "free", "trial", "demo", "consultation", 
  "estimate", "quote", "appointment", "call now", "click here", "more info", 
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
