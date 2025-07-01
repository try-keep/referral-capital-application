import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

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

    // Get application upload ID from headers, or generate a new one
    let applicationUploadId = request.headers.get('X-Application-Upload-ID');

    if (!applicationUploadId) {
      applicationUploadId = randomUUID();
    }

    // Validate file type and size - only accept PDFs
    const validTypes = ['application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type. Please upload PDF files only.',
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

    // Generate unique filename using applicationUploadId as base path
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${applicationUploadId}/${timestamp}-${sanitizedFileName}`;

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
        application_id: null, // Will be filled when application is created
        application_upload_id: applicationUploadId,
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
      applicationUploadId: applicationUploadId,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
