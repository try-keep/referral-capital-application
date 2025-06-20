-- Fix RLS policies for users table to allow anon access

-- Drop existing restrictive policies if any
DROP POLICY IF EXISTS "Enable all operations for anon" ON users;
DROP POLICY IF EXISTS "Allow anon access to users" ON users;

-- Add policy to allow anon users to insert/select/update users
CREATE POLICY "Allow anon access to users" ON users
    FOR ALL TO anon
    USING (true)
    WITH CHECK (true);

-- Keep service role access (if we ever need it)
CREATE POLICY "Service role can manage users" ON users
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);