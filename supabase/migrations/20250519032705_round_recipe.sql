/*
  # ローン計算テーブルの作成

  1. 新規テーブル
    - `loan_calculations`
      - `id` (uuid, primary key)
      - `down_payment` (integer, 頭金)
      - `principal` (integer, 現金・割賦元金)
      - `interest_fee` (integer, 分割払手数料)
      - `total_payment` (integer, 分割支払金合計)
      - `payment_count` (integer, 支払回数)
      - `payment_period` (integer, 支払期間（月数）)
      - `first_payment` (integer, 初回支払額)
      - `monthly_payment` (integer, 2回目以降支払額)
      - `bonus_months` (text[], ボーナス加算月)
      - `bonus_amount` (integer, ボーナス加算額)
      - `created_at` (timestamptz, 作成日時)
      - `updated_at` (timestamptz, 更新日時)

  2. セキュリティ
    - RLSを有効化
    - 認証済みユーザーのみ読み取り可能
    - 管理者のみ作成・更新・削除可能
*/

-- ローン計算テーブルの作成
CREATE TABLE IF NOT EXISTS loan_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  down_payment integer NOT NULL DEFAULT 0,
  principal integer NOT NULL DEFAULT 0,
  interest_fee integer NOT NULL DEFAULT 0,
  total_payment integer NOT NULL DEFAULT 0,
  payment_count integer NOT NULL CHECK (payment_count > 0),
  payment_period integer NOT NULL CHECK (payment_period > 0),
  first_payment integer NOT NULL DEFAULT 0,
  monthly_payment integer NOT NULL DEFAULT 0,
  bonus_months text[] DEFAULT '{}',
  bonus_amount integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_loan_calculations_payment_period ON loan_calculations(payment_period);

-- RLSの有効化
ALTER TABLE loan_calculations ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーの読み取りポリシー
CREATE POLICY "認証済みユーザーはローン計算情報を閲覧可能" ON loan_calculations
  FOR SELECT
  TO authenticated
  USING (true);

-- 管理者の全操作ポリシー
CREATE POLICY "管理者はローン計算情報の全操作が可能" ON loan_calculations
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
CREATE TRIGGER update_loan_calculations_updated_at
  BEFORE UPDATE ON loan_calculations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();