-- 見積書用車両情報テーブルの作成
CREATE TABLE estimate_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,                    -- ユーザーID（所有者/担当者など）
    maker VARCHAR(100) NOT NULL,     -- メーカー名
    name VARCHAR(200) NOT NULL,      -- 車名
    year INTEGER NOT NULL,           -- 年式
    mileage INTEGER NOT NULL,        -- 走行距離 (km)
    price INTEGER NOT NULL,          -- 車両本体価格 (円)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),  -- 作成日時
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()   -- 更新日時
);

-- 更新日時を自動的に設定するトリガー
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_estimate_vehicles
BEFORE UPDATE ON estimate_vehicles
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Supabaseでの行レベルセキュリティポリシーの設定
-- まず行レベルセキュリティを有効化
ALTER TABLE estimate_vehicles ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーに対して閲覧・更新・挿入・削除を許可するポリシーを作成
CREATE POLICY "全てのユーザーに閲覧を許可" ON estimate_vehicles
    FOR SELECT USING (true);

CREATE POLICY "全てのユーザーに更新を許可" ON estimate_vehicles
    FOR UPDATE USING (true);

CREATE POLICY "全てのユーザーに挿入を許可" ON estimate_vehicles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "全てのユーザーに削除を許可" ON estimate_vehicles
    FOR DELETE USING (true);

-- コメントを追加してテーブルの目的を明確にする
COMMENT ON TABLE estimate_vehicles IS '見積書作成プロセスで使用する車両情報を格納するテーブル';
COMMENT ON COLUMN estimate_vehicles.id IS '車両の一意識別子';
COMMENT ON COLUMN estimate_vehicles.user_id IS '車両の担当者/所有者のユーザーID';
COMMENT ON COLUMN estimate_vehicles.maker IS '車両のメーカー名';
COMMENT ON COLUMN estimate_vehicles.name IS '車両の名前/モデル';
COMMENT ON COLUMN estimate_vehicles.year IS '車両の製造年（年式）';
COMMENT ON COLUMN estimate_vehicles.mileage IS '車両の走行距離（km）';
COMMENT ON COLUMN estimate_vehicles.price IS '車両の本体価格（円）';





-- estimate_vehiclesテーブルにvehicle_idカラムを追加
ALTER TABLE estimate_vehicles 
ADD COLUMN vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE;

-- カラムに対する説明を追加
COMMENT ON COLUMN estimate_vehicles.vehicle_id IS '参照元の車両情報ID (vehicles.id)';


-- trade_in_vehicles テーブルに estimate_id カラムを追加
ALTER TABLE trade_in_vehicles 
ADD COLUMN estimate_id UUID REFERENCES estimate_vehicles(id) ON DELETE CASCADE;

-- loan_calculations テーブルにも同様に追加（必要な場合）
ALTER TABLE loan_calculations 
ADD COLUMN estimate_id UUID REFERENCES estimate_vehicles(id) ON DELETE CASCADE;

-- カラムの説明を追加
COMMENT ON COLUMN trade_in_vehicles.estimate_id IS '関連する見積もりID (estimate_vehicles.id)';
COMMENT ON COLUMN loan_calculations.estimate_id IS '関連する見積もりID (estimate_vehicles.id)';


