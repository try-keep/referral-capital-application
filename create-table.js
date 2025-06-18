const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTable() {
  console.log('🚀 Creating applications table in Supabase...');
  
  try {
    // Create the table using raw SQL
    const { data, error } = await supabase.rpc('create_applications_table');
    
    if (error) {
      console.log('⚠️  RPC method not available. Please run this SQL manually in your Supabase dashboard:');
      console.log('\n--- COPY AND PASTE THIS SQL ---\n');
      
      const sql = `
-- Create the applications table
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
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_business_name ON applications(business_name);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON applications(submitted_at);

-- Enable Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anyone to insert applications (for the public form)
CREATE POLICY "Anyone can insert applications" ON applications
  FOR INSERT WITH CHECK (true);

-- Create a policy to allow reading applications (you may want to restrict this later)
CREATE POLICY "Anyone can read applications" ON applications
  FOR SELECT USING (true);
`;
      
      console.log(sql);
      console.log('\n--- END COPY ---\n');
      
      console.log('📋 Instructions:');
      console.log('1. Go to https://app.supabase.com/project/gtogvkaukyxxwvxenfit/sql');
      console.log('2. Paste the SQL above');
      console.log('3. Click "Run"');
      console.log('4. Then run: node test-supabase.js');
      
      return;
    }
    
    console.log('✅ Table created successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTable();