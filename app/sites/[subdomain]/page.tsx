import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SiteJson = {
  headline?: string;
  subheadline?: string;
  services?: string[];
  about?: string;
  cta?: string;
  faq?: { question: string; answer: string }[];
  emergency?: string;
  testimonials?: string[];
  menu_highlights?: string[];
  team?: { name: string; role: string }[];
  hours?: string;
  location?: string;
};

type Template = {
  type: string;
  layout: string;
  sections: string[];
};

export default async function SitePage({
  params,
  searchParams,
}: {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { subdomain } = await params;
  const { token } = await searchParams;

  const supabase = await createClient();

  const { data: site } = await supabase
    .from("generated_sites")
    .select("*")
    .eq("subdomain", subdomain)
    .single();

  if (!site) {
    notFound();
  }

  const template = site.template as Template;
  const data = (site.site_json || {}) as SiteJson;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAssignedClient = Boolean(user && site.client_user_id && user.id === site.client_user_id);
  const isOwner = Boolean(user && site.owner_user_id && user.id === site.owner_user_id);
  const hasPreviewToken =
    typeof token === "string" &&
    typeof site.preview_token === "string" &&
    token.length > 0 &&
    token === site.preview_token;

  if (!isAssignedClient && !isOwner && !hasPreviewToken) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Preview Locked
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            This website preview requires access
          </h1>
          <p className="mt-4 text-zinc-400">
            Ask DeployLocal for your private preview link or sign in to your client portal.
          </p>
        </div>
      </main>
    );
  }

  // Template-specific rendering
  const renderTemplate = () => {
    switch (template.type) {
      case "plumber":
        return (
          <div className="space-y-12">
            <section className="text-center">
              <h1 className="text-5xl font-bold">
                {data.headline || site.business_name}
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                {data.subheadline || "Professional plumbing services"}
              </p>
              <button className="mt-8 rounded-full bg-blue-600 px-8 py-3 text-white font-medium">
                {data.cta || "Emergency Service"}
              </button>
            </section>

            <section>
              <h2 className="text-3xl font-semibold text-center">Our Services</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(data.services || []).map((service) => (
                  <div key={service} className="rounded-xl border p-6">
                    <h3 className="font-semibold">{service}</h3>
                  </div>
                ))}
              </div>
            </section>

            {data.emergency && (
              <section className="bg-red-50 p-8 rounded-xl">
                <h2 className="text-2xl font-semibold text-red-900">Emergency Services</h2>
                <p className="mt-4 text-red-700">{data.emergency}</p>
              </section>
            )}

            <section>
              <h2 className="text-3xl font-semibold text-center">About Us</h2>
              <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                {data.about || "Professional plumbing services with years of experience"}
              </p>
            </section>

            <section className="bg-gray-50 p-8 rounded-xl">
              <h2 className="text-3xl font-semibold text-center">Contact Us</h2>
              <p className="mt-4 text-center text-gray-600">
                Call us for immediate assistance: (555) 123-4567
              </p>
            </section>
          </div>
        );

      case "dentist":
        return (
          <div className="space-y-12">
            <section className="text-center">
              <h1 className="text-5xl font-bold">
                {data.headline || site.business_name}
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                {data.subheadline || "Comprehensive dental care"}
              </p>
              <button className="mt-8 rounded-full bg-blue-600 px-8 py-3 text-white font-medium">
                {data.cta || "Book Appointment"}
              </button>
            </section>

            <section>
              <h2 className="text-3xl font-semibold text-center">Our Services</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {(data.services || []).map((service) => (
                  <div key={service} className="rounded-xl border p-6">
                    <h3 className="font-semibold">{service}</h3>
                  </div>
                ))}
              </div>
            </section>

            {data.testimonials && data.testimonials.length > 0 && (
              <section>
                <h2 className="text-3xl font-semibold text-center">Patient Testimonials</h2>
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {data.testimonials.map((testimonial, index) => (
                    <div key={index} className="rounded-xl border p-6 bg-blue-50">
                      <p className="text-gray-700">"{testimonial}"</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-3xl font-semibold text-center">About Our Practice</h2>
              <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                {data.about || "Comprehensive dental care with modern technology"}
              </p>
            </section>
          </div>
        );

      case "restaurant":
        return (
          <div className="space-y-12">
            <section className="text-center">
              <h1 className="text-5xl font-bold">
                {data.headline || site.business_name}
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                {data.subheadline || "Fine dining experience"}
              </p>
              <button className="mt-8 rounded-full bg-blue-600 px-8 py-3 text-white font-medium">
                {data.cta || "Make Reservation"}
              </button>
            </section>

            <section>
              <h2 className="text-3xl font-semibold text-center">Menu Highlights</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {(data.menu_highlights || []).map((item) => (
                  <div key={item} className="rounded-xl border p-6">
                    <h3 className="font-semibold">{item}</h3>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold text-center">About Our Restaurant</h2>
              <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                {data.about || "Fine dining experience with exceptional cuisine"}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.hours && (
                <section className="bg-gray-50 p-8 rounded-xl">
                  <h2 className="text-2xl font-semibold">Hours</h2>
                  <p className="mt-4 text-gray-600">{data.hours}</p>
                </section>
              )}

              {data.location && (
                <section className="bg-gray-50 p-8 rounded-xl">
                  <h2 className="text-2xl font-semibold">Location</h2>
                  <p className="mt-4 text-gray-600">{data.location}</p>
                </section>
              )}
            </div>
          </div>
        );

      case "barber":
        return (
          <div className="space-y-12">
            <section className="text-center">
              <h1 className="text-5xl font-bold">
                {data.headline || site.business_name}
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                {data.subheadline || "Professional barber services"}
              </p>
              <button className="mt-8 rounded-full bg-blue-600 px-8 py-3 text-white font-medium">
                {data.cta || "Book Appointment"}
              </button>
            </section>

            <section>
              <h2 className="text-3xl font-semibold text-center">Our Services</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {(data.services || []).map((service) => (
                  <div key={service} className="rounded-xl border p-6">
                    <h3 className="font-semibold">{service}</h3>
                  </div>
                ))}
              </div>
            </section>

            {data.team && data.team.length > 0 && (
              <section>
                <h2 className="text-3xl font-semibold text-center">Our Barbers</h2>
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {data.team.map((member, index) => (
                    <div key={index} className="rounded-xl border p-6">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-gray-600">{member.role}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-3xl font-semibold text-center">About Our Shop</h2>
              <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                {data.about || "Professional barber services with modern style"}
              </p>
            </section>
          </div>
        );

      default:
        return (
          <div className="space-y-12">
            <section className="text-center">
              <h1 className="text-5xl font-bold">
                {data.headline || site.business_name}
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                {data.subheadline || "Your business website"}
              </p>
              <button className="mt-8 rounded-full bg-blue-600 px-8 py-3 text-white font-medium">
                {data.cta || "Learn More"}
              </button>
            </section>

            <section>
              <h2 className="text-3xl font-semibold text-center">Our Services</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {(data.services || []).map((service) => (
                  <div key={service} className="rounded-xl border p-6">
                    <h3 className="font-semibold">{service}</h3>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold text-center">About Us</h2>
              <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                {data.about || "Your business description"}
              </p>
            </section>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="border-b bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-900">
        DeployLocal Preview · This site is in preview mode and not yet activated.
      </div>

      <div className="mx-auto max-w-5xl px-6 py-20">
        {renderTemplate()}
      </div>
    </main>
  );
}
