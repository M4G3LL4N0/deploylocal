import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function QueuePage() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [todayLeads, setTodayLeads] = useState([]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockLeads = [
      {
        id: '1',
        business_name: 'Tech Solutions Inc',
        phone: '555-123-4567',
        category: 'Technology',
        score: 9.8,
        city: 'New York',
        website: 'https://techsolutions.com'
      },
      {
        id: '2',
        business_name: 'Green Energy Co',
        phone: '555-987-6543',
        category: 'Energy',
        score: 9.5,
        city: 'Los Angeles',
        website: null
      },
      {
        id: '3',
        business_name: 'Health Care Ltd',
        phone: '555-456-7890',
        category: 'Healthcare',
        score: 9.2,
        city: 'Chicago',
        website: 'https://healthcare.org'
      }
    ];

    // Sort by score descending
    const sortedLeads = mockLeads.sort((a, b) => b.score - a.score);
    setLeads(sortedLeads);

    // Filter today's leads (example logic)
    const today = new Date();
    const todayLeads = sortedLeads.filter(lead => {
      // Example: leads with score > 9.5 and in top 3 cities
      return lead.score > 9.5 && ['New York', 'Los Angeles', 'Chicago'].includes(lead.city);
    });
    setTodayLeads(todayLeads);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Outreach Queue</h1>

      {/* Today's Priority Leads */}
      {todayLeads.length > 0 && (
        <div className="bg-blue-800 p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-white">Today's Priority Leads</h2>
          <ul className="space-y-4">
            {todayLeads.map(lead => (
              <li key={lead.id} className="p-2 border-b border-gray-700">
                <div className="flex items-center">
                  <div className="mr-4">
                    <strong>{lead.business_name}</strong>
                    <p className="text-sm text-gray-300">Score: {lead.score}</p>
                  </div>
                  <div>
                    <p className="text-sm">{lead.phone}</p>
                    <p className="text-sm">{lead.category}</p>
                    <p className="text-sm">{lead.city}</p>
                    {lead.website ? (
                      <span className="text-sm text-green-300">Website: Active</span>
                    ) : (
                      <span className="text-sm text-red-300">Website: Inactive</span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => router.push(`/app/leads/${lead.id}`)}
                  className="mt-2 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                >
                  Call Now
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* All Leads */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">All Leads (Sorted by Score)</h2>
        <ul className="space-y-4">
          {leads.map(lead => (
            <li key={lead.id} className="p-2 border-b border-gray-700">
              <div className="flex items-center">
                <div className="mr-4">
                  <strong>{lead.business_name}</strong>
                  <p className="text-sm text-gray-300">Score: {lead.score}</p>
                </div>
                <div>
                  <p className="text-sm">{lead.phone}</p>
                  <p className="text-sm">{lead.category}</p>
                  <p className="text-sm">{lead.city}</p>
                  {lead.website ? (
                    <span className="text-sm text-green-300">Website: Active</span>
                  ) : (
                    <span className="text-sm text-red-300">Website: Inactive</span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => router.push(`/app/leads/${lead.id}`)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Lead
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
