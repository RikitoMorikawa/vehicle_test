// src/types/admin/loan-review/page.ts
export interface LoanApplication {
  id: string;
  user_id: string;
  vehicle_id: string;
  vehicle_name?: string;
  vehicle_maker?: string;

  // 基本情報
  customer_name: string;
  customer_name_kana: string;
  customer_birth_date: string;
  customer_postal_code: string;
  customer_address: string;
  customer_phone?: string;
  customer_mobile_phone: string;

  // 居住情報（新規追加）
  residence_type: string;
  residence_years: number;
  marital_status: string;
  family_composition?: string;
  dependents_count: number;

  // 勤務先情報
  employer_name: string;
  employer_postal_code: string;
  employer_address: string;
  employer_phone: string;
  employment_type: string;
  years_employed: number;
  annual_income: number;

  // 書類
  identification_doc_url?: string;
  income_doc_url?: string;

  // ローン情報
  vehicle_price: number;
  down_payment: number;
  payment_months: number;
  bonus_months?: string;
  bonus_amount?: number;

  // 連帯保証人情報
  guarantor_name?: string;
  guarantor_name_kana?: string;
  guarantor_relationship?: string;
  guarantor_phone?: string;
  guarantor_postal_code?: string;
  guarantor_address?: string;

  // その他
  notes?: string;
  status: number;
  created_at: string;
  updated_at: string;
  contact_email?: string;
}

// ページネーション対応のクエリ結果
export interface LoanApplicationsQueryResult {
  applications: LoanApplication[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  isLoading: boolean;
  error: Error | null;
}

export interface LoanApplicationDetailQueryResult {
  application: LoanApplication | null;
  isLoading: boolean;
  error: Error | null;
}

export const LOAN_STATUS = {
  0: "審査待ち",
  1: "審査中",
  2: "承認済み",
  3: "否認",
} as const;

// 居住形態の選択肢
export const RESIDENCE_TYPES = {
  "持ち家": "持ち家",
  "賃貸マンション": "賃貸マンション",
  "賃貸アパート": "賃貸アパート",
  "社宅": "社宅",
  "その他": "その他",
} as const;

// 配偶者の有無の選択肢
export const MARITAL_STATUS = {
  "未婚": "未婚",
  "既婚": "既婚",
  // "離婚": "離婚",
  "その他": "その他",
} as const;