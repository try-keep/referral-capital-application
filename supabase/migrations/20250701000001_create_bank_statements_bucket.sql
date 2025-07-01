-- Create storage bucket for bank statements
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'bank-statements',
  'bank-statements',
  false, -- Private bucket - files cannot be accessed without authentication
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the bucket
CREATE POLICY "Anyone can upload bank statements" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'bank-statements');

-- Only authenticated users can view their own bank statements
-- Note: This policy would need additional logic to check ownership
-- For now, we'll rely on the service role to control access
CREATE POLICY "Service role can view bank statements" ON storage.objects
  FOR SELECT TO service_role
  USING (bucket_id = 'bank-statements');

-- Service role can update bank statements
CREATE POLICY "Service role can update bank statements" ON storage.objects
  FOR UPDATE TO service_role
  USING (bucket_id = 'bank-statements')
  WITH CHECK (bucket_id = 'bank-statements');

-- Service role can delete bank statements
CREATE POLICY "Service role can delete bank statements" ON storage.objects
  FOR DELETE TO service_role
  USING (bucket_id = 'bank-statements');
