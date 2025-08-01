/*
  # 車両データの更新

  1. 変更内容
    - 既存の車両レコードに詳細情報を追加
    - 各車両に応じた適切なスペックを設定

  2. データ整合性
    - 各メーカーの実際の車両スペックに近い値を設定
    - 妥当な車検日と装備品を設定
*/

-- セレナのデータ更新
UPDATE vehicles
SET
  model_code = 'DBA-C27',
  color = 'ブリリアントホワイトパール',
  engine_size = 2000,
  transmission = 'CVT',
  drive_system = 'FF',
  inspection_date = '2025-06-30',
  description = '【装備】\n・プロパイロット\n・両側電動スライドドア\n・アラウンドビューモニター\n・エマージェンシーブレーキ\n\n【状態】\n・ワンオーナー\n・禁煙車\n・取扱説明書あり',
  features = '[
    "両側電動スライドドア",
    "アラウンドビューモニター",
    "プロパイロット",
    "LEDヘッドライト",
    "衝突被害軽減ブレーキ",
    "レーダークルーズ",
    "パワーシート",
    "フルセグTV"
  ]'::jsonb
WHERE name = 'セレナ';

-- フィットのデータ更新
UPDATE vehicles
SET
  model_code = 'DBA-GR3',
  color = 'プレミアムクリスタルレッド',
  engine_size = 1500,
  transmission = 'CVT',
  drive_system = 'FF',
  inspection_date = '2024-12-31',
  description = '【装備】\n・Honda SENSING\n・LEDヘッドライト\n・スマートキー\n・純正ナビ\n\n【状態】\n・ワンオーナー\n・禁煙車\n・点検記録簿あり',
  features = '[
    "Honda SENSING",
    "LEDヘッドライト",
    "スマートキー",
    "純正ナビ",
    "バックカメラ",
    "ETC",
    "アイドリングストップ",
    "衝突軽減ブレーキ"
  ]'::jsonb
WHERE name = 'フィット';

-- CX-5のデータ更新
UPDATE vehicles
SET
  model_code = 'DBA-KF5P',
  color = 'ソウルレッドクリスタル',
  engine_size = 2500,
  transmission = '6AT',
  drive_system = 'AWD',
  inspection_date = '2025-09-30',
  description = '【装備】\n・i-ACTIVSENSE\n・マツダコネクト\n・BOSEサウンド\n・本革シート\n\n【状態】\n・ワンオーナー\n・禁煙車\n・ディーラー整備記録あり',
  features = '[
    "本革シート",
    "BOSEサウンド",
    "パワーシート",
    "シートヒーター",
    "パワーリアゲート",
    "全方位モニター",
    "レーダークルーズ",
    "BSM"
  ]'::jsonb
WHERE name = 'CX-5';

-- フォレスターのデータ更新
UPDATE vehicles
SET
  model_code = 'DBA-SK5',
  color = 'クリスタルホワイト・パール',
  engine_size = 2500,
  transmission = 'CVT',
  drive_system = 'AWD',
  inspection_date = '2024-08-31',
  description = '【装備】\n・アイサイト\n・純正SDナビ\n・パワーシート\n・LEDヘッドライト\n\n【状態】\n・2オーナー\n・禁煙車\n・取扱説明書あり',
  features = '[
    "アイサイト",
    "純正SDナビ",
    "パワーシート",
    "LEDヘッドライト",
    "全方位モニター",
    "ETC2.0",
    "シートヒーター",
    "パワーリアゲート"
  ]'::jsonb
WHERE name = 'フォレスター';

-- ヴェルファイアのデータ更新
UPDATE vehicles
SET
  model_code = 'DBA-GGH30W',
  color = 'ブラック',
  engine_size = 3500,
  transmission = '8AT',
  drive_system = '4WD',
  inspection_date = '2025-05-31',
  description = '【装備】\n・Toyota Safety Sense\n・JBLプレミアムサウンド\n・ツインムーンルーフ\n・後席モニター\n\n【状態】\n・ワンオーナー\n・禁煙車\n・ディーラー整備記録あり',
  features = '[
    "ツインムーンルーフ",
    "JBLサウンド",
    "後席モニター",
    "両側パワースライド",
    "パワーバックドア",
    "黒革シート",
    "パワーシート",
    "デジタルインナーミラー"
  ]'::jsonb
WHERE name = 'ヴェルファイア';

-- ノートのデータ更新
UPDATE vehicles
SET
  model_code = 'DBA-E13',
  color = 'ブリリアントシルバー',
  engine_size = 1200,
  transmission = 'CVT',
  drive_system = 'FF',
  inspection_date = '2025-02-28',
  description = '【装備】\n・プロパイロット\n・e-POWER\n・純正ナビ\n・アラウンドビューモニター\n\n【状態】\n・ワンオーナー\n・禁煙車\n・取扱説明書あり',
  features = '[
    "e-POWER",
    "プロパイロット",
    "純正ナビ",
    "アラウンドビューモニター",
    "LEDヘッドライト",
    "衝突軽減ブレーキ",
    "オートエアコン",
    "スマートキー"
  ]'::jsonb
WHERE name = 'ノート';

-- ステップワゴンのデータ更新
UPDATE vehicles
SET
  model_code = 'DBA-RP3',
  color = 'プレミアムディープロッソ・パール',
  engine_size = 1500,
  transmission = 'CVT',
  drive_system = 'FF',
  inspection_date = '2024-11-30',
  description = '【装備】\n・Honda SENSING\n・両側電動スライドドア\n・純正ナビ\n・バックカメラ\n\n【状態】\n・2オーナー\n・禁煙車\n・点検記録簿あり',
  features = '[
    "両側電動スライドドア",
    "Honda SENSING",
    "純正ナビ",
    "バックカメラ",
    "LEDヘッドライト",
    "ETC",
    "スマートキー",
    "アイドリングストップ"
  ]'::jsonb
WHERE name = 'ステップワゴン';