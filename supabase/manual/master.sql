-- 本番DBへのマスタ挿入マニュアル


-- 加盟店マスタ
INSERT INTO public.companies (
  name,
  address,
  bank_account
) VALUES
  (
    '株式会社サンプル',
    '東京都新宿区西新宿1-1-1',
    '{
      "bank_name": "みずほ銀行",
      "branch_name": "新宿支店",
      "account_type": "普通",
      "account_number": "1234567",
      "account_holder": "カブシキガイシャサンプル"
    }'
  ),
  (
    'テスト商事株式会社',
    '大阪府大阪市中央区2-2-2',
    '{
      "bank_name": "三井住友銀行",
      "branch_name": "大阪支店",
      "account_type": "当座",
      "account_number": "7654321",
      "account_holder": "テストショウジカブシキガイシャ"
    }'
  );



-- 運送マスタ
INSERT INTO public.shipping_costs (
  area_code,
  prefecture,
  city,
  cost
) VALUES
  (
    101,
    '東京都',
    '新宿区',
    800
  ),
  (
    102,
    '大阪府',
    '大阪市中央区',
    1000
  );


-- 車メーカーマスタ
INSERT INTO public.car_makers (
  name,
  logo_url,
  country
) VALUES
  (
    'テスト01',
    NULL,
    '日本'
  ),
  (
    'テスト02',
    NULL,
    'ドイツ'
  );


-- 管理者登録クエリ
INSERT INTO public.users (
  company_name,
  user_name,
  phone,
  email,
  password,
  role,
  is_approved
) VALUES (
  '管理会社株式会社',
  '山田 太郎',
  '090-1234-5678',
  'admin@example.com',
  'secure_password_hash',
  'admin',
  true
);



-- ストレージ名
vehicle-images (Public)
vehicle-360 (Public)
loan-documents (Private)