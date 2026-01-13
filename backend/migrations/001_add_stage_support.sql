-- Migration: Add Stage support
-- Run this on PostgreSQL database

-- 1. Create firmware_variants table
CREATE TABLE IF NOT EXISTS firmware_variants (
    id SERIAL PRIMARY KEY,
    firmware_id INTEGER NOT NULL REFERENCES firmwares(id),
    stage VARCHAR(50) NOT NULL,
    stage_name VARCHAR(100) NOT NULL,
    description TEXT,
    power_increase VARCHAR(50),
    torque_increase VARCHAR(50),
    modifications TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 50.0,
    s3_key VARCHAR(500),
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_firmware_variants_firmware_id ON firmware_variants(firmware_id);
CREATE INDEX IF NOT EXISTS idx_firmware_variants_stage ON firmware_variants(stage);

-- 2. Add new columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS variant_id INTEGER REFERENCES firmware_variants(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stage VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS s3_key VARCHAR(500);

-- 3. Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_stage ON orders(stage);
CREATE INDEX IF NOT EXISTS idx_orders_variant_id ON orders(variant_id);

-- Done!
-- Now you can:
-- 1. Upload Stage files to Object Storage
-- 2. Insert records into firmware_variants with s3_key
-- 3. Bot will show Stage selection and generate Presigned URLs
