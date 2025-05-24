/*
  # 税金・保険料テーブルのカラム名変更

  1. 変更内容
    - fee_1 → automobile_tax (自動車税)
    - fee_2 → environmental_performance_tax (環境性能割)
    - fee_3 → weight_tax (重量税)
    - fee_4 → liability_insurance_fee (自賠責保険料)
    - fee_5 → voluntary_insurance_fee (任意保険料)

  2. セキュリティ
    - RLSを維持
    - 既存のポリシーを維持
*/

-- 一時的に既存のテーブルをバックアップ
CREATE TABLE tax_insurance_fees_backup AS
SELECT * FROM tax_insurance_fees;

-- 既存のテーブルを削除
DROP TABLE tax_insurance_fees;

-- 新しいカラム名でテーブルを再作成
CREATE TABLE tax_insurance_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  automobile_tax integer DEFAULT 0 NOT NULL,
  environmental_performance_tax integer DEFAULT 0 NOT NULL,
  weight_tax integer DEFAULT 0 NOT NULL,
  liability_insurance_fee integer DEFAULT 0 NOT NULL,
  voluntary_insurance_fee integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- バックアップからデータを移行
INSERT INTO tax_insurance_fees (
  id,
  automobile_tax,
  environmental_performance_tax,
  weight_tax,
  liability_insurance_fee,
  voluntary_insurance_fee,
  created_at,
  updated_at
)
SELECT
  id,
  fee_1,
  fee_2,
  fee_3,
  fee_4,
  fee_5,
  created_at,
  updated_at
FROM tax_insurance_fees_backup;

-- バックアップテーブルを削除
DROP TABLE tax_insurance_fees_backup;

-- RLSを有効化
ALTER TABLE tax_insurance_fees ENABLE ROW LEVEL SECURITY;

-- ポリシーを作成
CREATE POLICY "管理者は税金・保険料内訳の全操作が可能"
ON tax_insurance_fees
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid()
  AND users.role = 'admin'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid()
  AND users.role = 'admin'
));

CREATE POLICY "認証済みユーザーは税金・保険料内訳を閲覧可"
ON tax_insurance_fees
FOR SELECT
TO authenticated
USING (true);

-- updated_at更新用のトリガーを作成
CREATE TRIGGER update_tax_insurance_fees_updated_at
  BEFORE UPDATE ON tax_insurance_fees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

  -- accessories テーブルに estimate_id カラムを追加する
ALTER TABLE accessories ADD COLUMN estimate_id UUID REFERENCES estimate_vehicles(id) ON DELETE CASCADE;

-- インデックスを作成して検索を高速化
CREATE INDEX accessories_estimate_id_idx ON accessories(estimate_id);

-- コメントを追加（オプション）
COMMENT ON COLUMN accessories.estimate_id IS '関連する見積もりのID';

-- テーブルが既に存在する場合は、estimate_id カラムを追加
ALTER TABLE tax_insurance_fees 
ADD COLUMN IF NOT EXISTS estimate_id UUID REFERENCES estimate_vehicles(id) ON DELETE CASCADE;

-- インデックスを作成（まだ存在していない場合）
CREATE INDEX IF NOT EXISTS tax_insurance_fees_estimate_id_idx ON tax_insurance_fees(estimate_id);

-- テーブルのキャッシュを更新（Postgrestキャッシュの更新）
NOTIFY pgrst, 'reload schema';

-- テーブルが既に存在する場合は、estimate_id カラムを追加
ALTER TABLE legal_fees 
ADD COLUMN IF NOT EXISTS estimate_id UUID REFERENCES estimate_vehicles(id) ON DELETE CASCADE;

-- インデックスを作成（まだ存在していない場合）
CREATE INDEX IF NOT EXISTS legal_fees_estimate_id_idx ON legal_fees(estimate_id);

-- スキーマキャッシュをリロード
NOTIFY pgrst, 'reload schema';

-- テーブルが既に存在する場合は、estimate_id カラムを追加
ALTER TABLE processing_fees 
ADD COLUMN IF NOT EXISTS estimate_id UUID REFERENCES estimate_vehicles(id) ON DELETE CASCADE;

-- インデックスを作成（まだ存在していない場合）
CREATE INDEX IF NOT EXISTS processing_fees_estimate_id_idx ON processing_fees(estimate_id);

-- スキーマキャッシュをリロード
NOTIFY pgrst, 'reload schema';

-- テーブルが既に存在する場合は、estimate_id カラムを追加
ALTER TABLE sales_prices 
ADD COLUMN IF NOT EXISTS estimate_id UUID REFERENCES estimate_vehicles(id) ON DELETE CASCADE;

-- インデックスを作成（まだ存在していない場合）
CREATE INDEX IF NOT EXISTS sales_prices_estimate_id_idx ON sales_prices(estimate_id);

-- スキーマキャッシュをリロード
NOTIFY pgrst, 'reload schema';

-- 1. テーブルに対するRLSを有効化（既に有効になっている場合はスキップ可能）
ALTER TABLE sales_prices ENABLE ROW LEVEL SECURITY;

-- 2. すべての操作を許可するポリシーを追加
CREATE POLICY sales_prices_policy
  ON sales_prices
  USING (true)
  WITH CHECK (true);

  -- estimate_vehiclesテーブルにcompany_idカラムを追加
ALTER TABLE estimate_vehicles
ADD COLUMN company_id UUID REFERENCES companies(id);

-- インデックスを追加（検索パフォーマンス向上のため）
CREATE INDEX idx_estimate_vehicles_company_id ON estimate_vehicles(company_id);

-- 1. テーブルに対するRLSを有効化
CREATE POLICY "Allow public read access for PDF generation" ON trade_in_vehicles
FOR SELECT
TO public
USING (true);