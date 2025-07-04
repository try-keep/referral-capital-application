-- Add registry_entity_type column to businesses table
ALTER TABLE businesses
ADD COLUMN registry_entity_type text;
