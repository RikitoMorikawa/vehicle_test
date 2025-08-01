/*
  # 販売価格テーブルの作成

  1. 新規テーブル
    - `sales_prices`
      - `id` (uuid, primary key)
      - `vehicle_id` (uuid, 外部キー)
      - `base_price` (integer, 車両本体価格)
      - `discount` (integer, 値引き)
      - `inspection_fee` (integer, 車検整備費用)
      - `accessories_fee` (integer, 付属品・特別仕様)
      - `vehicle_price` (integer, 車両販売価格)
      - `tax_insurance` (integer, 税金・保険料)
      - `legal_fee` (integer, 預り法定費用)
      - `processing_fee` (integer, 手続代行費用)
      - `misc_fee` (integer, 販売諸費用)
      - `consumption_tax` (integer, 内消費税)
      - `total_price` (integer, 現金販売価格)
      - `trade_in_price` (integer, 下取車価格)
      - `trade_in_debt` (integer, 下取車残債)
      - `payment_total` (integer, お支払総額)
      - `created_at` (timestamptz, 作成日時)
      - `updated_at` (timestamptz, 更新日時)

  2. セキュリティ
    - RLSを有効化
    - 認証済みユーザーのみ読み取り可能
    - 管理者のみ作成・更新・削除可能
*/

-- 販売価格テーブルの作成
CREATE TABLE IF NOT EXISTS sales_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  base_price integer NOT NULL DEFAULT 0,
  discount integer NOT NULL DEFAULT 0,
  inspection_fee integer NOT NULL DEFAULT 0,
  accessories_fee integer NOT NULL DEFAULT 0,
  vehicle_price integer NOT NULL DEFAULT 0,
  tax_insurance integer NOT NULL DEFAULT 0,
  legal_fee integer NOT NULL DEFAULT 0,
  processing_fee integer NOT NULL DEFAULT 0,
  misc_fee integer NOT NULL DEFAULT 0,
  consumption_tax integer NOT NULL DEFAULT 0,
  total_price integer NOT NULL DEFAULT 0,
  trade_in_price integer NOT NULL DEFAULT 0,
  trade_in_debt integer NOT NULL DEFAULT 0,
  payment_total integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_sales_prices_vehicle_id ON sales_prices(vehicle_id);

-- RLSの有効化
ALTER TABLE sales_prices ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーの読み取りポリシー
CREATE POLICY "認証済みユーザーは販売価格を閲覧可能" ON sales_prices
  FOR SELECT
  TO authenticated
  USING (true);

-- 管理者の全操作ポリシー
CREATE POLICY "管理者は販売価格の全操作が可能" ON sales_prices
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

-- 更新日時を自動更新するトリガーの作成
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sales_prices_updated_at
  BEFORE UPDATE ON sales_prices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();