const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔧 Testing user creation...');
console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUserCreation() {
  try {
    // First check if users table exists by trying to query it
    console.log('🔍 Checking if users table exists...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
      
    if (tableError) {
      console.error('❌ Users table error:', tableError);
      if (tableError.code === '42P01') {
        console.log('❌ Users table does not exist. Need to create it first.');
        return;
      }
    } else {
      console.log('✅ Users table exists and is accessible');
    }
    
    // Test creating a user
    console.log('🧪 Testing user creation...');
    const testUser = {
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
    
    const { data, error } = await supabase
      .from('users')
      .insert([testUser])
      .select();
      
    if (error) {
      console.error('❌ Error creating test user:', error);
    } else {
      console.log('✅ Test user created successfully:', data[0]);
      
      // Clean up - delete the test user
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', data[0].id);
        
      if (deleteError) {
        console.warn('⚠️ Could not delete test user:', deleteError);
      } else {
        console.log('🧹 Test user cleaned up');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testUserCreation();