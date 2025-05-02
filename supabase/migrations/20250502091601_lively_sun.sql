/*
  # 車両IDとメーカー名のカラム追加

  1. 新規カラム
    - `vehicle_id` (車両ID、例: TC-22458)
    - `manufacturer_code` (メーカーコード、例: TOYOTA)

  2. データ整合性
    - 既存のレコードに対してダミーデータを設定
    - メーカー名は既存の`maker`カラムから対応するコードを設定
*/

-- 新規カラムの追加
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS vehicle_id text,
ADD COLUMN IF NOT EXISTS manufacturer_code text;

-- 既存データの更新
UPDATE vehicles
SET 
  vehicle_id = CASE maker
    WHEN 'トヨタ' THEN 'TC-' || SUBSTRING(CAST(id AS text), 1, 5)
    WHEN '日産' THEN 'NC-' || SUBSTRING(CAST(id AS text), 1, 5)
    WHEN 'ホンダ' THEN 'HC-' || SUBSTRING(CAST(id AS text), 1, 5)
    WHEN 'マツダ' THEN 'MC-' || SUBSTRING(CAST(id AS text), 1, 5)
    WHEN 'スバル' THEN 'SC-' || SUBSTRING(CAST(id AS text), 1, 5)
    ELSE 'OC-' || SUBSTRING(CAST(id AS text), 1, 5)
  END,
  manufacturer_code = CASE maker
    WHEN 'トヨタ' THEN 'TOYOTA'
    WHEN '日産' THEN 'NISSAN'
    WHEN 'ホンダ' THEN 'HONDA'
    WHEN 'マツダ' THEN 'MAZDA'
    WHEN 'スバル' THEN 'SUBARU'
    ELSE 'OTHER'
  END;

-- インデックスの作成
CREATE INDEX IF NOT EXISTS vehicles_vehicle_id_idx ON vehicles(vehicle_id);
CREATE INDEX IF NOT EXISTS vehicles_manufacturer_code_idx ON vehicles(manufacturer_code);