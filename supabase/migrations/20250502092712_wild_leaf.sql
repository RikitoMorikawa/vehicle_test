/*
  # 不要なカラムの削除

  1. 削除するカラム
    - manufacturer_code (makerカラムと重複)
    - features (不要)
    - description (不要)

  2. 変更内容
    - ALTER TABLE文でカラムを削除
*/

ALTER TABLE vehicles 
DROP COLUMN IF EXISTS manufacturer_code,
DROP COLUMN IF EXISTS features,
DROP COLUMN IF EXISTS description;