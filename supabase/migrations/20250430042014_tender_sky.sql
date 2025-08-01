/*
  # ユーザー情報テーブルの作成

  1. 新規テーブル
    - `users`
      - `id` (uuid, 主キー)
      - `company_name` (会社名)
      - `contact_person` (担当者名)
      - `address` (住所)
      - `phone` (電話番号)
      - `email` (メールアドレス)
      - `role` (ロール: admin, user, manager)
      - `created_at` (作成日時)
      - `updated_at` (更新日時)

  2. セキュリティ
    - RLSを有効化
    - ユーザーは自身のデータのみ読み取り・更新可能
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_person text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT users_role_check CHECK (role IN ('admin', 'user', 'manager'))
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'users_email_idx'
  ) THEN
    CREATE INDEX users_email_idx ON users(email);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'users_role_idx'
  ) THEN
    CREATE INDEX users_role_idx ON users(role);
  END IF;
END $$;