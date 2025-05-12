// src / validations / loan - application / page.ts;
import { z } from "zod";
import { validateForm, ValidationResult } from "../index";

// ローン申請用バリデーションスキーマ
export const loanApplicationSchema = z.object({
  // 顧客情報
  customer_name: z.string().min(1, "お名前を入力してください"),
  customer_name_kana: z.string().min(1, "フリガナを入力してください"),
  customer_birth_date: z.string().min(1, "生年月日を入力してください"),
  customer_postal_code: z.string().min(1, "郵便番号を入力してください"),
  customer_address: z.string().min(1, "住所を入力してください"),
  customer_phone: z.string().optional(),
  customer_mobile_phone: z.string().min(1, "携帯電話番号を入力してください"),
  
  // 勤務先情報
  employer_name: z.string().min(1, "勤務先名称を入力してください"),
  employer_postal_code: z.string().min(1, "勤務先郵便番号を入力してください"),
  employer_address: z.string().min(1, "勤務先住所を入力してください"),
  employer_phone: z.string().min(1, "勤務先電話番号を入力してください"),
  employment_type: z.string().min(1, "雇用形態を選択してください"),
  years_employed: z.string().min(1, "勤続年数を入力してください"),
  annual_income: z.string().min(1, "年収を入力してください"),
  
  // 書類
  identification_doc: z.any().refine(val => val !== null, "本人確認書類を添付してください"),
  income_doc: z.any().refine(val => val !== null, "収入証明書類を添付してください"),
  
  // ローン情報
  vehicle_price: z.string().min(1, "車両価格を入力してください"),
  down_payment: z.string().min(1, "頭金を入力してください"),
  payment_months: z.string().min(1, "支払回数を入力してください"),
  bonus_months: z.string().optional(),
  bonus_amount: z.string().optional(),
  
  // 連帯保証人情報（任意）
  guarantor_name: z.string().optional(),
  guarantor_name_kana: z.string().optional(),
  guarantor_relationship: z.string().optional(),
  guarantor_phone: z.string().optional(),
  guarantor_postal_code: z.string().optional(),
  guarantor_address: z.string().optional(),
  
  // その他
  notes: z.string().optional()
})

export type LoanApplicationFormData = z.infer<typeof loanApplicationSchema>;

export const validateLoanApplication = (data: unknown): ValidationResult => validateForm(loanApplicationSchema, data);
