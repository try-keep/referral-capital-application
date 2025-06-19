#!/usr/bin/env node

/**
 * Test script specifically for trykeep.com compliance check
 * This will help debug the exact issue with the website compliance API
 */

const BASE_URL = 'http://localhost:3009';

async function testTryKeepCompliance() {
  console.log('🧪 Testing trykeep.com Website Compliance Check');
  console.log('================================================\n');

  // Test data that matches what the form sends
  const testData = {
    businessWebsite: 'trykeep.com',
    businessName: 'Keep',
    applicationId: '123'
  };

  console.log('1. Testing direct API call to /api/compliance/website-check');
  console.log('Request data:', JSON.stringify(testData, null, 2));
  console.log('');

  try {
    const response = await fetch(`${BASE_URL}/api/compliance/website-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    try {
      const responseJson = JSON.parse(responseText);
      console.log('Parsed response:', JSON.stringify(responseJson, null, 2));
      
      if (responseJson.success) {
        console.log('\n✅ SUCCESS! Compliance check completed');
        console.log(`Risk Score: ${responseJson.riskScore}`);
        if (responseJson.metadata) {
          console.log(`Website Title: ${responseJson.metadata.title || 'N/A'}`);
          console.log(`Website Accessible: ${responseJson.metadata.success ? 'Yes' : 'No'}`);
          console.log(`Phone Numbers Found: ${responseJson.metadata.phone_numbers?.length || 0}`);
          console.log(`Emails Found: ${responseJson.metadata.emails?.length || 0}`);
          console.log(`Social Media Platforms: ${Object.keys(responseJson.metadata.social_media_links || {}).length}`);
        }
      } else {
        console.log('\n❌ FAILED! Error in response');
        console.log('Error:', responseJson.error);
        if (responseJson.details) {
          console.log('Details:', responseJson.details);
        }
      }
    } catch (parseError) {
      console.log('\n❌ FAILED! Could not parse JSON response');
      console.log('Parse error:', parseError.message);
    }

  } catch (fetchError) {
    console.log('\n💥 NETWORK ERROR!');
    console.log('Fetch error:', fetchError.message);
    console.log('');
    console.log('Possible issues:');
    console.log('- Is the dev server running? (npm run dev)');
    console.log('- Is it running on port 3009?');
    console.log('- Check the server console for errors');
  }

  console.log('\n' + '='.repeat(50));
  
  // Test 2: Check debug endpoint
  console.log('\n2. Testing environment variables via debug endpoint');
  
  try {
    const debugResponse = await fetch(`${BASE_URL}/api/debug`);
    const debugData = await debugResponse.json();
    
    console.log('Environment check:', debugData.env_check);
    
    const missingKeys = [];
    if (!debugData.env_check.supabase_service_key) missingKeys.push('SUPABASE_SERVICE_ROLE_KEY');
    if (!debugData.env_check.openai_key) missingKeys.push('OPENAI_API_KEY');
    if (!debugData.env_check.newsapi_key) missingKeys.push('NEWSAPI_KEY');
    
    if (missingKeys.length > 0) {
      console.log('\n⚠️  Missing environment variables:');
      missingKeys.forEach(key => console.log(`   - ${key}`));
      console.log('\nNote: Website scraping should still work without these keys');
    } else {
      console.log('\n✅ All environment variables are configured');
    }
    
  } catch (debugError) {
    console.log('Debug endpoint error:', debugError.message);
  }

  // Test 3: Test website scraping directly
  console.log('\n3. Testing website scraping function directly');
  
  try {
    const scrapingResponse = await fetch(`${BASE_URL}/api/debug`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: 'trykeep.com' })
    });
    
    const scrapingData = await scrapingResponse.json();
    
    if (scrapingData.success) {
      console.log('✅ Direct scraping works!');
      console.log('Result:', JSON.stringify(scrapingData.result, null, 2));
    } else {
      console.log('❌ Direct scraping failed');
      console.log('Error:', scrapingData.error);
    }
    
  } catch (scrapingError) {
    console.log('Direct scraping test error:', scrapingError.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n📋 Summary:');
  console.log('- If test 1 ✅: The compliance API is working correctly');
  console.log('- If test 1 ❌: Check server console for detailed error logs');
  console.log('- Missing env vars are OK for basic website scraping');
  console.log('- The form should trigger this same API call on Step 10');
  
  console.log('\n🔧 To test in the actual form:');
  console.log('1. Go to http://localhost:3009/step/1');
  console.log('2. Fill out steps 1-9');
  console.log('3. On Step 10, enter "trykeep.com" in website field');
  console.log('4. Click Continue and check browser console');
  console.log('5. Look for POST to /api/compliance/website-check');
}

// Helper to test the exact form submission flow
async function testFormSubmissionFlow() {
  console.log('\n🎯 Testing Form Submission Flow Simulation');
  console.log('==========================================\n');
  
  // This simulates what happens when user completes Step 10
  const formData = {
    businessType: 'technology',
    businessAge: '2-5-years', 
    numberOfEmployees: '2-5',
    websiteUrl: 'trykeep.com'
  };
  
  const applicationId = '999'; // Test application ID
  const businessName = 'Keep'; // Would come from earlier form steps
  
  console.log('Simulating Step 10 form submission...');
  console.log('Form data:', formData);
  console.log('Business name (from earlier steps):', businessName);
  console.log('Application ID:', applicationId);
  console.log('');
  
  // This is the exact call made by the form
  const complianceCall = {
    businessWebsite: formData.websiteUrl,
    businessName: businessName,
    applicationId: applicationId
  };
  
  console.log('Compliance API call payload:');
  console.log(JSON.stringify(complianceCall, null, 2));
  console.log('');
  
  try {
    const response = await fetch(`${BASE_URL}/api/compliance/website-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complianceCall)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Form submission flow would succeed!');
      console.log('Response:', JSON.stringify(result, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Form submission flow would fail!');
      console.log('Status:', response.status);
      console.log('Error:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Form submission flow would fail!');
    console.log('Error:', error.message);
  }
}

// Run both tests
async function runAllTests() {
  await testTryKeepCompliance();
  await testFormSubmissionFlow();
}

// Run if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testTryKeepCompliance, testFormSubmissionFlow };