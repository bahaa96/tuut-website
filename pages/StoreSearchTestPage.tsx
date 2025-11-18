import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function StoreSearchTestPage() {
  const [searchTerm, setSearchTerm] = useState('noon');
  const [results, setResults] = useState<any[]>([]);
  const [allStores, setAllStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fieldNames, setFieldNames] = useState<string[]>([]);

  useEffect(() => {
    loadAllStores();
  }, []);

  const loadAllStores = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .limit(100);
    
    if (data && data.length > 0) {
      setAllStores(data);
      setFieldNames(Object.keys(data[0]));
      console.log('All stores loaded:', data.length);
      console.log('Field names:', Object.keys(data[0]));
    }
    
    if (error) {
      console.error('Error loading stores:', error);
    }
  };

  const runSearch = async () => {
    setLoading(true);
    const supabase = createClient();
    
    console.log('Searching for:', searchTerm);
    
    // Determine which fields exist
    const potentialSearchFields = [
      'store_name',
      'name', 
      'title',
      'description',
      'store_name_ar',
      'name_ar',
      'title_ar',
      'description_ar'
    ];
    
    const existingSearchFields = fieldNames.length > 0
      ? potentialSearchFields.filter(field => fieldNames.includes(field))
      : ['name', 'description']; // fallback
    
    console.log('Existing searchable fields:', existingSearchFields);
    
    const orCondition = existingSearchFields
      .map(field => `${field}.ilike.%${searchTerm}%`)
      .join(',');
    
    // Try multiple search strategies
    const strategies = [
      // Strategy 1: Search all existing text fields
      {
        name: 'All fields OR search',
        query: supabase
          .from('stores')
          .select('*')
          .or(orCondition)
          .limit(10)
      },
      // Add individual field strategies only for fields that exist
      ...existingSearchFields.slice(0, 3).map(field => ({
        name: `${field} only`,
        query: supabase
          .from('stores')
          .select('*')
          .ilike(field, `%${searchTerm}%`)
          .limit(10)
      }))
    ];
    
    for (const strategy of strategies) {
      const { data, error } = await strategy.query;
      console.log(`${strategy.name}: ${data?.length || 0} results`, error || '');
      if (data && data.length > 0) {
        console.log('Results:', data);
      }
    }
    
    // Use the first strategy for display
    const { data, error } = await strategies[0].query;
    setResults(data || []);
    setLoading(false);
    
    if (error) {
      console.error('Search error:', error);
    }
  };

  // Find stores that contain the search term in ANY field
  const manualMatches = allStores.filter(store => {
    const searchLower = searchTerm.toLowerCase();
    return Object.entries(store).some(([key, value]) => {
      if (typeof value === 'string' && value.toLowerCase().includes(searchLower)) {
        console.log(`Match found in field "${key}": "${value}"`);
        return true;
      }
      return false;
    });
  });

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Store Search Diagnostic Tool</h1>
        
        <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Database Info</h2>
          <p><strong>Total Stores:</strong> {allStores.length}</p>
          <p><strong>Field Names:</strong> {fieldNames.join(', ')}</p>
        </div>

        <div className="mb-8">
          <div className="flex gap-4">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter search term..."
              className="flex-1"
            />
            <Button onClick={runSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button onClick={loadAllStores} variant="outline">
              Reload Stores
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Manual Match (checking all fields): {manualMatches.length} stores
          </h2>
          {manualMatches.length > 0 ? (
            <div className="space-y-4">
              {manualMatches.map((store) => (
                <div key={store.id} className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <h3 className="font-semibold">Store ID: {store.id}</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    {Object.entries(store).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {String(value)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No stores found containing "{searchTerm}"</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Database Search Results: {results.length} stores
          </h2>
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((store) => (
                <div key={store.id} className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                  <h3 className="font-semibold">
                    {store.store_name || store.name || store.title || 'Unnamed Store'}
                  </h3>
                  <p className="text-sm text-gray-600">ID: {store.id}</p>
                  <p className="text-sm text-gray-600">Country ID: {store.country_id}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No results from database search</p>
          )}
        </div>
      </div>
    </div>
  );
}
