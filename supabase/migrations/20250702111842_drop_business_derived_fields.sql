-- Drop the trigger first (depends on the function)
DROP TRIGGER IF EXISTS "trigger_compute_business_derived_fields" ON "public"."businesses";

-- Drop the function
DROP FUNCTION IF EXISTS "public"."compute_business_derived_fields"();

-- Create a simple function to update updated_at timestamp
CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to automatically update updated_at on applications table
CREATE OR REPLACE TRIGGER "trigger_update_applications_updated_at"
    BEFORE UPDATE ON "public"."applications"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."update_updated_at_column"();

-- Add trigger to automatically update updated_at on businesses table (if needed)
CREATE OR REPLACE TRIGGER "trigger_update_businesses_updated_at"
    BEFORE UPDATE ON "public"."businesses"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."update_updated_at_column"();
