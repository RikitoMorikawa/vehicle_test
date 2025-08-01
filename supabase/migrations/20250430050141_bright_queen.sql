/*
  # ユーザーテーブルのスキーマ更新

  1. 変更内容
    - contact_personカラムをuser_nameにリネーム
    - addressカラムの削除

  2. データの整合性
    - 既存のデータは保持
    - カラム名の変更のみ実行
*/

DO $$ 
BEGIN 
  -- contact_personカラムをuser_nameにリネーム
  ALTER TABLE users RENAME COLUMN contact_person TO user_name;
  
  -- addressカラムの削除
  ALTER TABLE users DROP COLUMN IF EXISTS address;
END $$;