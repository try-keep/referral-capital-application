-- Add date_of_birth column to applications table
-- Migration: Add date_of_birth field to support personal information collection

ALTER TABLE applications
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Verify the column was added
SELECT 'date_of_birth column added successfully to applications table' as status;
