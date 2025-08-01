/*
  # 車両詳細情報の追加

  1. 新規カラム
    - `model_code` (型式)
    - `color` (ボディカラー)
    - `engine_size` (排気量)
    - `transmission` (シフト)
    - `drive_system` (駆動方式)
    - `inspection_date` (車検満了日)
    - `description` (説明文)
    - `features` (装備品, JSONB型で複数の装備を管理)
*/

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS model_code text;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS color text;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS engine_size integer;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS transmission text;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS drive_system text;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS inspection_date date;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS features jsonb;

-- サンプルデータの更新
UPDATE vehicles
SET
  model_code = 'DBA-GWS224',
  color = 'プレシャスブラックパール',
  engine_size = 2500,
  transmission = 'AT (8速)',
  drive_system = 'FR',
  inspection_date = '2025-03-31',
  description = '【装備】\n・プリクラッシュセーフティ\n・レーダークルーズコントロール\n・レーンディパーチャーアラート\n・オートマチックハイビーム\n\n【状態】\n・ワンオーナー\n・禁煙車\n・取扱説明書あり',
  features = '[
    "サンルーフ",
    "本革シート",
    "パワーシート",
    "シートヒーター",
    "シートエアコン",
    "メモリーシート",
    "電動リアサンシェード",
    "パワートランク"
  ]'::jsonb
WHERE id IN (SELECT id FROM vehicles LIMIT 1);