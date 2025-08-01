/*
  # 車両データテーブルの作成

  1. 新規テーブル
    - `vehicles`
      - `id` (uuid, 主キー)
      - `name` (車両名)
      - `maker` (メーカー)
      - `year` (年式)
      - `mileage` (走行距離)
      - `price` (価格)
      - `image_url` (画像URL)
      - `created_at` (作成日時)
      - `updated_at` (更新日時)

  2. セキュリティ
    - RLSを有効化
    - 全ユーザーが読み取り可能
    - 管理者のみ更新可能
*/

CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  maker text NOT NULL,
  year integer NOT NULL,
  mileage integer NOT NULL,
  price integer NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- サンプルデータの挿入
INSERT INTO vehicles (name, maker, year, mileage, price, image_url) VALUES
  ('クラウン', 'トヨタ', 2022, 15000, 3500000, 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg'),
  ('セレナ', '日産', 2023, 5000, 2800000, 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg'),
  ('フィット', 'ホンダ', 2022, 25000, 1750000, 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg'),
  ('CX-5', 'マツダ', 2023, 10000, 3280000, 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg'),
  ('フォレスター', 'スバル', 2021, 35000, 2460000, 'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg'),
  ('ヴェルファイア', 'トヨタ', 2022, 20000, 4500000, 'https://images.pexels.com/photos/248687/pexels-photo-248687.jpeg'),
  ('ノート', '日産', 2023, 8000, 1890000, 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg'),
  ('ステップワゴン', 'ホンダ', 2021, 30000, 2760000, 'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg');

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが読み取り可能
CREATE POLICY "Anyone can read vehicles"
  ON vehicles
  FOR SELECT
  TO public
  USING (true);

-- 管理者のみ更新可能
CREATE POLICY "Only admins can modify vehicles"
  ON vehicles
  FOR ALL
  TO public
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));