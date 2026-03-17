"use client";

import { useState } from "react";
import SitePreview from "../components/site-preview";

export default function Home() {
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [generatedSite, setGeneratedSite] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/generate-site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ businessName, city, businessType }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate site");
      }

      const data = await response.json();
      setGeneratedSite(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="p-6 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">DeployLocal.app</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              We build local business websites{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                before you even ask
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Our platform scans for businesses with weak or no online presence and
              instantly generates a premium, conversion-optimized website. No
              waiting, no hassle—just a professional site that brings in customers.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Joe's Pizza"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-2">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. San Francisco"
                />
              </div>

              <div>
                <label htmlFor="businessType" className="block text-sm font-medium mb-2">
                  Business Type
                </label>
                <input
                  type="text"
                  id="businessType"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Restaurant, Salon, Auto Repair"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Generating..." : "Generate Site"}
              </button>
            </form>

            {error && (
              <p className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                {error}
              </p>
            )}
          </div>

          <div className="lg:pl-12">
            {generatedSite ? (
              <div className="sticky top-6">
                <SitePreview data={generatedSite} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-800 rounded-xl p-12">
                <p className="text-gray-500 text-center">
                  Your generated website preview will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
