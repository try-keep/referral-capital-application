import { NextRequest, NextResponse } from 'next/server';
import { getApplication } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const applicationId = parseInt(params.id);

    console.log('🧪 Test: Getting application:', applicationId);

    const application = await getApplication(applicationId);

    console.log('🧪 Test: Application retrieved:', application);

    return NextResponse.json(application);
  } catch (error) {
    console.error('🧪 Test: Get application failed:', error);

    return NextResponse.json(
      {
        error: 'Failed to get application',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
