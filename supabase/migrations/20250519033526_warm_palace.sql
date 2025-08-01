/*
  # 預り法定費用内訳テーブルの作成

  1. 新規テーブル
    - `legal_fees`
      - `id` (uuid, primary key)
      - `inspection_registration_stamp` (integer, 検査登録印紙代)
      - `parking_certificate_stamp` (integer, 車庫証明印紙代)
      - `trade_in_stamp` (integer, 下取車手続・処分印紙代)
      - `recycling_deposit` (integer, リサイクル預託金)
      - `other_nontaxable` (integer, その他非課税費用)
      - `created_at` (timestamptz, 作成日時)
      - `updated_at` (timestamptz, 更新日時)

  2. セキュリティ
    - RLSを有効化
    - 認証済みユーザーのみ読み取り可能
    - 管理者のみ作成・更新・削除可能
*/

-- 預り法定費用内訳テーブルの作成
CREATE TABLE IF NOT EXISTS legal_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_registration_stamp integer NOT NULL DEFAULT 0,
  parking_certificate_stamp integer NOT NULL DEFAULT 0,
  trade_in_stamp integer NOT NULL DEFAULT 0,
  recycling_deposit integer NOT NULL DEFAULT 0,
  other_nontaxable integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLSの有効化
ALTER TABLE legal_fees ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーの読み取りポリシー
CREATE POLICY "認証済みユーザーは預り法定費用内訳を閲覧可能" ON legal_fees
  FOR SELECT
  TO authenticated
  USING (true);

-- 管理者の全操作ポリシー
CREATE POLICY "管理者は預り法定費用内訳の全操作が可能" ON legal_fees
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 更新日時を自動更新するトリガー
CREATE TRIGGER update_legal_fees_updated_at
  BEFORE UPDATE ON legal_fees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();