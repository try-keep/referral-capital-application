import { NextRequest, NextResponse } from 'next/server';
import { getComplianceChecks } from '@/lib/compliance';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const applicationId = searchParams.get('applicationId');

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    const checks = await getComplianceChecks(parseInt(applicationId));

    return NextResponse.json({
      success: true,
      checks,
    });
  } catch (error) {
    console.error('Get compliance checks error:', error);
    return NextResponse.json(
      { error: 'Failed to get compliance checks' },
      { status: 500 }
    );
  }
}
