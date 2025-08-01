/*
  # 手続代行費用内訳テーブルの作成

  1. 新規テーブル
    - `processing_fees`
      - `id` (uuid, primary key)
      - `inspection_registration_fee` (integer, 検査登録手続代行)
      - `parking_certificate_fee` (integer, 車庫証明手続代行)
      - `trade_in_processing_fee` (integer, 下取車手続・処分手続代行)
      - `trade_in_assessment_fee` (integer, 下取車査定料)
      - `recycling_management_fee` (integer, リサイクル管理費用)
      - `delivery_fee` (integer, 納車費用)
      - `other_fees` (integer, その他費用)
      - `created_at` (timestamptz, 作成日時)
      - `updated_at` (timestamptz, 更新日時)

  2. セキュリティ
    - RLSを有効化
    - 認証済みユーザーのみ読み取り可能
    - 管理者のみ作成・更新・削除可能
*/

-- 手続代行費用内訳テーブルの作成
CREATE TABLE IF NOT EXISTS processing_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_registration_fee integer NOT NULL DEFAULT 0,
  parking_certificate_fee integer NOT NULL DEFAULT 0,
  trade_in_processing_fee integer NOT NULL DEFAULT 0,
  trade_in_assessment_fee integer NOT NULL DEFAULT 0,
  recycling_management_fee integer NOT NULL DEFAULT 0,
  delivery_fee integer NOT NULL DEFAULT 0,
  other_fees integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLSの有効化
ALTER TABLE processing_fees ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーの読み取りポリシー
CREATE POLICY "認証済みユーザーは手続代行費用内訳を閲覧可能" ON processing_fees
  FOR SELECT
  TO authenticated
  USING (true);

-- 管理者の全操作ポリシー
CREATE POLICY "管理者は手続代行費用内訳の全操作が可能" ON processing_fees
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
CREATE TRIGGER update_processing_fees_updated_at
  BEFORE UPDATE ON processing_fees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();