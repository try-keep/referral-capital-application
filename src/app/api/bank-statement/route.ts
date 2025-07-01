import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Get application ID from headers
    const applicationId = request.headers.get('X-Application-ID');

    // Validate file type and size
    const validTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            'Invalid file type. Please upload PDF, PNG, JPEG, or DOC files.',
        },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const fileName = applicationId
      ? `${applicationId}/${timestamp}-${file.name}`
      : `temp/${randomId}/${timestamp}-${file.name}`;

    // Upload to Supabase Storage using standard upload
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('bank-statements')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Save file metadata to database
    const { data: dbData, error: dbError } = await supabase
      .from('bank_statements')
      .insert({
        application_id: applicationId || null,
        file_url: fileName, // Store the path
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);

      // Try to delete the uploaded file
      await supabase.storage.from('bank-statements').remove([fileName]);

      return NextResponse.json(
        { error: 'Failed to save file metadata' },
        { status: 500 }
      );
    }

    // Generate a temporary signed URL for immediate display (expires in 1 hour)
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from('bank-statements')
        .createSignedUrl(fileName, 3600); // 1 hour expiration

    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError);
    }

    return NextResponse.json({
      id: dbData.id,
      fileName: file.name,
      fileUrl: signedUrlData?.signedUrl || fileName,
      fileSize: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
