import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { businessName, city, businessType } = await request.json();

    if (!businessName || !city || !businessType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `Generate website content for a local business. The business is called "${businessName}", located in ${city}, and is a ${businessType}. 

Return a JSON object with these exact fields:
- headline: compelling main headline (max 60 chars)
- subheadline: supporting subheadline (max 120 chars)
- services: array of 4-6 service descriptions (short phrases)
- about: 2-3 paragraph about section describing the business
- cta: call to action text with urgency
- faq: array of 3-5 objects with "question" and "answer" fields

Make it sound professional, trustworthy, and locally focused. Use a premium tone that builds credibility.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a professional copywriter specializing in local business websites. Always respond with valid JSON matching the requested structure.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate content" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Clean the response to extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Invalid response format" },
        { status: 500 }
      );
    }

    const parsedContent = JSON.parse(jsonMatch[0]);

    return NextResponse.json(parsedContent);
  } catch (error) {
    console.error("Error in generate-site API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
