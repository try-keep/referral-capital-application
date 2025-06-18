-- Add ip_address column to applications table
ALTER TABLE applications 
ADD COLUMN ip_address TEXT;

-- Add a comment to document the column purpose
COMMENT ON COLUMN applications.ip_address IS 'IP address of the user when they submitted the application for audit and compliance purposes';