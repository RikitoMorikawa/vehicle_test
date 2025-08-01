/*
  # 下取車両テーブルの作成

  1. 新規テーブル
    - `trade_in_vehicles`
      - `id` (uuid, primary key)
      - `vehicle_name` (text, 車名)
      - `registration_number` (text, 登録番号)
      - `mileage` (integer, 走行距離)
      - `first_registration_date` (date, 初度登録年月)
      - `inspection_expiry_date` (date, 車検満了日)
      - `chassis_number` (text, 車台番号)
      - `exterior_color` (text, 外装色)
      - `created_at` (timestamptz, 作成日時)
      - `updated_at` (timestamptz, 更新日時)

  2. セキュリティ
    - RLSを有効化
    - 認証済みユーザーのみ読み取り可能
    - 管理者のみ作成・更新・削除可能
*/

-- 下取車両テーブルの作成
CREATE TABLE IF NOT EXISTS trade_in_vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_name text NOT NULL,
  registration_number text NOT NULL,
  mileage integer NOT NULL,
  first_registration_date date NOT NULL,
  inspection_expiry_date date NOT NULL,
  chassis_number text NOT NULL,
  exterior_color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_trade_in_vehicles_registration_number ON trade_in_vehicles(registration_number);
CREATE INDEX IF NOT EXISTS idx_trade_in_vehicles_chassis_number ON trade_in_vehicles(chassis_number);

-- RLSの有効化
ALTER TABLE trade_in_vehicles ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーの読み取りポリシー
CREATE POLICY "認証済みユーザーは下取車両情報を閲覧可能" ON trade_in_vehicles
  FOR SELECT
  TO authenticated
  USING (true);

-- 管理者の全操作ポリシー
CREATE POLICY "管理者は下取車両情報の全操作が可能" ON trade_in_vehicles
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

-- 更新日時を自動更新するトリガー
CREATE TRIGGER update_trade_in_vehicles_updated_at
  BEFORE UPDATE ON trade_in_vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();