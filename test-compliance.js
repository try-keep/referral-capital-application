#!/usr/bin/env node

/**
 * Compliance System Test Suite
 * Tests the background compliance checking functionality
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3009';

// Test data
const testCases = {
  website: {
    valid: [
      { url: 'google.com', businessName: 'Google Inc' },
      { url: 'microsoft.com', businessName: 'Microsoft Corporation' },
      { url: 'apple.com', businessName: 'Apple Inc' },
    ],
    invalid: [
      { url: 'nonexistentwebsite12345.com', businessName: 'Fake Business' },
      { url: 'invalid-url', businessName: 'Invalid URL Test' },
    ],
  },
  aiCategorization: [
    { businessName: 'ABC Restaurant', expectedCategory: 'Food and Beverage' },
    {
      businessName: 'TechSoft Solutions',
      expectedCategory: 'Technology and Software',
    },
    {
      businessName: 'Green Construction LLC',
      expectedCategory: 'Construction and Real Estate',
    },
    {
      businessName: 'Bitcoin Trading Platform',
      expectedCategory: 'Cryptocurrency',
    }, // High-risk
  ],
  adverseMedia: [
    { businessName: 'Microsoft', expectedRisk: 'low' },
    { businessName: 'ABC Small Business', expectedRisk: 'low' },
    { businessName: 'Enron', expectedRisk: 'high' }, // Historical scandal
  ],
};

// Helper function to make API calls
async function apiCall(endpoint, data) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

// Helper function to get compliance results
async function getComplianceResults() {
  try {
    const response = await fetch(`${BASE_URL}/api/test-compliance`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

// Test website compliance checking
async function testWebsiteCompliance() {
  console.log('🌐 Testing Website Compliance Checks...\n');

  for (const testCase of testCases.website.valid) {
    console.log(`Testing: ${testCase.url}`);

    const result = await apiCall('/api/test-compliance', {
      type: 'website',
      websiteUrl: testCase.url,
      businessName: testCase.businessName,
    });

    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
    } else if (result.success) {
      console.log(`✅ Success: Risk score ${result.result.riskScore || 'N/A'}`);
      if (result.result.metadata) {
        console.log(`   Title: ${result.result.metadata.title || 'N/A'}`);
        console.log(
          `   Emails found: ${result.result.metadata.emails?.length || 0}`
        );
        console.log(
          `   Social media: ${Object.keys(result.result.metadata.social_media_links || {}).length} platforms`
        );
      }
    } else {
      console.log(`❓ Unexpected response: ${JSON.stringify(result)}`);
    }
    console.log('');
  }

  // Test invalid URLs
  console.log('Testing invalid URLs...');
  for (const testCase of testCases.website.invalid) {
    console.log(`Testing: ${testCase.url}`);

    const result = await apiCall('/api/test-compliance', {
      type: 'website',
      websiteUrl: testCase.url,
      businessName: testCase.businessName,
    });

    if (result.error) {
      console.log(`❌ Expected error: ${result.error}`);
    } else {
      console.log(`⚠️  Unexpected success for invalid URL`);
    }
    console.log('');
  }
}

// Test AI categorization
async function testAICategorization() {
  console.log('🤖 Testing AI Business Categorization...\n');

  for (const testCase of testCases.aiCategorization) {
    console.log(`Testing: ${testCase.businessName}`);

    const result = await apiCall('/api/test-compliance', {
      type: 'categorization',
      businessName: testCase.businessName,
    });

    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
    } else if (result.success && result.result?.result) {
      const aiResult = result.result.result;
      console.log(
        `✅ Success: ${aiResult.category} (confidence: ${aiResult.confidence_score})`
      );
      console.log(`   Summary: ${aiResult.summary}`);
      if (aiResult.high_risk_similarity > 0) {
        console.log(
          `   ⚠️  High-risk similarity: ${aiResult.high_risk_similarity}`
        );
      }
    } else {
      console.log(`❓ Unexpected response: ${JSON.stringify(result)}`);
    }
    console.log('');
  }
}

// Test adverse media checking
async function testAdverseMedia() {
  console.log('📰 Testing Adverse Media Checks...\n');

  for (const testCase of testCases.adverseMedia) {
    console.log(`Testing: ${testCase.businessName}`);

    const result = await apiCall('/api/test-compliance', {
      type: 'adverse-media',
      businessName: testCase.businessName,
    });

    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
    } else if (result.success && result.result?.result) {
      const mediaResult = result.result.result;
      console.log(`✅ Success: ${mediaResult.articles_found} articles found`);
      console.log(
        `   Overall sentiment: ${mediaResult.overall_sentiment_score} (${mediaResult.risk_level} risk)`
      );
      if (mediaResult.articles.length > 0) {
        console.log(`   Sample article: ${mediaResult.articles[0].title}`);
      }
    } else {
      console.log(`❓ Unexpected response: ${JSON.stringify(result)}`);
    }
    console.log('');
  }
}

// Test compliance results retrieval
async function testComplianceResults() {
  console.log('📊 Testing Compliance Results Retrieval...\n');

  const results = await getComplianceResults();

  if (results.error) {
    console.log(`❌ Error getting results: ${results.error}`);
  } else if (results.success) {
    console.log(`✅ Found ${results.total} compliance checks in database`);

    if (results.checks && results.checks.length > 0) {
      console.log('\nRecent checks:');
      results.checks.slice(0, 5).forEach((check, index) => {
        console.log(
          `${index + 1}. Type: ${check.check_type}, Status: ${check.status}, Risk: ${check.risk_score || 'N/A'}`
        );
      });
    }
  } else {
    console.log(`❓ Unexpected response: ${JSON.stringify(results)}`);
  }
  console.log('');
}

// Test environment variables
async function testEnvironment() {
  console.log('🔧 Testing Environment Configuration...\n');

  const requiredEnvVars = [
    'NEWSAPI_KEY',
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  // Note: We can't directly access env vars from client-side,
  // but we can test if the APIs fail due to missing keys

  console.log('Testing if APIs have required environment variables...');

  // Test with a simple business name
  const testResult = await apiCall('/api/test-compliance', {
    type: 'categorization',
    businessName: 'Test Business',
  });

  if (testResult.error && testResult.error.includes('API key')) {
    console.log('❌ Missing API keys detected');
  } else if (testResult.success) {
    console.log('✅ Environment variables appear to be configured');
  } else {
    console.log('⚠️  Unknown environment status');
  }
  console.log('');
}

// Main test runner
async function runTests() {
  console.log('🧪 Compliance System Test Suite');
  console.log('================================\n');
  console.log(`Testing against: ${BASE_URL}\n`);

  try {
    await testEnvironment();
    await testWebsiteCompliance();
    await testAICategorization();
    await testAdverseMedia();
    await testComplianceResults();

    console.log('🎉 Test suite completed!');
    console.log('\nTo run individual tests:');
    console.log(
      '- Website: curl -X POST ' +
        BASE_URL +
        '/api/test-compliance -H "Content-Type: application/json" -d \'{"type": "website", "websiteUrl": "google.com", "businessName": "Google"}\''
    );
    console.log(
      '- AI: curl -X POST ' +
        BASE_URL +
        '/api/test-compliance -H "Content-Type: application/json" -d \'{"type": "categorization", "businessName": "ABC Restaurant"}\''
    );
    console.log(
      '- Media: curl -X POST ' +
        BASE_URL +
        '/api/test-compliance -H "Content-Type: application/json" -d \'{"type": "adverse-media", "businessName": "Microsoft"}\''
    );
    console.log('- Results: curl ' + BASE_URL + '/api/test-compliance');
  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  runTests,
  testWebsiteCompliance,
  testAICategorization,
  testAdverseMedia,
  testComplianceResults,
};
