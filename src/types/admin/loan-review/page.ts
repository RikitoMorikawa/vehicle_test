// src/types/admin/loan-review/page.ts
export interface LoanApplication {
  id: string;
  user_id: string;
  vehicle_id: string;
  vehicle_name?: string;
  customer_name: string;
  customer_name_kana: string;
  customer_birth_date: string;
  customer_postal_code: string;
  customer_address: string;
  customer_phone?: string;
  customer_mobile_phone: string;
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
  status: number;
  created_at: string;
  updated_at: string;
}

export interface LoanApplicationsQueryResult {
  applications: LoanApplication[];
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
