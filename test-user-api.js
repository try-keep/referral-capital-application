const fetch = require('node-fetch');

async function testUserAPI() {
  console.log('🧪 Testing user creation API...');
  
  const userData = {
    first_name: 'Test',
    last_name: 'User',
    email: `test-${Date.now()}@example.com`,
    phone: '555-123-4567',
    role_in_business: 'Owner',
    ownership_percentage: 100,
    source: 'test',
    email_marketing_consent: true,
    sms_marketing_consent: false,
    ip_address: '127.0.0.1',
    user_agent: 'Test User Agent'
  };
  
  try {
    const response = await fetch('http://localhost:3000/api/users/upsert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userData })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ User API test successful:', result);
    } else {
      console.error('❌ User API test failed:', result);
    }
    
  } catch (error) {
    console.error('❌ API request failed:', error.message);
    console.log('💡 Make sure to run "npm run dev" first to start the development server');
  }
}

testUserAPI();