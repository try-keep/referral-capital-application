import { NextRequest, NextResponse } from 'next/server';
import { upsertUser, linkApplicationToUser, type UserData } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Raw request body:', body);
    
    const { userData, applicationId }: { userData: UserData, applicationId?: number } = body;
    
    console.log('Parsed userData:', userData);
    console.log('Parsed applicationId:', applicationId);
    
    // Validate required fields
    if (!userData.first_name || !userData.last_name || !userData.email) {
      return NextResponse.json(
        { error: 'Missing required fields: first_name, last_name, email' },
        { status: 400 }
      );
    }
    
    // Upsert the user
    const user = await upsertUser(userData);
    
    console.log('User upserted successfully:', user);
    
    // Link to application if provided
    if (applicationId && user?.id) {
      try {
        await linkApplicationToUser(applicationId, user.id);
        console.log('Application linked to user:', applicationId, user.id);
      } catch (linkError) {
        console.warn('Could not link application to user:', linkError);
        // Don't fail the request if linking fails
      }
    }
    
    return NextResponse.json({
      success: true,
      user
    });
    
  } catch (error) {
    console.error('User upsert error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to upsert user',
        details: error instanceof Error ? error.message : 'Unknown error',
        errorCode: (error as any)?.code || 'UNKNOWN',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}