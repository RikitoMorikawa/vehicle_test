/*
  # Create accessories and special features table

  1. New Tables
    - `accessories`
      - `id` (uuid, primary key)
      - `name` (text, item name)
      - `price` (integer, item price)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Authenticated users can read
    - Only admins can modify
*/

-- Create accessories table
CREATE TABLE IF NOT EXISTS accessories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read
CREATE POLICY "認証済みユーザーは付属品・特別仕様を閲覧可能" ON accessories
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for admins to perform all operations
CREATE POLICY "管理者は付属品・特別仕様の全操作が可能" ON accessories
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
CREATE TRIGGER update_accessories_updated_at
  BEFORE UPDATE ON accessories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();