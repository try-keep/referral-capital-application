const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test application data - simulating a complete form submission
const testApplicationData = {
  // Step 1: Loan Type
  loan_type: 'business-loan',
  
  // Step 2: Business Owner
  is_business_owner: 'yes',
  
  // Step 3: Monthly Sales
  monthly_sales: '50000',
  
  // Step 4: Existing Loans
  has_existing_loans: 'no',
  total_loan_amount: '0',
  
  // Step 5: Business Search
  business_name: 'Test Business LLC',
  business_search_verified: 'verified',
  
  // Step 6: Bank Connection
  bank_connected: 'connect-now',
  bank_connection_method: 'flinks',
  
  // Step 7: Personal Information
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@testbusiness.com',
  phone: '555-123-4567',
  title: 'CEO',
  ssn_last_4: '1234',
  
  // Step 8: Funding Amount
  funding_amount: '250000',
  funding_timeline: 'within-30-days',
  
  // Step 9: Funding Purpose
  funding_purpose: 'working-capital',
  
  // Step 10: Business Details
  business_type: 'technology',
  business_age: '2-5-years',
  number_of_employees: '6-10',
  
  // Step 11: Financial Information
  annual_revenue: '600000',
  cash_flow: '25000',
  credit_score: 'good',
  time_in_business: '3 years 2 months',
  
  // Step 12: Bank Information
  bank_connection_completed: true,
  skipped_bank_connection: false,
  
  // Step 13: Additional Details
  business_address: '123 Main Street, Suite 100, San Francisco, CA 94102',
  business_phone: '555-987-6543',
  website_url: 'https://www.testbusiness.com',
  additional_info: 'Looking for working capital to expand our tech operations',
  
  // Step 14: Review & Submit
  agrees_to_terms: true,
  authorizes_credit_check: true,
  
  // Application Status
  status: 'submitted',
  submitted_at: new Date().toISOString()
};

async function testSupabaseIntegration() {
  console.log('🧪 Testing Supabase Integration...\n');
  
  try {
    // Test 1: Check if table exists
    console.log('1️⃣ Testing table access...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('applications')
      .select('count(*)', { count: 'exact', head: true });
    
    if (tableError) {
      console.error('❌ Table access failed:', tableError.message);
      console.log('💡 Make sure you ran the SQL setup in your Supabase dashboard');
      return;
    }
    console.log('✅ Table access successful');

    // Test 2: Insert test application
    console.log('\n2️⃣ Inserting test application...');
    const { data: insertData, error: insertError } = await supabase
      .from('applications')
      .insert([testApplicationData])
      .select();

    if (insertError) {
      console.error('❌ Insert failed:', insertError.message);
      return;
    }
    
    const insertedApp = insertData[0];
    console.log('✅ Test application inserted successfully!');
    console.log(`📋 Application ID: ${insertedApp.id}`);
    console.log(`📧 Email: ${insertedApp.email}`);
    console.log(`🏢 Business: ${insertedApp.business_name}`);

    // Test 3: Query the inserted data
    console.log('\n3️⃣ Querying inserted application...');
    const { data: queryData, error: queryError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', insertedApp.id)
      .single();

    if (queryError) {
      console.error('❌ Query failed:', queryError.message);
      return;
    }
    
    console.log('✅ Query successful!');
    console.log('📊 Application Details:');
    console.log(`   • ID: ${queryData.id}`);
    console.log(`   • Business Name: ${queryData.business_name}`);
    console.log(`   • Contact: ${queryData.first_name} ${queryData.last_name}`);
    console.log(`   • Email: ${queryData.email}`);
    console.log(`   • Phone: ${queryData.phone}`);
    console.log(`   • Loan Type: ${queryData.loan_type}`);
    console.log(`   • Funding Amount: $${queryData.funding_amount}`);
    console.log(`   • Business Type: ${queryData.business_type}`);
    console.log(`   • Bank Connected: ${queryData.bank_connection_completed}`);
    console.log(`   • Agrees to Terms: ${queryData.agrees_to_terms}`);
    console.log(`   • Status: ${queryData.status}`);
    console.log(`   • Submitted: ${queryData.submitted_at}`);

    // Test 4: Count total applications
    console.log('\n4️⃣ Counting total applications...');
    const { count, error: countError } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Count failed:', countError.message);
      return;
    }
    
    console.log(`✅ Total applications in database: ${count}`);

    // Test 5: Test the API transformation function
    console.log('\n5️⃣ Testing API transformation...');
    const { submitApplication } = require('./src/lib/api.ts');
    
    const testFormData = {
      loanType: 'line-of-credit',
      isBusinessOwner: 'yes',
      monthlySales: '75000',
      hasExistingLoans: 'yes',
      totalLoanAmount: '25000',
      businessName: 'API Test Company',
      bankConnected: 'connect-later',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@apitest.com',
      phone: '555-555-5555',
      title: 'CFO',
      ssn: '5678',
      fundingAmount: '150000',
      fundingTimeline: 'immediately',
      fundingPurpose: 'expansion',
      businessType: 'retail',
      businessAge: '5-10-years',
      numberOfEmployees: '11-25',
      annualRevenue: '900000',
      cashFlow: '35000',
      creditScore: 'excellent',
      timeInBusiness: '7 years',
      bankConnectionCompleted: false,
      skippedBankConnection: true,
      businessAddress: '456 Commerce Ave, New York, NY 10001',
      businessPhone: '555-111-2222',
      websiteUrl: 'https://apitestcompany.com',
      additionalInfo: 'Need funding for store expansion',
      agreesToTerms: true,
      authorizesCreditCheck: true
    };

    const apiResult = await submitApplication(testFormData);
    console.log('✅ API submission successful!');
    console.log(`📋 API Application ID: ${apiResult.applicationId}`);
    console.log(`📧 API Email: ${apiResult.data.email}`);

    console.log('\n🎉 All Tests Passed!');
    console.log('🔗 View your data in Supabase dashboard:');
    console.log(`   https://app.supabase.com/project/gtogvkaukyxxwvxenfit/editor`);
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure you ran the SQL setup in Supabase dashboard');
    console.log('2. Check that RLS policies are configured correctly');
    console.log('3. Verify your Supabase credentials in .env.local');
  }
}

testSupabaseIntegration();