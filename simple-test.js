const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function simpleTest() {
  console.log('🧪 Testing Supabase connection...\n');

  try {
    // Test table access
    const { data, error } = await supabase
      .from('applications')
      .select('count(*)', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Error:', error.message);
      console.log('💡 Make sure you created the table in Supabase dashboard');
      return;
    }

    console.log('✅ Supabase connection successful!');
    console.log(`📊 Current applications in database: ${data.count || 0}`);

    // Insert a simple test record
    const testData = {
      loan_type: 'business-loan',
      is_business_owner: 'yes',
      monthly_sales: '50000',
      has_existing_loans: 'no',
      business_name: 'Quick Test Company',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '555-0123',
      title: 'Owner',
      ssn_last_4: '0000',
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
      business_address: '123 Test St, Test City, TC 12345',
      business_phone: '555-0124',
      agrees_to_terms: true,
      authorizes_credit_check: true,
    };

    const { data: insertData, error: insertError } = await supabase
      .from('applications')
      .insert([testData])
      .select();

    if (insertError) {
      console.error('❌ Insert error:', insertError.message);
      return;
    }

    console.log('✅ Test record inserted successfully!');
    console.log(`📋 Application ID: ${insertData[0].id}`);
    console.log(`🏢 Business: ${insertData[0].business_name}`);
    console.log(`📧 Email: ${insertData[0].email}`);

    console.log('\n🎉 Supabase integration is working perfectly!');
    console.log(
      '🔗 View data: https://app.supabase.com/project/gtogvkaukyxxwvxenfit/editor'
    );
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

simpleTest();
