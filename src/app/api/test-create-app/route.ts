import { NextRequest, NextResponse } from 'next/server';
import { saveApplication, type ApplicationData } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const applicationData: ApplicationData = await request.json();

    console.log('🧪 Test: Creating application with data:', applicationData);

    const savedApplication = await saveApplication(applicationData);

    console.log('🧪 Test: Application created successfully:', savedApplication);

    return NextResponse.json({
      success: true,
      id: savedApplication.id,
      application: savedApplication,
    });
  } catch (error) {
    console.error('🧪 Test: Application creation failed:', error);

    return NextResponse.json(
      {
        error: 'Failed to create application',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
