/*
  # 会社マスタテーブルの作成

  1. 新規テーブル
    - `companies`
      - `id` (uuid, 主キー)
      - `name` (会社名)
      - `created_at` (作成日時)
      - `updated_at` (更新日時)

  2. セキュリティ
    - RLSを有効化
    - 全ユーザーが読み取り可能
    - 管理者のみ更新可能
*/

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- サンプルデータの挿入
INSERT INTO companies (name) VALUES
  ('株式会社トヨタ自動車'),
  ('日産自動車株式会社'),
  ('本田技研工業株式会社'),
  ('スズキ株式会社'),
  ('マツダ株式会社'),
  ('三菱自動車工業株式会社'),
  ('スバル株式会社'),
  ('ダイハツ工業株式会社'),
  ('いすゞ自動車株式会社'),
  ('日野自動車株式会社')
ON CONFLICT (name) DO NOTHING;

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが読み取り可能
CREATE POLICY "Anyone can read companies"
  ON companies
  FOR SELECT
  TO public
  USING (true);

-- 管理者のみ更新可能
CREATE POLICY "Only admins can modify companies"
  ON companies
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));