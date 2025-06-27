import { NextRequest, NextResponse } from 'next/server';
import { scrapeWebsiteMetadata } from '@/lib/compliance';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Debug endpoint working',
    env_check: {
      supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      openai_key: !!process.env.OPENAI_API_KEY,
      newsapi_key: !!process.env.NEWSAPI_KEY,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    console.log('Testing website scraping for:', url);
    const result = await scrapeWebsiteMetadata(url || 'google.com');

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
