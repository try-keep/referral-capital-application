-- Add business_id column to existing applications table
-- Run this in your Supabase SQL Editor

-- Add the business_id column to link applications to businesses
ALTER TABLE applications ADD COLUMN IF NOT EXISTS business_id BIGINT REFERENCES businesses(id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_applications_business_id ON applications(business_id);

-- Verify the change
SELECT 'business_id column added to applications table successfully!' as status;