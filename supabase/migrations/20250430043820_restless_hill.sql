/*
  # ユーザー承認機能の追加

  1. テーブル変更
    - `users`テーブルに`is_approved`カラムを追加
      - デフォルトはfalse
      - 管理者は自動的に承認済み

  2. セキュリティ
    - RLSポリシーの更新
*/

ALTER TABLE users ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT false;

-- 既存の管理者ユーザーを承認済みに設定
UPDATE users SET is_approved = true WHERE role = 'admin';

-- 新規作成時に管理者は自動的に承認済みに
CREATE OR REPLACE FUNCTION set_admin_approved()
RETURNS trigger AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    NEW.is_approved := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_admin_approved_trigger
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_admin_approved();