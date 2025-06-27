import { NextRequest, NextResponse } from 'next/server';
import { updateApplication } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { applicationId, updateData } = await request.json();

    console.log(
      '🧪 Test: Updating application:',
      applicationId,
      'with data:',
      updateData
    );
    console.log('🧪 Test: applicationId type:', typeof applicationId);

    // Ensure applicationId is an integer
    const appId = parseInt(applicationId);
    console.log(
      '🧪 Test: Converted applicationId:',
      appId,
      'type:',
      typeof appId
    );

    const updatedApplication = await updateApplication(appId, updateData);

    console.log(
      '🧪 Test: Application updated successfully:',
      updatedApplication
    );

    return NextResponse.json({
      success: true,
      application: updatedApplication,
    });
  } catch (error) {
    console.error('🧪 Test: Application update failed:', error);

    return NextResponse.json(
      {
        error: 'Failed to update application',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
