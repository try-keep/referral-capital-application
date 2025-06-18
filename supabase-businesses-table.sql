-- Businesses Table for Canadian Business Registry Data
-- Run this in your Supabase SQL Editor

-- Create the businesses table to store Canadian Business Registry data
CREATE TABLE IF NOT EXISTS businesses (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Canadian Business Registry Core Fields
  mras_id VARCHAR(50) UNIQUE NOT NULL, -- Primary identifier from registry
  company_name VARCHAR(500) NOT NULL,
  business_number VARCHAR(20), -- BN field
  juri_id VARCHAR(50),
  
  -- Location Information
  registry_source VARCHAR(10), -- ON, BC, AB, etc.
  jurisdiction VARCHAR(10),
  reg_office_city VARCHAR(200),
  city VARCHAR(200),
  reg_office_province VARCHAR(100),
  
  -- Business Status and Dates
  status_state VARCHAR(50),
  status_date DATE,
  status_notes TEXT,
  date_incorporated DATE,
  display_date DATE,
  
  -- Business Type and Classification
  entity_type VARCHAR(200),
  mras_entity_type VARCHAR(20),
  
  -- Additional Fields from Registry
  alternate_names TEXT[], -- Array of alternate names
  text_fields TEXT[], -- Search text fields
  score DECIMAL(10,6), -- Search relevance score when found
  hierarchy VARCHAR(50),
  data_source VARCHAR(50),
  version_number BIGINT,
  
  -- Derived/Computed Fields for Form Pre-filling
  business_age_category VARCHAR(50), -- Computed from incorporation date
  estimated_business_type VARCHAR(50), -- Mapped to our form options
  
  -- Registry API Response (for debugging/reference)
  raw_registry_data JSONB, -- Store the complete API response
  
  -- Search and Usage Tracking
  search_query VARCHAR(500), -- What was searched to find this business
  times_selected INTEGER DEFAULT 0, -- How many times this business was selected
  last_selected_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_mras_id ON businesses(mras_id);
CREATE INDEX IF NOT EXISTS idx_businesses_company_name ON businesses(company_name);
CREATE INDEX IF NOT EXISTS idx_businesses_business_number ON businesses(business_number);
CREATE INDEX IF NOT EXISTS idx_businesses_jurisdiction ON businesses(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_businesses_status_state ON businesses(status_state);
CREATE INDEX IF NOT EXISTS idx_businesses_search_query ON businesses(search_query);

-- Full text search index for company names
CREATE INDEX IF NOT EXISTS idx_businesses_company_name_fulltext ON businesses 
USING GIN (to_tsvector('english', company_name));

-- Update the applications table to reference businesses
ALTER TABLE applications ADD COLUMN IF NOT EXISTS business_id BIGINT REFERENCES businesses(id);
CREATE INDEX IF NOT EXISTS idx_applications_business_id ON applications(business_id);

-- Enable Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Create policies for businesses table
CREATE POLICY "Anyone can read businesses" ON businesses
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert businesses" ON businesses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update businesses" ON businesses
  FOR UPDATE USING (true) WITH CHECK (true);

-- Create a function to automatically compute derived fields
CREATE OR REPLACE FUNCTION compute_business_derived_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Compute business age category from incorporation date
  IF NEW.date_incorporated IS NOT NULL THEN
    CASE 
      WHEN EXTRACT(YEAR FROM AGE(NEW.date_incorporated)) < 1 THEN
        NEW.business_age_category := 'under-1-year';
      WHEN EXTRACT(YEAR FROM AGE(NEW.date_incorporated)) <= 2 THEN
        NEW.business_age_category := '1-2-years';
      WHEN EXTRACT(YEAR FROM AGE(NEW.date_incorporated)) <= 5 THEN
        NEW.business_age_category := '2-5-years';
      WHEN EXTRACT(YEAR FROM AGE(NEW.date_incorporated)) <= 10 THEN
        NEW.business_age_category := '5-10-years';
      ELSE
        NEW.business_age_category := 'over-10-years';
    END CASE;
  END IF;
  
  -- Map entity type to our business type options
  IF NEW.entity_type IS NOT NULL THEN
    CASE 
      WHEN LOWER(NEW.entity_type) LIKE '%restaurant%' OR LOWER(NEW.entity_type) LIKE '%food%' THEN
        NEW.estimated_business_type := 'restaurant';
      WHEN LOWER(NEW.entity_type) LIKE '%retail%' THEN
        NEW.estimated_business_type := 'retail';
      WHEN LOWER(NEW.entity_type) LIKE '%construction%' THEN
        NEW.estimated_business_type := 'construction';
      WHEN LOWER(NEW.entity_type) LIKE '%health%' THEN
        NEW.estimated_business_type := 'healthcare';
      WHEN LOWER(NEW.entity_type) LIKE '%tech%' OR LOWER(NEW.entity_type) LIKE '%software%' THEN
        NEW.estimated_business_type := 'technology';
      WHEN LOWER(NEW.entity_type) LIKE '%manufact%' THEN
        NEW.estimated_business_type := 'manufacturing';
      WHEN LOWER(NEW.entity_type) LIKE '%transport%' THEN
        NEW.estimated_business_type := 'transportation';
      WHEN LOWER(NEW.entity_type) LIKE '%real estate%' THEN
        NEW.estimated_business_type := 'real-estate';
      ELSE
        NEW.estimated_business_type := 'professional-services';
    END CASE;
  END IF;
  
  -- Set updated timestamp
  NEW.updated_at := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically compute derived fields
DROP TRIGGER IF EXISTS trigger_compute_business_derived_fields ON businesses;
CREATE TRIGGER trigger_compute_business_derived_fields
  BEFORE INSERT OR UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION compute_business_derived_fields();

-- Verify setup
SELECT 'Businesses table setup complete! Ready to store Canadian Business Registry data.' as status;