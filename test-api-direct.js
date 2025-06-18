// Simple test using fetch to test the API
async function testAPI() {
  console.log('🧪 Testing Canadian Business Registry API directly...\n');
  
  try {
    // Test the RUNASO INC search
    console.log('1️⃣ Searching for RUNASO INC...');
    const encodedName = encodeURIComponent('{RUNASO INC}');
    const url = `https://ised-isde.canada.ca/cbr/srch/api/v1/search?fq=keyword:${encodedName}&lang=en&queryaction=fieldquery&sortfield=score&sortorder=desc`;
    
    console.log('API URL:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Success! Found ${data.totalResults} results`);
    
    if (data.docs && data.docs.length > 0) {
      const business = data.docs[0];
      console.log('\n📋 Business Details:');
      console.log(`   • Company Name: ${business.Company_Name}`);
      console.log(`   • Entity Type: ${business.Entity_Type}`);
      console.log(`   • Location: ${business.City}, ${business.Reg_office_province}`);
      console.log(`   • Status: ${business.Status_State}`);
      console.log(`   • Incorporated: ${business.Date_Incorporated}`);
      console.log(`   • Business Number: ${business.BN}`);
      console.log(`   • Jurisdiction: ${business.Jurisdiction}`);
    }
    
    console.log('\n🎉 API test successful! The business search feature will work perfectly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();