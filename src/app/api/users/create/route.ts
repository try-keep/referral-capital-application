import { NextRequest, NextResponse } from 'next/server';
import { createUser, type UserData } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const userData: UserData = await request.json();

    console.log('Creating user via API:', userData);

    // Validate required fields
    if (!userData.first_name || !userData.last_name || !userData.email) {
      return NextResponse.json(
        { error: 'Missing required fields: first_name, last_name, email' },
        { status: 400 }
      );
    }

    // Create the user
    const user = await createUser(userData);

    console.log('User created successfully:', user);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('User creation error:', error);

    return NextResponse.json(
      {
        error: 'Failed to create user',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
