/*
  # お気に入り機能の追加

  1. 新規テーブル
    - `favorites`
      - `id` (uuid, 主キー)
      - `user_id` (uuid, ユーザーID)
      - `vehicle_id` (uuid, 車両ID)
      - `created_at` (作成日時)

  2. セキュリティ
    - RLSを有効化
    - ユーザーは自身のお気に入りのみ読み取り・更新可能
*/

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, vehicle_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- ユーザーは自身のお気に入りのみ読み取り可能
CREATE POLICY "Users can read own favorites"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ユーザーは自身のお気に入りのみ追加可能
CREATE POLICY "Users can insert own favorites"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ユーザーは自身のお気に入りのみ削除可能
CREATE POLICY "Users can delete own favorites"
  ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- インデックスの作成
CREATE INDEX favorites_user_id_idx ON favorites(user_id);
CREATE INDEX favorites_vehicle_id_idx ON favorites(vehicle_id);