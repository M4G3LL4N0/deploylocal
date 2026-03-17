interface SiteData {
  headline: string;
  subheadline: string;
  services: string[];
  about: string;
  cta: string;
  faq: Array<{ question: string; answer: string }>;
}

interface SitePreviewProps {
  data: SiteData;
}

export default function SitePreview({ data }: SitePreviewProps) {
  return (
    <div className="bg-white text-black rounded-xl shadow-2xl overflow-hidden border border-gray-200">
      {/* Preview Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-sm text-gray-500">
          local-business-site.com
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-8 max-h-[600px] overflow-y-auto">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {data.headline}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {data.subheadline}
          </p>
        </section>

        {/* Services Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200">
            Our Services
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.services.map((service, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-800">{service}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200">
            About Us
          </h2>
          <div className="prose max-w-none">
            {data.about.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-12 bg-gray-900 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6 text-gray-300">{data.cta}</p>
          <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Contact Us Today
          </button>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {data.faq.map((item, index) => (
              <div key={index}>
                <h3 className="font-bold text-lg mb-2">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Preview Footer */}
      <div className="bg-gray-50 border-t border-gray-200 p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Local Business. All rights reserved.
      </div>
    </div>
  );
}
