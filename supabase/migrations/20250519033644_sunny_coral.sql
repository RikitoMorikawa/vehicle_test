/*
  # Create tax and insurance fees table

  1. New Table
    - `tax_insurance_fees`
      - `id` (uuid, primary key)
      - `fee_1` (integer, default 0)
      - `fee_2` (integer, default 0)
      - `fee_3` (integer, default 0)
      - `fee_4` (integer, default 0)
      - `fee_5` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Authenticated users can read
    - Only admins can modify
*/

-- Create tax and insurance fees table
CREATE TABLE IF NOT EXISTS tax_insurance_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_1 integer NOT NULL DEFAULT 0,
  fee_2 integer NOT NULL DEFAULT 0,
  fee_3 integer NOT NULL DEFAULT 0,
  fee_4 integer NOT NULL DEFAULT 0,
  fee_5 integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tax_insurance_fees ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read
CREATE POLICY "認証済みユーザーは税金・保険料内訳を閲覧可能" ON tax_insurance_fees
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for admins to perform all operations
CREATE POLICY "管理者は税金・保険料内訳の全操作が可能" ON tax_insurance_fees
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Trigger for updating the updated_at timestamp
CREATE TRIGGER update_tax_insurance_fees_updated_at
  BEFORE UPDATE ON tax_insurance_fees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();