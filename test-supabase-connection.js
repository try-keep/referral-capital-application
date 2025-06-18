// Test direct Supabase table access
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection and table access...\n');
  
  try {
    // Test 1: Check applications table (we know this exists)
    console.log('1️⃣ Testing applications table access...');
    const { data: appData, error: appError } = await supabase
      .from('applications')
      .select('count(*)', { count: 'exact', head: true });
    
    if (appError) {
      console.log('❌ Applications table error:', appError.message);
      return;
    }
    
    console.log(`✅ Applications table accessible (${appData.count || 0} records)`);
    
    // Test 2: Check businesses table
    console.log('\n2️⃣ Testing businesses table access...');
    const { data: bizData, error: bizError } = await supabase
      .from('businesses')
      .select('count(*)', { count: 'exact', head: true });
    
    if (bizError) {
      console.log('❌ Businesses table error:', bizError.message);
      console.log('Full error details:', bizError);
      return;
    }
    
    console.log(`✅ Businesses table accessible (${bizData.count || 0} records)`);
    
    // Test 3: Try simple insert
    console.log('\n3️⃣ Testing simple business insert...');
    const testBusiness = {
      mras_id: 'TEST123',
      company_name: 'Test Company Ltd',
      search_query: 'test'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('businesses')
      .insert([testBusiness])
      .select();
    
    if (insertError) {
      console.log('❌ Insert error:', insertError.message);
      return;
    }
    
    console.log('✅ Test business inserted successfully:', insertData[0].id);
    
    // Test 4: Clean up test data
    await supabase
      .from('businesses')
      .delete()
      .eq('mras_id', 'TEST123');
    
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 Supabase connection working! Now testing full workflow...');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testSupabaseConnection();