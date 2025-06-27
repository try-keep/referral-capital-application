const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function showData() {
  console.log('📊 Showing all applications in Supabase...\n');

  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }

    console.log(`✅ Found ${data.length} applications in database:\n`);

    data.forEach((app, index) => {
      console.log(`📋 Application #${index + 1} (ID: ${app.id})`);
      console.log(`   🏢 Business: ${app.business_name}`);
      console.log(`   👤 Contact: ${app.first_name} ${app.last_name}`);
      console.log(`   📧 Email: ${app.email}`);
      console.log(`   📞 Phone: ${app.phone}`);
      console.log(`   💰 Loan Type: ${app.loan_type}`);
      console.log(`   💵 Funding: $${app.funding_amount}`);
      console.log(`   🏭 Business Type: ${app.business_type}`);
      console.log(
        `   📅 Created: ${new Date(app.created_at).toLocaleString()}`
      );
      console.log(`   ✅ Terms Agreed: ${app.agrees_to_terms}`);
      console.log(`   🏦 Bank Connected: ${app.bank_connection_completed}`);
      console.log('   ─────────────────────────────────────────\n');
    });

    console.log(
      '🔗 View in Supabase: https://app.supabase.com/project/gtogvkaukyxxwvxenfit/editor'
    );
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

showData();
