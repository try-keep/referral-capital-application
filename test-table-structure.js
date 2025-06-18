// Test table structure and access
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testTableStructure() {
  console.log('🔍 Testing table structure and access...\n');
  
  try {
    // Test raw SQL query to see what tables exist
    console.log('1️⃣ Checking available tables...');
    
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_names', {});
    
    if (tablesError) {
      console.log('RPC not available, trying direct table access...');
      
      // Just try to access the tables directly
      const testTables = ['applications', 'businesses'];
      
      for (const tableName of testTables) {
        console.log(`\n2️⃣ Testing ${tableName} table...`);
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${tableName} table error:`, error.message);
          console.log('Error code:', error.code);
          console.log('Error details:', error.details);
          console.log('Error hint:', error.hint);
        } else {
          console.log(`✅ ${tableName} table accessible`);
          console.log(`   Records found: ${data.length}`);
          if (data.length > 0) {
            console.log(`   Sample columns:`, Object.keys(data[0]).slice(0, 5));
          }
        }
      }
    } else {
      console.log('Available tables:', tables);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testTableStructure();