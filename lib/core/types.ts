export type UserRole = "admin" | "client" | "reseller";

export type SiteStatus = "preview" | "active";
export type SiteType = "admin_generated" | "self_serve";

export interface GeneratedSite {
  id: string;
  business_name: string;
  city: string | null;
  category: string | null;
  subdomain: string;
  site_type: SiteType;
  status: SiteStatus;
  preview_token: string | null;
  client_user_id: string | null;
}

export interface TemplatePages {
  home: { headline: string; subheadline: string };
  services: { headline: string; sections: { title: string; items: string[] }[] };
  about: { headline: string; content: string };
  contact: { headline: string; cta: string };
}

export type TemplateKey = "plumber" | "dentist" | "restaurant" | "barber" | "default";
