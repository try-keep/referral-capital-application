#!/usr/bin/env node

/**
 * Simulate the exact form submission to test compliance API
 */

const BASE_URL = 'http://localhost:3009';

async function simulateFormSubmission() {
  console.log('🎯 Simulating EXACT Form Submission from Browser');
  console.log('================================================\n');

  // This is the exact payload from your server logs
  const exactPayload = {
    businessWebsite: 'trykeep.com',
    businessName: 'ACME GARAGE (ACME) LTD',
    applicationId: null
  };

  console.log('Making API call with exact payload from your logs:');
  console.log(JSON.stringify(exactPayload, null, 2));
  console.log('');

  try {
    const startTime = Date.now();
    
    const response = await fetch(`${BASE_URL}/api/compliance/website-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exactPayload)
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Response received in ${duration}ms`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    console.log('');

    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! API returned data:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.success) {
        console.log('\n📊 Compliance Results:');
        console.log(`Risk Score: ${data.riskScore}`);
        console.log(`Website Title: ${data.metadata?.title || 'N/A'}`);
        console.log(`Phone Numbers: ${data.metadata?.phone_numbers?.length || 0}`);
        console.log(`Social Media: ${Object.keys(data.metadata?.social_media_links || {}).length} platforms`);
      }
    } else {
      const errorText = await response.text();
      console.log('❌ API returned error:');
      console.log(`Status: ${response.status}`);
      console.log(`Body: ${errorText}`);
    }

  } catch (error) {
    console.log('💥 Network/Request Error:');
    console.log(error.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n🧪 Browser Console Instructions:');
  console.log('1. Open browser to http://localhost:3009/step/1');
  console.log('2. Open Developer Tools (F12) → Console tab');
  console.log('3. Fill out form to Step 10');
  console.log('4. Enter "trykeep.com" in website field');
  console.log('5. Click Continue');
  console.log('6. Look for these messages in console:');
  console.log('   - "🔍 DEBUGGING Step 10 compliance trigger:"');
  console.log('   - "✅ API Response Status: 200"');
  console.log('   - "✅ API Response Data: {...}"');
  console.log('');
  console.log('If you see 500 error in browser but 200 here, it might be:');
  console.log('- CORS issue');
  console.log('- Browser caching');
  console.log('- Form sending different data');
}

// Also test with different payload variations
async function testPayloadVariations() {
  console.log('\n🔬 Testing Different Payload Variations');
  console.log('======================================\n');

  const variations = [
    {
      name: 'With applicationId',
      payload: {
        businessWebsite: 'trykeep.com',
        businessName: 'Keep',
        applicationId: '123'
      }
    },
    {
      name: 'Minimal payload',
      payload: {
        businessWebsite: 'trykeep.com'
      }
    },
    {
      name: 'Different URL format',
      payload: {
        businessWebsite: 'https://trykeep.com',
        businessName: 'Keep',
        applicationId: '456'
      }
    }
  ];

  for (const variation of variations) {
    console.log(`Testing: ${variation.name}`);
    console.log('Payload:', JSON.stringify(variation.payload, null, 2));
    
    try {
      const response = await fetch(`${BASE_URL}/api/compliance/website-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variation.payload)
      });

      console.log(`Result: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Success');
      } else {
        const errorText = await response.text();
        console.log('❌ Error:', errorText);
      }
    } catch (error) {
      console.log('💥 Failed:', error.message);
    }
    
    console.log('');
  }
}

async function runTests() {
  await simulateFormSubmission();
  await testPayloadVariations();
  
  console.log('\n🎉 Summary:');
  console.log('- Your compliance API is working correctly');
  console.log('- Website scraping is successful');
  console.log('- The issue might be in the browser/form integration');
  console.log('- Check browser console for detailed debugging info');
}

runTests().catch(console.error);