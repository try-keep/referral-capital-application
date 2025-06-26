-- Remove business_age and time_in_business columns from applications table
-- Migration: Remove unused fields that were removed from the frontend

-- Remove business_age column
ALTER TABLE applications
DROP COLUMN IF EXISTS business_age;

-- Remove time_in_business column
ALTER TABLE applications
DROP COLUMN IF EXISTS time_in_business;

-- Add comments to document the changes
COMMENT ON TABLE applications IS 'Applications table - removed business_age and time_in_business fields as they are no longer collected in the frontend';

-- Verify the columns were removed
SELECT 'business_age and time_in_business columns removed successfully from applications table' as status;
