'use client';

import { useState } from 'react';

export default function TestAPIPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testWebsiteAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const testData = {
      businessWebsite: 'trykeep.com',
      businessName: 'Test Company',
      applicationId: '123',
    };

    console.log('🧪 Testing website compliance API...');
    console.log('Request data:', testData);

    try {
      const response = await fetch('/api/compliance/website-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      console.log('Response status:', response.status);
      console.log(
        'Response headers:',
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Success! Response data:', data);
      setResult(data);
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testAdverseMediaAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const testData = {
      businessName: 'Microsoft',
      businessWebsite: 'microsoft.com',
      applicationId: '123',
    };

    console.log('🧪 Testing adverse media API...');
    console.log('Request data:', testData);

    try {
      const response = await fetch('/api/compliance/adverse-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Success! Response data:', data);
      setResult(data);
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testAICategorizationAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const testData = {
      businessName: 'ABC Restaurant',
      applicationId: '123',
    };

    console.log('🧪 Testing AI categorization API...');
    console.log('Request data:', testData);

    try {
      const response = await fetch('/api/compliance/ai-categorization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Success! Response data:', data);
      setResult(data);
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Compliance API Test Page
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold text-gray-800">
              Test Compliance APIs
            </h2>
            <p className="text-gray-600">
              Click the buttons below to test each compliance API endpoint.
              Check the browser console for detailed logs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={testWebsiteAPI}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Testing...' : 'Test Website Check'}
            </button>

            <button
              onClick={testAdverseMediaAPI}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Testing...' : 'Test Adverse Media'}
            </button>

            <button
              onClick={testAICategorizationAPI}
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Testing...' : 'Test AI Categorization'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h3 className="text-red-800 font-semibold">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-800 font-semibold mb-2">
                Success! API Response:
              </h3>
              <pre className="text-sm text-green-700 bg-green-100 p-3 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside text-gray-600 space-y-1">
              <li>Open browser Developer Tools (F12) → Console tab</li>
              <li>Click any test button above</li>
              <li>Watch console for detailed request/response logs</li>
              <li>Results will appear below the buttons</li>
              <li>If you see errors, check the console for details</li>
            </ol>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              Expected Results:
            </h3>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>
                <strong>Website Check:</strong> Should return success with
                metadata for trykeep.com
              </li>
              <li>
                <strong>Adverse Media:</strong> Might fail without NEWSAPI_KEY
                environment variable
              </li>
              <li>
                <strong>AI Categorization:</strong> Might fail without
                OPENAI_API_KEY environment variable
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
