-- Update RLS policies for users table to allow anon access like other tables

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Service role can manage users" ON users;
DROP POLICY IF EXISTS "Authenticated users can read users" ON users;

-- Add simple policy to allow anon users to insert/select/update users (like applications and businesses tables)
CREATE POLICY "Allow anon access to users" ON users
    FOR ALL TO anon
    USING (true)
    WITH CHECK (true);

-- Keep service role access
CREATE POLICY "Service role can manage users" ON users
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);