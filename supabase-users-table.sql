-- Create users table for campaign management (no passwords - for referral campaigns only)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    
    -- Business Role
    role_in_business VARCHAR(100), -- Owner, Co-owner, Manager, etc.
    ownership_percentage INTEGER, -- 0-100
    
    -- Address Information
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(20),
    
    -- Campaign Tracking
    source VARCHAR(100), -- referral_application, direct, etc.
    utm_campaign VARCHAR(255),
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_content VARCHAR(255),
    
    -- Preferences
    email_marketing_consent BOOLEAN DEFAULT FALSE,
    sms_marketing_consent BOOLEAN DEFAULT FALSE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'unsubscribed')),
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    
    CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_source ON users(source);

-- Add RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow all operations for service role (backend)
CREATE POLICY "Service role can manage users" ON users
    FOR ALL USING (auth.role() = 'service_role');

-- Allow read access for authenticated users (if needed for admin)
CREATE POLICY "Authenticated users can read users" ON users
    FOR SELECT USING (auth.role() = 'authenticated');

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add foreign key to applications table to link users with applications
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add index for the foreign key
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);

COMMENT ON TABLE users IS 'Users table for referral campaign management (no authentication)';
COMMENT ON COLUMN users.source IS 'Source of user acquisition (e.g., referral_application, direct, campaign)';
COMMENT ON COLUMN users.email_marketing_consent IS 'User consent for email marketing campaigns';
COMMENT ON COLUMN users.sms_marketing_consent IS 'User consent for SMS marketing campaigns';