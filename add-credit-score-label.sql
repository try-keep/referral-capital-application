-- Add credit_score_label column to applications table
-- This will store the full descriptive label (e.g., "Excellent (750+)", "Good (700-749)")
-- while credit_score stores the programmatic value (e.g., "excellent", "good")

ALTER TABLE applications 
ADD COLUMN credit_score_label TEXT;

-- Add comment to document the purpose
COMMENT ON COLUMN applications.credit_score_label IS 'Full descriptive label for credit score range (e.g., "Excellent (750+)", "Good (700-749)")';
COMMENT ON COLUMN applications.credit_score IS 'Programmatic value for credit score range (e.g., "excellent", "good", "fair")';