const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupUsersTable() {
  console.log('🔧 Setting up users table...');
  
  try {
    const sql = fs.readFileSync('supabase-users-table.sql', 'utf8');
    
    // Split SQL into individual statements and execute them
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing SQL statement...');
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql_query: statement.trim() + ';' 
        });
        
        if (error) {
          console.error('❌ SQL Error:', error);
          console.log('Statement was:', statement.trim());
          throw error;
        }
      }
    }
    
    console.log('✅ Users table setup completed successfully');
    
    // Test the table by checking if it exists
    const { data: tables, error: tableError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
      
    if (tableError) {
      console.error('❌ Error testing users table:', tableError);
    } else {
      console.log('✅ Users table is accessible');
    }
    
  } catch (error) {
    console.error('❌ Error setting up users table:', error);
    process.exit(1);
  }
}

setupUsersTable();