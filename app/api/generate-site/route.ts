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

// Template configurations
const templates = {
  plumber: {
    layout: "vertical",
    sections: ["hero", "services", "emergency", "contact", "locations"],
    prompt: `
You are generating a high-converting plumbing service website.

Focus on:
- Emergency plumbing services
- Common plumbing services offered
- Local service area
- Professional and reliable service
- Contact information and availability

Return STRICT JSON ONLY.

Business:
Name: {businessName}
Category: {category}
City: {city}

Output format:
{
  "headline": "",
  "subheadline": "",
  "services": [],
  "emergency": "",
  "about": "",
  "cta": "",
  "faq": [{ "question": "", "answer": "" }]
}
`,
    defaultServices: [
      "Emergency Plumbing Services",
      "Leak Repair & Detection",
      "Pipe Installation & Repair",
      "Drain Cleaning",
      "Water Heater Services",
      "Bathroom & Kitchen Plumbing"
    ]
  },
  dentist: {
    layout: "horizontal",
    sections: ["hero", "services", "about", "testimonials", "contact"],
    prompt: `
You are generating a high-converting dental practice website.

Focus on:
- Comprehensive dental services
- Patient comfort and care
- Modern dental technology
- Experienced dental team
- Insurance and payment options

Return STRICT JSON ONLY.

Business:
Name: {businessName}
Category: {category}
City: {city}

Output format:
{
  "headline": "",
  "subheadline": "",
  "services": [],
  "about": "",
  "testimonials": [],
  "cta": "",
  "faq": [{ "question": "", "answer": "" }]
}
`,
    defaultServices: [
      "General Dentistry",
      "Cosmetic Dentistry",
      "Teeth Whitening",
      "Dental Implants",
      "Orthodontics",
      "Pediatric Dentistry"
    ]
  },
  restaurant: {
    layout: "full-width",
    sections: ["hero", "menu", "hours", "location", "about"],
    prompt: `
You are generating a high-converting restaurant website.

Focus on:
- Menu highlights and specialties
- Dining atmosphere and experience
- Operating hours and location
- Reservations and contact info
- Special events and promotions

Return STRICT JSON ONLY.

Business:
Name: {businessName}
Category: {category}
City: {city}

Output format:
{
  "headline": "",
  "subheadline": "",
  "menu_highlights": [],
  "about": "",
  "hours": "",
  "location": "",
  "cta": "",
  "faq": [{ "question": "", "answer": "" }]
}
`,
    defaultServices: [
      "Fine Dining Experience",
      "Local Cuisine Specialties",
      "Wine & Beverage Selection",
      "Private Dining Events",
      "Catering Services",
      "Takeout & Delivery"
    ]
  },
  barber: {
    layout: "side-panel",
    sections: ["hero", "services", "team", "booking", "contact"],
    prompt: `
You are generating a high-converting barber shop website.

Focus on:
- Professional barber services
- Experienced barbers/stylists
- Modern shop atmosphere
- Booking and appointment system
- Men's grooming products

Return STRICT JSON ONLY.

Business:
Name: {businessName}
Category: {category}
City: {city}

Output format:
{
  "headline": "",
  "subheadline": "",
  "services": [],
  "team": [],
  "about": "",
  "cta": "",
  "faq": [{ "question": "", "answer": "" }]
}
`,
    defaultServices: [
      "Men's Haircuts & Styling",
      "Beard Grooming & Trimming",
      "Hot Towel Shaves",
      "Facial Treatments",
      "Hair Coloring",
      "Special Occasion Styling"
    ]
  }
};

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

    // Get template based on category
    const categoryLower = category.toLowerCase();
    const template = templates[categoryLower] || templates.plumber;

    // Prepare prompt with template-specific instructions
    const prompt = template.prompt
      .replace("{businessName}", businessName)
      .replace("{category}", category)
      .replace("{city}", city);

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

    // Ensure required fields exist and use defaults if missing
    if (!siteJson.services && template.defaultServices) {
      siteJson.services = template.defaultServices;
    }

    const subdomain = slugify(businessName);

    return NextResponse.json({
      site: siteJson,
      subdomain,
      template: {
        type: categoryLower,
        layout: template.layout,
        sections: template.sections
      }
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}
