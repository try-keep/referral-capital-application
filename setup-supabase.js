const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const createTableSQL = `
CREATE TABLE IF NOT EXISTS applications (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Step 1: Loan Type
  loan_type VARCHAR(50) NOT NULL,
  
  -- Step 2: Business Owner
  is_business_owner VARCHAR(10) NOT NULL,
  
  -- Step 3: Monthly Sales
  monthly_sales VARCHAR(50) NOT NULL,
  
  -- Step 4: Existing Loans
  has_existing_loans VARCHAR(10) NOT NULL,
  total_loan_amount VARCHAR(50),
  
  -- Step 5: Business Search
  business_name VARCHAR(255) NOT NULL,
  business_search_verified VARCHAR(50),
  
  -- Step 6: Bank Connection
  bank_connected VARCHAR(50),
  bank_connection_method VARCHAR(100),
  
  -- Step 7: Personal Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  ssn_last_4 VARCHAR(4) NOT NULL,
  
  -- Step 8: Funding Amount
  funding_amount VARCHAR(50) NOT NULL,
  funding_timeline VARCHAR(50) NOT NULL,
  
  -- Step 9: Funding Purpose
  funding_purpose VARCHAR(50) NOT NULL,
  
  -- Step 10: Business Details
  business_type VARCHAR(50) NOT NULL,
  business_age VARCHAR(50) NOT NULL,
  number_of_employees VARCHAR(50) NOT NULL,
  
  -- Step 11: Financial Information
  annual_revenue VARCHAR(50) NOT NULL,
  cash_flow VARCHAR(50) NOT NULL,
  credit_score VARCHAR(50) NOT NULL,
  time_in_business VARCHAR(100) NOT NULL,
  
  -- Step 12: Bank Information
  bank_connection_completed BOOLEAN DEFAULT FALSE,
  skipped_bank_connection BOOLEAN DEFAULT FALSE,
  
  -- Step 13: Additional Details
  business_address TEXT NOT NULL,
  business_phone VARCHAR(50) NOT NULL,
  website_url VARCHAR(500),
  additional_info TEXT,
  
  -- Step 14: Review & Submit
  agrees_to_terms BOOLEAN NOT NULL DEFAULT FALSE,
  authorizes_credit_check BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Application Status
  status VARCHAR(50) DEFAULT 'submitted',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

const createIndexesSQL = `
-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_business_name ON applications(business_name);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON applications(submitted_at);
`;

async function setupSupabase() {
  console.log('🚀 Setting up Supabase database...');

  try {
    // Test connection
    console.log('📡 Testing Supabase connection...');
    const { data: testData, error: testError } =
      await supabase.auth.getSession();
    if (testError && testError.message !== 'Auth session missing!') {
      throw testError;
    }
    console.log('✅ Supabase connection successful');

    // Create table
    console.log('📋 Creating applications table...');
    const { data: tableData, error: tableError } = await supabase.rpc(
      'exec_sql',
      {
        sql: createTableSQL,
      }
    );

    if (tableError) {
      // If RPC doesn't work, try direct SQL execution
      console.log('⚠️  RPC method failed, trying alternative approach...');
      console.log('Please run this SQL manually in your Supabase SQL Editor:');
      console.log('\n--- COPY BELOW ---');
      console.log(createTableSQL);
      console.log('\n--- AND THEN ---');
      console.log(createIndexesSQL);
      console.log('--- END COPY ---\n');
    } else {
      console.log('✅ Applications table created successfully');

      // Create indexes
      console.log('🔍 Creating indexes...');
      const { data: indexData, error: indexError } = await supabase.rpc(
        'exec_sql',
        {
          sql: createIndexesSQL,
        }
      );

      if (indexError) {
        console.log(
          '⚠️  Could not create indexes automatically. Please run manually.'
        );
      } else {
        console.log('✅ Indexes created successfully');
      }
    }

    // Test table access
    console.log('🧪 Testing table access...');
    const { data: selectData, error: selectError } = await supabase
      .from('applications')
      .select('count(*)', { count: 'exact', head: true });

    if (selectError) {
      console.log('⚠️  Table access test failed:', selectError.message);
      console.log(
        'You may need to adjust Row Level Security (RLS) policies in Supabase'
      );
    } else {
      console.log('✅ Table access successful');
    }

    console.log('\n🎉 Supabase setup complete!');
    console.log('📝 Your application is now ready to store form submissions');
    console.log(
      '🔧 You can view your data in the Supabase dashboard table editor'
    );
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n📋 Manual Setup Instructions:');
    console.log('1. Go to your Supabase dashboard: https://app.supabase.com');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run the following SQL:');
    console.log('\n--- COPY BELOW ---');
    console.log(createTableSQL);
    console.log('\n--- AND THEN ---');
    console.log(createIndexesSQL);
    console.log('--- END COPY ---\n');
  }
}

setupSupabase();
