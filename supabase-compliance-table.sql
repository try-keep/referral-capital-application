-- Create compliance_checks table
CREATE TABLE IF NOT EXISTS compliance_checks (
  id SERIAL PRIMARY KEY,
  application_id INTEGER,
  check_type VARCHAR(50) NOT NULL, -- 'website_metadata', 'adverse_media', 'ai_categorization'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  risk_score DECIMAL(3,2), -- 0.00 to 1.00
  results JSONB, -- Store full compliance data
  input_data JSONB, -- Store input parameters (business name, website, etc)
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  error_message TEXT
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_compliance_checks_application_id ON compliance_checks(application_id);
CREATE INDEX IF NOT EXISTS idx_compliance_checks_type ON compliance_checks(check_type);
CREATE INDEX IF NOT EXISTS idx_compliance_checks_status ON compliance_checks(status);

-- Add comments for documentation
COMMENT ON TABLE compliance_checks IS 'Stores compliance check results for applications';
COMMENT ON COLUMN compliance_checks.check_type IS 'Type of compliance check performed';
COMMENT ON COLUMN compliance_checks.risk_score IS 'Risk score from 0.00 (low risk) to 1.00 (high risk)';
COMMENT ON COLUMN compliance_checks.results IS 'JSON object containing check results';
COMMENT ON COLUMN compliance_checks.input_data IS 'JSON object containing input parameters used for the check';