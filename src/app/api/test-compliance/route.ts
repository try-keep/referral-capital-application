import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    // Get all compliance checks
    const { data, error } = await supabase
      .from('compliance_checks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      checks: data,
      total: data.length 
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get compliance checks' },
      { status: 500 }
    );
  }
}

// Test endpoint to manually trigger a compliance check
export async function POST(request: NextRequest) {
  try {
    const { type, businessName, websiteUrl } = await request.json();

    let result;
    if (type === 'website' && websiteUrl) {
      result = await fetch(`${request.nextUrl.origin}/api/compliance/website-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          businessWebsite: websiteUrl, 
          businessName: businessName || 'Test Business',
          applicationId: 999 
        })
      });
    } else if (type === 'categorization' && businessName) {
      result = await fetch(`${request.nextUrl.origin}/api/compliance/ai-categorization`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          businessName,
          applicationId: 999 
        })
      });
    } else if (type === 'adverse-media' && businessName) {
      result = await fetch(`${request.nextUrl.origin}/api/compliance/adverse-media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          businessName,
          websiteUrl,
          applicationId: 999 
        })
      });
    }

    if (result) {
      const data = await result.json();
      return NextResponse.json({ success: true, result: data });
    }

    return NextResponse.json({ error: 'Invalid test type' }, { status: 400 });

  } catch (error) {
    return NextResponse.json(
      { error: 'Test failed' },
      { status: 500 }
    );
  }
}