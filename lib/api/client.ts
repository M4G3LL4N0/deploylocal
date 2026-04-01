"use client";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

type SearchResponse = {
  city: string;
  category: string;
  radius: number;
  results: {
    id: string;
    business_name: string;
    phone: string;
    address: string;
    city: string;
    website_url: string | null;
    has_website: boolean;
    rating: number | null;
    review_count: number | null;
    score: number;
    website_quality_score: number | null;
  }[];
};

type LeadInput = {
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
  website_quality_score: number | null;
};

type SiteInput = {
  businessName: string;
  category: string;
  city: string;
  leadId: string;
};

type TemplateKey = "plumber" | "dentist" | "restaurant" | "barber" | "default";

type TemplatePages = {
  home: {
    headline: string;
    subheadline: string;
  };
  services: {
    headline: string;
    sections: {
      title: string;
      items: string[];
    }[];
  };
  about: {
    headline: string;
    content: string;
  };
  contact: {
    headline: string;
    cta: string;
  };
};

type Template = {
  key: TemplateKey;
  layout: string;
  pages: TemplatePages;
  faq: {
    question: string;
    answer: string;
  }[];
};

type SiteResponse = {
  site: {
    id: string;
    business_name: string;
    city: string | null;
    category: string | null;
    subdomain: string;
    site_type: "admin_generated" | "self_serve";
    status: "preview" | "active";
    preview_token: string | null;
    client_user_id: string | null;
    template: Template;
    pages: TemplatePages;
    faq: {
      question: string;
      answer: string;
    }[];
  };
};

type InviteInput = {
  siteId: string;
  email: string;
};

type ClaimInput = {
  token: string;
};

export async function apiFetch<T>(endpoint: string, body: any): Promise<T> {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error instanceof Error ? error : new Error("API request failed");
  }
}

export async function searchBusinesses({
  city,
  category,
  radius = 5000,
}: {
  city: string;
  category: string;
  radius?: number;
}): Promise<SearchResponse> {
  return apiFetch<SearchResponse>("search-businesses", {
    city,
    category,
    radius,
  });
}

export async function saveLeads(leads: LeadInput[]): Promise<{ inserted: number }> {
  return apiFetch<{ inserted: number }>("save-search-results", {
    results: leads,
  });
}

export async function bulkGenerateSites(leadIds: string[]): Promise<{
  created: string[];
  failed: string[];
}> {
  return apiFetch<{
    created: string[];
    failed: string[];
  }>("bulk-generate-sites", {
    leadIds,
  });
}

const TEMPLATE_MAP: Record<string, TemplateKey> = {
  "plumber": "plumber",
  "electrician": "plumber",
  "contractor": "plumber",
  "dentist": "dentist",
  "orthodontist": "dentist",
  "restaurant": "restaurant",
  "cafe": "restaurant",
  "barber": "barber",
  "salon": "barber",
};

function getTemplateKey(category: string): TemplateKey {
  const lowerCategory = category.toLowerCase();
  return TEMPLATE_MAP[lowerCategory] || "default";
}

export async function generateSite({
  businessName,
  category,
  city,
  leadId,
}: SiteInput) {
  const templateKey = getTemplateKey(category);
  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const response = await fetch("/api/generate-and-save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      businessName,
      category,
      city,
      leadId,
      templateKey,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Site generation failed");
  }

  return (await response.json()) as SiteResponse;
}

export async function createInvite({
  siteId,
  email,
}: InviteInput) {
  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const response = await fetch("/api/create-site-invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      siteId,
      email,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Invite failed");
  }

  return (await response.json()) as { claimUrl: string };
}

function validateTemplatePages(pages: TemplatePages): TemplatePages {
  return {
    home: {
      headline: pages.home.headline || "Welcome to Our Business",
      subheadline: pages.home.subheadline || "Quality services you can trust",
    },
    services: {
      headline: pages.services.headline || "Our Services",
      sections: pages.services.sections.map(section => ({
        title: section.title || "Service",
        items: section.items.filter(item => item.trim().length > 0)
      })).filter(section => section.items.length > 0)
    },
    about: {
      headline: pages.about.headline || "About Us",
      content: pages.about.content || "We are a trusted local business dedicated to serving our community."
    },
    contact: {
      headline: pages.contact.headline || "Contact Us",
      cta: pages.contact.cta || "Get in touch today!"
    }
  };
}

function validateFAQ(faq: { question: string; answer: string }[]) {
  return faq
    .filter(item => item.question.trim().length > 0 && item.answer.trim().length > 0)
    .map(item => ({
      question: item.question.endsWith("?") ? item.question : `${item.question}?`,
      answer: item.answer
    }));
}

export async function claimSite({
  token,
}: ClaimInput) {
  const response = await fetch("/api/claim-site", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Claim failed");
  }

  return (await response.json()) as { siteId: string };
}
