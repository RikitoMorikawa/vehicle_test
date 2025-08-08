// types/loan-application/page.ts

// 車両型定義
export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    // 他の車両関連フィールド
  }

  // ローン申請ステータス定数
export const LOAN_APPLICATION_STATUS = {
  PENDING: 0,     // 審査待ち
  REVIEWING: 1,   // 審査中
  APPROVED: 2,    // 承認済み
  REJECTED: 3,    // 否認
} as const;
export interface LoanApplicationFormData {
  // 基本情報
  customer_name: string;
  customer_name_kana: string;
  customer_birth_date: string;
  customer_postal_code: string;
  customer_address: string;
  customer_phone: string;
  customer_mobile_phone: string;

  // 居住情報（新規追加）
  residence_type: string;
  residence_years: string;
  marital_status: string;
  family_composition: string;
  dependents_count: string;

  // 勤務先情報
  employer_name: string;
  employer_postal_code: string;
  employer_address: string;
  employer_phone: string;
  employment_type: string;
  years_employed: string;
  annual_income: string;

  // 書類
  identification_docs: File[];
  income_doc: File | null;

  // ローン情報
  vehicle_price: string;
  down_payment: string;
  payment_months: string;
  bonus_months: string;
  bonus_amount: string;

  // 連帯保証人情報
  guarantor_name: string;
  guarantor_name_kana: string;
  guarantor_relationship: string;
  guarantor_phone: string;
  guarantor_postal_code: string;
  guarantor_address: string;

  // 備考
  notes: string;
}

export interface LoanApplicationError {
  general?: string;
  customer_name?: string;
  customer_name_kana?: string;
  customer_birth_date?: string;
  customer_postal_code?: string;
  customer_address?: string;
  customer_phone?: string;
  customer_mobile_phone?: string;

  // 居住情報のエラー（新規追加）
  residence_type?: string;
  residence_years?: string;
  marital_status?: string;
  family_composition?: string;
  dependents_count?: string;

  employer_name?: string;
  employer_postal_code?: string;
  employer_address?: string;
  employer_phone?: string;
  employment_type?: string;
  years_employed?: string;
  annual_income?: string;
  identification_docs?: string[];
  income_doc?: string;
  vehicle_price?: string;
  down_payment?: string;
  payment_months?: string;
  bonus_months?: string;
  bonus_amount?: string;
  guarantor_name?: string;
  guarantor_name_kana?: string;
  guarantor_relationship?: string;
  guarantor_phone?: string;
  guarantor_postal_code?: string;
  guarantor_address?: string;
  notes?: string;
}

export interface LoanApplicationComponentProps {
  vehicle?: any;
  formData: LoanApplicationFormData;
  error: LoanApplicationError | null;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onFileChange: (name: string, files: FileList | File) => void;
}

// データベース用の型
export interface LoanApplication {
  id: string;
  user_id: string;
  vehicle_id: string;
  company_name?: string;
  customer_name: string;
  customer_name_kana: string;
  customer_birth_date: string;
  customer_postal_code: string;
  customer_address: string;
  customer_phone?: string;
  customer_mobile_phone: string;

  // 居住情報
  residence_type: string;
  residence_years: number;
  marital_status: string;
  family_composition?: string;
  dependents_count: number;

  employer_name: string;
  employer_postal_code: string;
  employer_address: string;
  employer_phone: string;
  employment_type: string;
  years_employed: number;
  annual_income: number;
  identification_doc_url?: string;
  income_doc_url?: string;
  vehicle_price: number;
  down_payment: number;
  payment_months: number;
  bonus_months?: string;
  bonus_amount?: number;
  guarantor_name?: string;
  guarantor_name_kana?: string;
  guarantor_relationship?: string;
  guarantor_phone?: string;
  guarantor_postal_code?: string;
  guarantor_address?: string;
  notes?: string;
  status: number; // 0: pending, 1: reviewing, 2: approved, 3: rejected
  created_at: string;
  updated_at: string;
  contact_email?: string;
}