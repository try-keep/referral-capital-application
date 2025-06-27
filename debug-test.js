const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Debug: Environment variables loaded');
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing');
console.log(
  'Key:',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function debugTest() {
  console.log('\n🧪 Debug Test Starting...\n');

  try {
    console.log('1. Testing basic Supabase connection...');
    const { data: authData, error: authError } =
      await supabase.auth.getSession();
    console.log('Auth test result:', authError ? authError.message : 'OK');

    console.log('\n2. Testing table query...');
    const { data, error, count } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log('❌ Query Error Details:');
      console.log('Message:', error.message);
      console.log('Details:', error.details);
      console.log('Hint:', error.hint);
      console.log('Code:', error.code);

      if (
        error.message.includes('permission denied') ||
        error.message.includes('RLS')
      ) {
        console.log('\n💡 This looks like a Row Level Security (RLS) issue');
        console.log('Try running this in Supabase SQL Editor:');
        console.log('ALTER TABLE applications DISABLE ROW LEVEL SECURITY;');
      }

      return;
    }

    console.log('✅ Table access successful!');
    console.log('Row count:', count);

    console.log('\n3. Testing insert...');
    const testData = {
      loan_type: 'business-loan',
      is_business_owner: 'yes',
      monthly_sales: '50000',
      has_existing_loans: 'no',
      business_name: 'Debug Test Company',
      first_name: 'Debug',
      last_name: 'User',
      email: 'debug@test.com',
      phone: '555-DEBUG',
      title: 'Tester',
      ssn_last_4: '9999',
      funding_amount: '100000',
      funding_timeline: 'within-30-days',
      funding_purpose: 'working-capital',
      business_type: 'technology',
      business_age: '1-2-years',
      number_of_employees: 'just-me',
      annual_revenue: '200000',
      cash_flow: '15000',
      credit_score: 'good',
      time_in_business: '1 year 6 months',
      bank_connection_completed: false,
      skipped_bank_connection: true,
      business_address: '123 Debug St, Debug City, DC 12345',
      business_phone: '555-DEBUG-2',
      agrees_to_terms: true,
      authorizes_credit_check: true,
    };

    const { data: insertData, error: insertError } = await supabase
      .from('applications')
      .insert([testData])
      .select();

    if (insertError) {
      console.log('❌ Insert Error Details:');
      console.log('Message:', insertError.message);
      console.log('Details:', insertError.details);
      console.log('Hint:', insertError.hint);
      return;
    }

    console.log('✅ Insert successful!');
    console.log('Inserted ID:', insertData[0].id);
    console.log('Business Name:', insertData[0].business_name);

    console.log('\n🎉 All tests passed! Supabase integration is working!');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

debugTest();
