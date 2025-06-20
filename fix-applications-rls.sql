-- Fix RLS policies for applications table to allow anon access

-- Drop existing restrictive policies if any
DROP POLICY IF EXISTS "Enable all operations for anon" ON applications;
DROP POLICY IF EXISTS "Allow anon access to applications" ON applications;

-- Add policy to allow anon users to insert/select/update applications
CREATE POLICY "Allow anon access to applications" ON applications
    FOR ALL TO anon
    USING (true)
    WITH CHECK (true);

-- Keep service role access
CREATE POLICY "Service role can manage applications" ON applications
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);