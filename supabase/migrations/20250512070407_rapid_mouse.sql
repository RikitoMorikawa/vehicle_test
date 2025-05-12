-- 既存テーブルを削除
DROP TABLE IF EXISTS loan_applications;

-- テーブルを再作成
CREATE TABLE loan_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  vehicle_id UUID NOT NULL,
  company_name TEXT,
  customer_name TEXT NOT NULL,
  customer_name_kana TEXT NOT NULL,
  customer_birth_date TEXT NOT NULL,
  customer_postal_code TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_phone TEXT,
  customer_mobile_phone TEXT NOT NULL,
  employer_name TEXT NOT NULL,
  employer_postal_code TEXT NOT NULL,
  employer_address TEXT NOT NULL,
  employer_phone TEXT NOT NULL,
  employment_type TEXT NOT NULL,
  years_employed INTEGER NOT NULL,
  annual_income INTEGER NOT NULL,
  identification_doc_url TEXT,
  income_doc_url TEXT,
  vehicle_price INTEGER NOT NULL,
  down_payment INTEGER NOT NULL,
  payment_months INTEGER NOT NULL,
  bonus_months TEXT,
  bonus_amount INTEGER,
  guarantor_name TEXT,
  guarantor_name_kana TEXT,
  guarantor_relationship TEXT,
  guarantor_phone TEXT,
  guarantor_postal_code TEXT,
  guarantor_address TEXT,
  notes TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  contact_email TEXT
);

-- 外部キー制約の追加
ALTER TABLE loan_applications
ADD CONSTRAINT fk_loan_applications_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE loan_applications
ADD CONSTRAINT fk_loan_applications_vehicle
FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE;

-- インデックスの追加
CREATE INDEX idx_loan_applications_user_id ON loan_applications(user_id);
CREATE INDEX idx_loan_applications_vehicle_id ON loan_applications(vehicle_id);
CREATE INDEX idx_loan_applications_status ON loan_applications(status);