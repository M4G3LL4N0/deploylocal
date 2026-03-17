"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function GeneratePage() {
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ html: string; css: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('/api/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, city, businessType }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate website');
      }

      const data = await response.json();

      // Save to generated_sites
      const supabase = createClient();
      const { error: saveError } = await supabase
        .from('generated_sites')
        .insert({
          business_name: businessName,
          generated_html: data.html,
          generated_css: data.css,
        });

      if (saveError) throw saveError;

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Generate Website
        </h1>
        <form onSubmit={handleGenerate} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Type
              </label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={generating}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Website'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Generated Website</h2>
            <div className="mb-6">
              <p className="text-gray-700 font-medium mb-2">Preview:</p>
              <div className="border rounded-lg overflow-hidden bg-white">
                <iframe
                  srcDoc={`${result.html}<style>${result.css}</style>`}
                  title="Generated Website Preview"
                  className="w-full h-96 border-0"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 font-medium mb-2">HTML:</p>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                {result.html}
              </pre>
            </div>
            <div>
              <p className="text-gray-700 font-medium mb-2">CSS:</p>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                {result.css}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
