-- estimate_vehiclesテーブルにdocument_typeカラムを追加
ALTER TABLE estimate_vehicles 
ADD COLUMN document_type VARCHAR(20) NOT NULL DEFAULT 'estimate';

-- チェック制約を追加（値を限定）
ALTER TABLE estimate_vehicles 
ADD CONSTRAINT estimate_vehicles_document_type_check 
CHECK (document_type IN ('estimate', 'invoice', 'order'));

-- インデックスを追加（検索性能向上）
CREATE INDEX idx_estimate_vehicles_document_type 
ON estimate_vehicles(document_type);

-- カラムの説明を追加
COMMENT ON COLUMN estimate_vehicles.document_type IS '書類種別: estimate=見積書, invoice=請求書, order=注文書';

-- 行レベルセキュリティポリシー（全員が参照・更新可能）
-- 既存のポリシーがあるため、新しいカラムは自動的に同じ権限が適用される

-- 注文管理テーブルの作成
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  vehicle_id UUID NOT NULL,
  status INTEGER NOT NULL DEFAULT 0,
  order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_date TIMESTAMPTZ NULL,
  rejected_date TIMESTAMPTZ NULL,
  admin_user_id UUID NULL,
  reject_reason TEXT NULL,
  notes TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 外部キー制約
  CONSTRAINT fk_orders_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_orders_vehicle 
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  CONSTRAINT fk_orders_admin_user 
    FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE SET NULL,
    
  -- ステータス制約（0=注文依頼中, 1=承認済み, 2=拒否済み, 3=キャンセル済み）
  CONSTRAINT orders_status_check 
    CHECK (status IN (0, 1, 2, 3))
);

-- インデックス作成（検索性能向上）
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_vehicle_id ON orders(vehicle_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- 複合インデックス（車両・ユーザー・ステータスでの検索用）
CREATE INDEX idx_orders_vehicle_user_status ON orders(vehicle_id, user_id, status);
CREATE INDEX idx_orders_vehicle_status ON orders(vehicle_id, status);

-- 更新日時自動更新トリガー
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at_trigger
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_orders_updated_at();

-- 行レベルセキュリティを有効化
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 全員がすべての操作を実行できるポリシー
CREATE POLICY "全てのユーザーに閲覧を許可" ON orders
    FOR SELECT USING (true);

CREATE POLICY "全てのユーザーに挿入を許可" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "全てのユーザーに更新を許可" ON orders
    FOR UPDATE USING (true);

CREATE POLICY "全てのユーザーに削除を許可" ON orders
    FOR DELETE USING (true);

-- テーブルとカラムの説明を追加
COMMENT ON TABLE orders IS '車両注文管理テーブル';
COMMENT ON COLUMN orders.id IS '注文ID（主キー）';
COMMENT ON COLUMN orders.user_id IS '注文したユーザーID';
COMMENT ON COLUMN orders.vehicle_id IS '注文対象の車両ID';
COMMENT ON COLUMN orders.status IS '注文ステータス: 0=注文依頼中, 1=承認済み, 2=拒否済み, 3=キャンセル済み';
COMMENT ON COLUMN orders.order_date IS '注文日時';
COMMENT ON COLUMN orders.approved_date IS '承認日時（status=1の場合）';
COMMENT ON COLUMN orders.rejected_date IS '拒否日時（status=2の場合）';
COMMENT ON COLUMN orders.admin_user_id IS '承認/拒否したadminユーザーのID';
COMMENT ON COLUMN orders.reject_reason IS '拒否理由（status=2の場合に記録）';
COMMENT ON COLUMN orders.notes IS 'その他メモ・備考';
COMMENT ON COLUMN orders.created_at IS 'レコード作成日時';
COMMENT ON COLUMN orders.updated_at IS 'レコード更新日時';

-- 作成確認用クエリ
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;


-- -- 複数画像を格納するためのカラムを追加
-- ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT ARRAY[]::TEXT[];

-- -- 既存データの移行：image_pathからimages配列へ
-- UPDATE vehicles 
-- SET images = ARRAY[image_path] 
-- WHERE image_path IS NOT NULL AND image_path != '' AND (images IS NULL OR array_length(images, 1) IS NULL);


-- 既存のimage_pathカラムを削除（データ移行後）
ALTER TABLE vehicles DROP COLUMN IF EXISTS image_path;

-- インデックス追加（パフォーマンス向上のため）
CREATE INDEX IF NOT EXISTS idx_vehicles_images ON vehicles USING GIN(images);


-- companiesテーブルに住所と振り込み口座カラムを追加
ALTER TABLE public.companies 
ADD COLUMN address TEXT,
ADD COLUMN bank_account JSONB;

-- カラムのコメントを追加
COMMENT ON COLUMN public.companies.address IS '会社住所';
COMMENT ON COLUMN public.companies.bank_account IS '振り込み口座情報（JSON形式で銀行名、支店名、口座種別、口座番号、口座名義を格納）';

-- 更新日時の自動更新トリガーを追加（まだない場合）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーを作成（既に存在する場合は無視される）
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 行レベルセキュリティを有効化
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- 全ユーザーがすべての操作を実行できるポリシーを作成
CREATE POLICY "全てのユーザーに閲覧を許可" ON public.companies
    FOR SELECT USING (true);

CREATE POLICY "全てのユーザーに挿入を許可" ON public.companies
    FOR INSERT WITH CHECK (true);

CREATE POLICY "全てのユーザーに更新を許可" ON public.companies
    FOR UPDATE USING (true);

CREATE POLICY "全てのユーザーに削除を許可" ON public.companies
    FOR DELETE USING (true);


    -- estimate_vehiclesテーブルにarea_codeカラムを追加
-- shipping_costsテーブルのarea_codeと紐づけるためのカラム

-- area_codeカラムを追加（送料計算のために使用）
ALTER TABLE estimate_vehicles 
ADD COLUMN area_code INTEGER;

-- 外部キー制約を追加（shipping_costsテーブルのarea_codeと紐づけ）
ALTER TABLE estimate_vehicles 
ADD CONSTRAINT fk_estimate_vehicles_area_code 
FOREIGN KEY (area_code) REFERENCES shipping_costs(area_code);

-- インデックスを追加（検索性能向上のため）
CREATE INDEX IF NOT EXISTS idx_estimate_vehicles_area_code 
ON estimate_vehicles(area_code);

-- カラムの説明を追加
COMMENT ON COLUMN estimate_vehicles.area_code IS '送料エリアコード (shipping_costs.area_codeと紐づけ)';

-- スキーマキャッシュをリロード
NOTIFY pgrst, 'reload schema';

-- -- 1. 既存のポリシーをすべて削除（もしあれば）
-- DROP POLICY IF EXISTS "Allow public read access for shipping costs" ON shipping_costs;
-- DROP POLICY IF EXISTS "Allow authenticated read access for shipping costs" ON shipping_costs;
-- DROP POLICY IF EXISTS "shipping_costs_select_policy" ON shipping_costs;

-- -- 2. RLSが有効になっていることを確認
-- ALTER TABLE shipping_costs ENABLE ROW LEVEL SECURITY;
-- 方法B: または、すべての操作を許可（vehiclesテーブルと同じパターン）
CREATE POLICY "shipping_costs全アクセス許可" 
ON shipping_costs
FOR ALL 
USING (true)
WITH CHECK (true);


-- 年利フィールドを追加（小数点2桁まで、例：5.25% = 5.25）
ALTER TABLE loan_calculations 
ADD COLUMN annual_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00;

-- 年利の制約を追加（0%以上50%以下の妥当な範囲）
ALTER TABLE loan_calculations 
ADD CONSTRAINT loan_calculations_annual_rate_check 
CHECK (annual_rate >= 0.00 AND annual_rate <= 50.00);

-- インデックスを追加（年利での検索・分析用）
CREATE INDEX IF NOT EXISTS idx_loan_calculations_annual_rate 
ON loan_calculations(annual_rate);

-- カラムにコメントを追加
COMMENT ON COLUMN loan_calculations.annual_rate IS '年利（%）: 例 5.25% = 5.25';

-- スキーマキャッシュをリロード
NOTIFY pgrst, 'reload schema';