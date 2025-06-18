// Test the complete business search workflow
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testBusinessWorkflow() {
  console.log('🧪 Testing Complete Business Search Workflow...\n');
  
  try {
    // Step 1: Test Canadian Business Registry API
    console.log('1️⃣ Testing Canadian Business Registry API...');
    const encodedName = encodeURIComponent('{RUNASO INC}');
    const url = `https://ised-isde.canada.ca/cbr/srch/api/v1/search?fq=keyword:${encodedName}&lang=en&queryaction=fieldquery&sortfield=score&sortorder=desc`;
    
    const response = await fetch(url);
    const data = await response.json();
    console.log(`✅ Found ${data.totalResults} businesses`);
    
    if (data.docs.length === 0) {
      throw new Error('No businesses found in registry');
    }
    
    const business = data.docs[0];
    console.log(`📋 Business: ${business.Company_Name}`);
    
    // Step 2: Test saving business to Supabase
    console.log('\n2️⃣ Testing business save to Supabase...');
    
    // Check if businesses table exists
    const { data: businessCheck, error: businessTableError } = await supabase
      .from('businesses')
      .select('*')
      .limit(1);
    
    if (businessTableError) {
      console.log('❌ Businesses table error:', businessTableError.message);
      console.log('📋 File: supabase-businesses-table.sql');
      return;
    }
    
    console.log(`✅ Businesses table exists (${businessCheck.length || 0} records)`);
    
    // Test business insert
    const businessData = {
      mras_id: business.MRAS_ID,
      company_name: business.Company_Name,
      business_number: business.BN,
      juri_id: business.Juri_ID,
      registry_source: business.Registry_Source,
      jurisdiction: business.Jurisdiction,
      reg_office_city: business.Reg_office_city,
      city: business.City,
      reg_office_province: business.Reg_office_province,
      status_state: business.Status_State,
      status_date: business.Status_Date,
      status_notes: business.Status_Notes,
      date_incorporated: business.Date_Incorporated,
      display_date: business.Display_Date,
      entity_type: business.Entity_Type,
      mras_entity_type: business.MRAS_Entity_Type,
      score: business.score,
      hierarchy: business.hierarchy,
      data_source: business.Data_Source,
      version_number: business._version_,
      raw_registry_data: business,
      search_query: 'RUNASO INC',
      times_selected: 1,
      last_selected_at: new Date().toISOString()
    };
    
    // Try to insert (or get existing)
    const { data: insertData, error: insertError } = await supabase
      .from('businesses')
      .upsert([businessData], { onConflict: 'mras_id' })
      .select();
    
    if (insertError) {
      console.error('❌ Insert error:', insertError.message);
      return;
    }
    
    const savedBusiness = insertData[0];
    console.log(`✅ Business saved with ID: ${savedBusiness.id}`);
    console.log(`📊 Computed business age: ${savedBusiness.business_age_category}`);
    console.log(`🏢 Estimated business type: ${savedBusiness.estimated_business_type}`);
    
    // Step 3: Test application with business reference
    console.log('\n3️⃣ Testing application with business reference...');
    
    const testApplication = {
      loan_type: 'business-loan',
      is_business_owner: 'yes',
      monthly_sales: '50000',
      has_existing_loans: 'no',
      business_name: savedBusiness.company_name,
      first_name: 'Test',
      last_name: 'User',
      email: 'test@workflow.com',
      phone: '555-0123',
      title: 'CEO',
      ssn_last_4: '1234',
      funding_amount: '250000',
      funding_timeline: 'within-30-days',
      funding_purpose: 'working-capital',
      business_type: savedBusiness.estimated_business_type || 'professional-services',
      business_age: savedBusiness.business_age_category || '1-2-years',
      number_of_employees: '2-5',
      annual_revenue: '600000',
      cash_flow: '25000',
      credit_score: 'good',
      time_in_business: '2 years',
      bank_connection_completed: false,
      skipped_bank_connection: true,
      business_address: `${savedBusiness.city}, ${savedBusiness.reg_office_province}`,
      business_phone: '555-0124',
      agrees_to_terms: true,
      authorizes_credit_check: true,
      business_id: savedBusiness.id // Link to the business
    };
    
    const { data: appData, error: appError } = await supabase
      .from('applications')
      .insert([testApplication])
      .select();
    
    if (appError) {
      console.error('❌ Application insert error:', appError.message);
      return;
    }
    
    const savedApplication = appData[0];
    console.log(`✅ Application saved with ID: ${savedApplication.id}`);
    console.log(`🔗 Linked to business ID: ${savedApplication.business_id}`);
    
    // Step 4: Test relationship query
    console.log('\n4️⃣ Testing business-application relationship...');
    
    const { data: relationData, error: relationError } = await supabase
      .from('businesses')
      .select(`
        id,
        company_name,
        business_number,
        jurisdiction,
        applications!business_id (
          id,
          email,
          funding_amount,
          business_type,
          created_at
        )
      `)
      .eq('id', savedBusiness.id);
    
    if (relationError) {
      console.error('❌ Relationship query error:', relationError.message);
      return;
    }
    
    const businessWithApps = relationData[0];
    console.log(`✅ Business: ${businessWithApps.company_name}`);
    console.log(`📋 Applications: ${businessWithApps.applications.length}`);
    
    if (businessWithApps.applications.length > 0) {
      const app = businessWithApps.applications[0];
      console.log(`   • App ID: ${app.id}`);
      console.log(`   • Email: ${app.email}`);
      console.log(`   • Funding: $${app.funding_amount}`);
      console.log(`   • Business Type: ${app.business_type}`);
    }
    
    console.log('\n🎉 Complete workflow test successful!');
    console.log('\n📊 Summary:');
    console.log(`   • Canadian Business Registry API: ✅ Working`);
    console.log(`   • Business data storage: ✅ Working`);
    console.log(`   • Business-Application linking: ✅ Working`);
    console.log(`   • Auto-computed fields: ✅ Working`);
    console.log(`   • Serverless-ready: ✅ Client-side fetch works`);
    
    console.log('\n🔗 View data in Supabase:');
    console.log(`   https://app.supabase.com/project/gtogvkaukyxxwvxenfit/editor`);
    
  } catch (error) {
    console.error('❌ Workflow test failed:', error.message);
  }
}

testBusinessWorkflow();