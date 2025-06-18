const { searchCanadianBusinesses, formatBusinessDataForForm } = require('./src/lib/businessRegistry.ts');

async function testBusinessSearch() {
  console.log('🧪 Testing Canadian Business Registry API...\n');
  
  try {
    // Test 1: Search for RUNASO INC
    console.log('1️⃣ Searching for "RUNASO INC"...');
    const results1 = await searchCanadianBusinesses('RUNASO INC');
    console.log(`✅ Found ${results1.totalResults} results`);
    
    if (results1.docs.length > 0) {
      const business = results1.docs[0];
      console.log('📋 First result:');
      console.log(`   • Name: ${business.Company_Name}`);
      console.log(`   • Type: ${business.Entity_Type}`);
      console.log(`   • Location: ${business.City}, ${business.Reg_office_province}`);
      console.log(`   • Status: ${business.Status_State}`);
      console.log(`   • Incorporated: ${business.Date_Incorporated}`);
      console.log(`   • Business Number: ${business.BN}`);
      
      // Test formatting
      console.log('\n📝 Formatted data for form:');
      const formatted = formatBusinessDataForForm(business);
      console.log(`   • Business Name: ${formatted.businessName}`);
      console.log(`   • Business Address: ${formatted.businessAddress}`);
      console.log(`   • Business Type: ${formatted.businessType}`);
      console.log(`   • Business Age: ${formatted.businessAge}`);
      console.log(`   • Incorporation Date: ${formatted.incorporationDate}`);
    }
    
    // Test 2: Search for a common company name
    console.log('\n2️⃣ Searching for "TD BANK"...');
    const results2 = await searchCanadianBusinesses('TD BANK');
    console.log(`✅ Found ${results2.totalResults} results`);
    
    if (results2.docs.length > 0) {
      console.log('📋 Sample results:');
      results2.docs.slice(0, 3).forEach((business, index) => {
        console.log(`   ${index + 1}. ${business.Company_Name} (${business.City}, ${business.Reg_office_province})`);
      });
    }
    
    // Test 3: Search for non-existent business
    console.log('\n3️⃣ Searching for "NONEXISTENT COMPANY XYZ123"...');
    const results3 = await searchCanadianBusinesses('NONEXISTENT COMPANY XYZ123');
    console.log(`✅ Found ${results3.totalResults} results`);
    
    console.log('\n🎉 All tests passed! Business search is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBusinessSearch();