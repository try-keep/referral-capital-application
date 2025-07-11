ALTER TABLE applications
  ADD COLUMN business_address_line1 VARCHAR(255) NULL,
  ADD COLUMN business_address_line2 VARCHAR(255) NULL,
  ADD COLUMN business_address_city VARCHAR(255) NULL,
  ADD COLUMN business_address_province VARCHAR(255) NULL,
  ADD COLUMN business_address_postal_code VARCHAR(255) NULL,
  -- I know we said Canada only but just in case.
  ADD COLUMN business_address_country VARCHAR(255) NULL;

