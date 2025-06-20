-- Add user_id foreign key column to applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add index for the foreign key for better performance
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);