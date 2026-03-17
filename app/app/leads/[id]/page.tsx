"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Lead {
  id: string;
  business_name: string;
  category: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  rating: number | null;
  review_count: number;
  score: number;
  city: string;
  user_id: string;
  created_at: string;
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedSite, setGeneratedSite] = useState<{ html: string; css: string } | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLead = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', params.id)
        .single();

      if (fetchError) {
        setError(fetchError.message);
      } else {
        // Ensure the lead belongs to the user
        if (data.user_id !== user.id) {
          setError('Unauthorized');
        } else {
          setLead(data);
        }
      }
      setLoading(false);
    };

    if (params.id) {
      fetchLead();
    }
  }, [params.id, router]);

  const handleGenerate = async () => {
    if (!lead) return;
    setGenerating(true);
    setGenerationError(null);
    try {
      const response = await fetch('/api/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: lead.business_name,
          city: lead.city,
          businessType: lead.category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate website');
      }

      const siteData = await response.json();

      // Save to generated_sites
      const supabase = createClient();
      const { error: saveError } = await supabase
        .from('generated_sites')
        .insert({
          lead_id: lead.id,
          business_name: lead.business_name,
          generated_html: siteData.html,
          generated_css: siteData.css,
        });

      if (saveError) throw saveError;

      setGeneratedSite(siteData);
    } catch (err: any) {
      setGenerationError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lead...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={() => router.push('/app/leads')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  if (!lead) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/app/leads')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Leads
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Lead Details</h1>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Business Information</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                  <dd className="text-lg text-gray-900">{lead.business_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="text-lg text-gray-900">{lead.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="text-lg text-gray-900">{lead.phone || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="text-lg text-gray-900">{lead.address || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Website</dt>
                  <dd className="text-lg text-gray-900">
                    {lead.website ? (
                      <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {lead.website}
                      </a>
                    ) : (
                      'None'
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">City</dt>
                  <dd className="text-lg text-gray-900">{lead.city}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Rating</dt>
                  <dd className="text-lg text-gray-900">
                    {lead.rating !== null ? lead.rating.toFixed(1) : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Review Count</dt>
                  <dd className="text-lg text-gray-900">{lead.review_count}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Score</dt>
                  <dd className="text-lg text-gray-900 font-bold text-blue-600">{lead.score}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Website Present</dt>
                  <dd className="text-lg text-gray-900">
                    {lead.website ? 'Yes' : 'No'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>

        {generationError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-red-700">{generationError}</p>
          </div>
        )}

        {generatedSite && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Generated Website</h2>
            <div className="mb-6">
              <p className="text-gray-700 font-medium mb-2">Preview:</p>
              <div className="border rounded-lg overflow-hidden bg-white">
                <iframe
                  srcDoc={`${generatedSite.html}<style>${generatedSite.css}</style>`}
                  title="Generated Website Preview"
                  className="w-full h-96 border-0"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 font-medium mb-2">HTML:</p>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                {generatedSite.html}
              </pre>
            </div>
            <div>
              <p className="text-gray-700 font-medium mb-2">CSS:</p>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                {generatedSite.css}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
