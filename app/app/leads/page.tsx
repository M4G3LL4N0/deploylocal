"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LeadsPage() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [radius, setRadius] = useState(10);
  const [results, setResults] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/search-businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city,
          category,
          radius
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();
      
      // Save leads to Supabase
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to save leads.');
        setLoading(false);
        return;
      }

      const leadsToInsert = data.map((business: any) => ({
        user_id: user.id,
        business_name: business.businessName,
        category: business.category,
        phone: business.phone,
        address: business.address,
        website: business.websitePresent,
        rating: business.rating,
        review_count: business.reviewCount,
        score: business.score,
        city: city,
      }));

      // Insert leads and get IDs
      const insertPromises = leadsToInsert.map(lead => 
        supabase.from('leads').insert(lead).select('id').single()
      );
      const insertResults = await Promise.allSettled(insertPromises);

      // Combine original data with inserted IDs
      const resultsWithIds = data.map((business: any, index: number) => {
        const insertResult = insertResults[index];
        const id = insertResult.status === 'fulfilled' ? insertResult.value.id : null;
        return { ...business, id };
      });

      setResults(resultsWithIds);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search for businesses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Find Local Business Leads
        </h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Radius (miles)
              </label>
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                min="1"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Searching...' : 'Search Leads'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviews
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((business, index) => (
                  <tr key={business.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {business.businessName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {business.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {business.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {business.address || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {business.websitePresent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {business.rating !== null ? business.rating.toFixed(1) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {business.reviewCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {business.score}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {business.id ? (
                          <Link
                            href={`/app/leads/${business.id}`}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                          >
                            View
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="px-3 py-1 bg-gray-400 text-white text-xs rounded cursor-not-allowed"
                          >
                            View
                          </button>
                        )}
                        <button
                          className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                        >
                          Export
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {results.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500">Enter search criteria and click "Search Leads" to see results.</p>
          </div>
        )}
      </div>
    </div>
  );
}
