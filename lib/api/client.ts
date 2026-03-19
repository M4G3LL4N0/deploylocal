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
  };
};

type InviteInput = {
  siteId: string;
  email: string;
};

type ClaimInput = {
  token: string;
};

export async function searchBusinesses({
  city,
  category,
  radius = 5000,
}: {
  city: string;
  category: string;
  radius?: number;
}) {
  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const response = await fetch("/api/search-businesses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      city,
      category,
      radius,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Search failed");
  }

  return (await response.json()) as SearchResponse;
}

export async function saveLeads(leads: LeadInput[]) {
  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const response = await fetch("/api/save-search-results", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      results: leads,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to save leads");
  }

  return (await response.json()) as { inserted: number };
}

export async function bulkGenerateSites(leadIds: string[]) {
  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const response = await fetch("/api/bulk-generate-sites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      leadIds,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Bulk generation failed");
  }

  return (await response.json()) as {
    created: string[];
    failed: string[];
  };
}

export async function generateSite({
  businessName,
  category,
  city,
  leadId,
}: SiteInput) {
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
