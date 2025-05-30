-- vehicles テーブルに新しいカラムを追加
ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS vehicle_status VARCHAR(10),
  ADD COLUMN IF NOT EXISTS full_model_code VARCHAR(50),
  ADD COLUMN IF NOT EXISTS grade VARCHAR(100),
  ADD COLUMN IF NOT EXISTS registration_number VARCHAR(20),
  ADD COLUMN IF NOT EXISTS first_registration_date DATE,
  ADD COLUMN IF NOT EXISTS chassis_number VARCHAR(50),
  ADD COLUMN IF NOT EXISTS body_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS door_count INTEGER CHECK (door_count BETWEEN 1 AND 10),
  ADD COLUMN IF NOT EXISTS desired_number VARCHAR(50),
  ADD COLUMN IF NOT EXISTS sales_format VARCHAR(50),
  ADD COLUMN IF NOT EXISTS accident_history BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS recycling_deposit BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS registration_date DATE,
  ADD COLUMN IF NOT EXISTS tax_rate INTEGER CHECK (tax_rate IN (8, 10));