import { NextResponse } from "next/server";

type GenerateBody = {
  businessName: string;
  category: string;
  city: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateBody;

    const { businessName, category, city } = body;

    if (!businessName || !category || !city) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const prompt = `
You are generating a high-converting local business website.

Return STRICT JSON ONLY.

Business:
Name: ${businessName}
Category: ${category}
City: ${city}

Output format:
{
  "headline": "",
  "subheadline": "",
  "services": [],
  "about": "",
  "cta": "",
  "faq": [{ "question": "", "answer": "" }]
}
`;

    const aiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5.3",
        input: prompt,
      }),
    });

    const aiData = await aiRes.json();

    const text =
      aiData.output?.[0]?.content?.[0]?.text ||
      aiData.output_text ||
      "{}";

    let siteJson;

    try {
      siteJson = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "AI output parsing failed" },
        { status: 500 }
      );
    }

    const subdomain = slugify(businessName);

    return NextResponse.json({
      site: siteJson,
      subdomain,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}
