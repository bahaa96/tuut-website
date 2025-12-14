'use client';

import { useState } from 'react';

export default function SitemapTriggerPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerWebhook = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/webhook/regenerate-sitemap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // You should secure this with a proper auth system in production
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_WEBHOOK_SECRET || 'dev-secret'}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to trigger webhook');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Sitemap Regeneration
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Trigger Sitemap Update
          </h2>
          <p className="text-gray-600 mb-6">
            Click the button below to regenerate the sitemap, trigger a deployment,
            and submit it to Google Search Console.
          </p>

          <button
            onClick={triggerWebhook}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              'Regenerate Sitemap'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Success!</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Duration:</span>{' '}
                <span className="text-gray-600">{result.duration}</span>
              </div>

              <div>
                <span className="font-medium text-gray-700">Steps:</span>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span>Sitemap Generated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span>Deployment Triggered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span>Submitted to Google Search Console</span>
                  </div>
                </div>
              </div>

              {result.deployment && (
                <div>
                  <span className="font-medium text-gray-700">Deployment:</span>
                  <a
                    href={result.deployment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:underline"
                  >
                    {result.deployment.url}
                  </a>
                </div>
              )}

              <div>
                <span className="font-medium text-gray-700">Timestamp:</span>{' '}
                <span className="text-gray-600">
                  {new Date(result.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">API Documentation</h3>
          <p className="text-blue-700 mb-2">
            You can also trigger this webhook programmatically:
          </p>
          <code className="block bg-gray-900 text-gray-100 p-4 rounded text-sm">
            {`curl -X POST https://tuut.shop/api/webhook/regenerate-sitemap \\
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET"`}
          </code>
        </div>
      </div>
    </div>
  );
}