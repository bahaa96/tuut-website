import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export default function TranslationsInspectorPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/translations/inspect`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Translations table data:', result);
        setData(result);
      } catch (err) {
        console.error('Error fetching translations:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8F3E8] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <p className="text-gray-600">Loading translations table schema...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#E8F3E8] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 p-8 rounded-xl border-2 border-red-500">
            <h2 className="text-red-800 mb-4">Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8F3E8] p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl text-gray-900 mb-6">Translations Table Inspector</h1>

        {/* Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl text-gray-900 mb-4">Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600">Status:</span>{' '}
              <span className={data.success ? 'text-green-600' : 'text-red-600'}>
                {data.success ? 'Success' : 'Error'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Row Count:</span>{' '}
              <span className="text-gray-900">{data.rowCount || 0}</span>
            </div>
          </div>
          {data.error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-red-800 font-semibold">Error:</p>
              <p className="text-red-700">{data.error}</p>
            </div>
          )}
        </div>

        {/* Columns */}
        {data.columns && data.columns.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl text-gray-900 mb-4">Columns</h2>
            <div className="flex flex-wrap gap-2">
              {data.columns.map((col: string) => (
                <span 
                  key={col} 
                  className="bg-green-100 text-green-900 px-3 py-1 rounded-lg text-sm"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sample Data */}
        {data.sampleData && data.sampleData.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl text-gray-900 mb-4">Sample Data ({data.sampleData.length} rows)</h2>
            <div className="overflow-x-auto">
              <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-[600px]">
                {JSON.stringify(data.sampleData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Error Details */}
        {data.errorDetails && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl text-gray-900 mb-4">Error Details</h2>
            <pre className="bg-red-50 p-4 rounded-lg text-xs overflow-auto">
              {JSON.stringify(data.errorDetails, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
