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