import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export function SchemaInspector() {
  const [schemaInfo, setSchemaInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/featured-deals/inspect`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Featured Deals Schema Info:', data);
        setSchemaInfo(data);
      } catch (err) {
        console.error('Error fetching schema:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSchema();
  }, []);

  if (loading) {
    return (
      <div className="p-8 bg-yellow-50 border-2 border-yellow-500 rounded-lg">
        <p className="text-yellow-800 font-semibold">Loading schema information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border-2 border-red-500 rounded-lg">
        <p className="text-red-800 font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-blue-50 border-2 border-blue-500 rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-blue-900">
        Database Schema Inspector
      </h2>
      
      {/* Stores Table */}
      <div className="bg-white p-4 rounded-lg border border-blue-300">
        <h3 className="text-xl font-semibold text-blue-800 mb-3">Stores Table</h3>
        {schemaInfo?.storesTable?.error ? (
          <p className="text-red-600">{schemaInfo.storesTable.error}</p>
        ) : (
          <>
            <div className="mb-3">
              <p className="font-semibold text-blue-700 mb-2">Columns:</p>
              <div className="flex flex-wrap gap-2">
                {schemaInfo?.storesTable?.columns?.map((col: string) => (
                  <span key={col} className="bg-green-100 text-green-900 px-3 py-1 rounded text-sm">
                    {col}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-blue-700 mb-2">Sample Data:</p>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(schemaInfo?.storesTable?.sampleData, null, 2)}
              </pre>
            </div>
          </>
        )}
      </div>

      {/* Deals Table */}
      <div className="bg-white p-4 rounded-lg border border-blue-300">
        <h3 className="text-xl font-semibold text-blue-800 mb-3">Deals Table</h3>
        {schemaInfo?.dealsTable?.error ? (
          <p className="text-red-600">{schemaInfo.dealsTable.error}</p>
        ) : (
          <>
            <div className="mb-3">
              <p className="font-semibold text-blue-700 mb-2">Columns:</p>
              <div className="flex flex-wrap gap-2">
                {schemaInfo?.dealsTable?.columns?.map((col: string) => (
                  <span key={col} className="bg-blue-100 text-blue-900 px-3 py-1 rounded text-sm">
                    {col}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-blue-700 mb-2">Sample Data:</p>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(schemaInfo?.dealsTable?.sampleData, null, 2)}
              </pre>
            </div>
          </>
        )}
      </div>

      {/* Categories Table */}
      <div className="bg-white p-4 rounded-lg border border-blue-300">
        <h3 className="text-xl font-semibold text-blue-800 mb-3">Categories Table</h3>
        {schemaInfo?.categoriesTable?.error ? (
          <p className="text-red-600">{schemaInfo.categoriesTable.error}</p>
        ) : (
          <>
            <div className="mb-3">
              <p className="font-semibold text-blue-700 mb-2">Columns:</p>
              <div className="flex flex-wrap gap-2">
                {schemaInfo?.categoriesTable?.columns?.map((col: string) => (
                  <span key={col} className="bg-purple-100 text-purple-900 px-3 py-1 rounded text-sm">
                    {col}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-blue-700 mb-2">Sample Data:</p>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(schemaInfo?.categoriesTable?.sampleData, null, 2)}
              </pre>
            </div>
          </>
        )}
      </div>

      {/* Countries Table */}
      <div className="bg-white p-4 rounded-lg border border-blue-300">
        <h3 className="text-xl font-semibold text-blue-800 mb-3">Countries Table</h3>
        {schemaInfo?.countriesTable?.error ? (
          <p className="text-red-600">{schemaInfo.countriesTable.error}</p>
        ) : (
          <>
            <div className="mb-3">
              <p className="font-semibold text-blue-700 mb-2">
                Total Countries: {schemaInfo?.countriesTable?.rowCount || 0}
              </p>
              <p className="font-semibold text-blue-700 mb-2">Columns:</p>
              <div className="flex flex-wrap gap-2">
                {schemaInfo?.countriesTable?.columns?.map((col: string) => (
                  <span key={col} className="bg-orange-100 text-orange-900 px-3 py-1 rounded text-sm">
                    {col}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-blue-700 mb-2">All Countries Data:</p>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-96">
                {JSON.stringify(schemaInfo?.countriesTable?.sampleData, null, 2)}
              </pre>
            </div>
          </>
        )}
      </div>

      {/* Featured Deals with Join */}
      <div className="bg-white p-4 rounded-lg border border-blue-300">
        <h3 className="text-xl font-semibold text-blue-800 mb-3">
          Featured Deals (with JOIN to deals + stores)
        </h3>
        {schemaInfo?.featuredDealsJoined?.error ? (
          <p className="text-red-600">{schemaInfo.featuredDealsJoined.error}</p>
        ) : (
          <>
            <div className="mb-3">
              <p className="font-semibold text-blue-700">
                Active Featured Deals Count: {schemaInfo?.featuredDealsJoined?.rowCount || 0}
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-700 mb-2">Fully Joined Data:</p>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-96">
                {JSON.stringify(schemaInfo?.featuredDealsJoined?.sampleData, null, 2)}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
