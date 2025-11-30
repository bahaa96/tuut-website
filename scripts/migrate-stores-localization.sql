-- Migration: Add localized columns to stores table
-- This migration adds English and Arabic variants for title, description, and slug columns

-- Add new localized columns for title
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS title_ar TEXT;

-- Add new localized columns for description
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_ar TEXT;

-- Add new localized columns for slug
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS slug_en TEXT,
ADD COLUMN IF NOT EXISTS slug_ar TEXT;

-- Migrate data from existing columns to new English columns
UPDATE stores
SET
  title_en = title,
  description_en = description,
  slug_en = slug
WHERE
  title IS NOT NULL OR description IS NOT NULL OR slug IS NOT NULL;

-- Add constraints to ensure at least English version is required
ALTER TABLE stores
ADD CONSTRAINT IF NOT EXISTS stores_title_en_required CHECK (title_en IS NOT NULL AND title_en <> '');

-- Add unique constraints for slugs
ALTER TABLE stores
ADD CONSTRAINT IF NOT EXISTS stores_slug_en_unique UNIQUE (slug_en),
ADD CONSTRAINT IF NOT EXISTS stores_slug_ar_unique UNIQUE (slug_ar);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_stores_title_en ON stores(title_en);
CREATE INDEX IF NOT EXISTS idx_stores_title_ar ON stores(title_ar);
CREATE INDEX IF NOT EXISTS idx_stores_slug_en ON stores(slug_en);
CREATE INDEX IF NOT EXISTS idx_stores_slug_ar ON stores(slug_ar);

-- Comment on the new columns
COMMENT ON COLUMN stores.title_en IS 'English name of the store (required)';
COMMENT ON COLUMN stores.title_ar IS 'Arabic name of the store (optional)';
COMMENT ON COLUMN stores.description_en IS 'English description of the store (optional)';
COMMENT ON COLUMN stores.description_ar IS 'Arabic description of the store (optional)';
COMMENT ON COLUMN stores.slug_en IS 'English URL-friendly slug for the store (required)';
COMMENT ON COLUMN stores.slug_ar IS 'Arabic URL-friendly slug for the store (optional)';

-- Create a function to automatically generate slugs if they don't exist
CREATE OR REPLACE FUNCTION generate_store_slug_en()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug_en IS NULL OR NEW.slug_en = '' THEN
    NEW.slug_en := lower(regexp_replace(replace(NEW.title_en, ' ', '-'), '[^a-zA-Z0-9\-]', '', 'g'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically generate slugs for new stores
CREATE TRIGGER generate_store_slug_en_trigger
  BEFORE INSERT OR UPDATE ON stores
  FOR EACH ROW
  WHEN (NEW.slug_en IS NULL OR NEW.slug_en = '')
  EXECUTE FUNCTION generate_store_slug_en();