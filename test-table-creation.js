const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testTableCreation() {
  console.log('🔧 Testing table creation capabilities...\n');

  try {
    // Test 1: Check if we can execute SQL
    console.log('1️⃣ Testing SQL execution capabilities...');

    // Try to create the businesses table with minimal schema
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS businesses (
        id BIGSERIAL PRIMARY KEY,
        mras_id VARCHAR(50) UNIQUE NOT NULL,
        company_name VARCHAR(500) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const { data: createData, error: createError } = await supabase.rpc(
      'exec_sql',
      {
        sql: createTableSQL,
      }
    );

    if (createError) {
      console.log('❌ Cannot execute SQL via RPC. Manual setup required.');
      console.log('Error:', createError.message);

      console.log('\n📋 Please run this SQL manually in Supabase Dashboard:');
      console.log(
        '1. Go to: https://app.supabase.com/project/gtogvkaukyxxwvxenfit/sql'
      );
      console.log(
        '2. Copy and paste the contents of: supabase-businesses-table.sql'
      );
      console.log('3. Click "Run"');
      console.log('4. Then re-run this test');
      return;
    }

    console.log('✅ SQL execution successful!');

    // Test 2: Add business_id to applications table
    console.log('\n2️⃣ Adding business_id to applications table...');

    const alterTableSQL = `
      ALTER TABLE applications ADD COLUMN IF NOT EXISTS business_id BIGINT REFERENCES businesses(id);
      CREATE INDEX IF NOT EXISTS idx_applications_business_id ON applications(business_id);
    `;

    const { data: alterData, error: alterError } = await supabase.rpc(
      'exec_sql',
      {
        sql: alterTableSQL,
      }
    );

    if (alterError) {
      console.log('❌ Cannot alter applications table:', alterError.message);
      return;
    }

    console.log('✅ Applications table updated!');

    // Test 3: Test table access
    console.log('\n3️⃣ Testing table access...');

    const { data: businessCheck, error: businessError } = await supabase
      .from('businesses')
      .select('count(*)', { count: 'exact', head: true });

    if (businessError) {
      console.log('❌ Cannot access businesses table:', businessError.message);
      return;
    }

    console.log(
      `✅ Businesses table accessible (${businessCheck.count || 0} records)`
    );

    console.log(
      '\n🎉 Table creation successful! Now running full workflow test...'
    );

    // Run the full workflow test
    require('./test-business-workflow.js');
  } catch (error) {
    console.error('❌ Table creation test failed:', error.message);
  }
}

testTableCreation();
