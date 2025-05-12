// src / validations / loan - application / page.ts;
import { z } from "zod";
import { validateForm, ValidationResult } from "../index";

// ローン申請用バリデーションスキーマ
export const loanApplicationSchema = z.object({
  // 顧客情報
  customer_name: z.string().min(1, "お名前を入力してください").max(100, "お名前は100文字以内で入力してください"),
  customer_name_kana: z
    .string()
    .min(1, "フリガナを入力してください")
    .max(100, "フリガナは100文字以内で入力してください")
    .regex(/^[ァ-ヶー]*$/, "カタカナで入力してください"),
  customer_birth_date: z
    .string()
    .min(1, "生年月日を入力してください")
    .refine((date) => new Date(date) < new Date(), "生年月日は過去の日付を入力してください"),
  customer_postal_code: z
    .string()
    .min(1, "郵便番号を入力してください")
    .regex(/^\d{3}-\d{4}$/, "郵便番号は半角数字で000-0000の形式で入力してください"),
  customer_address: z.string().min(1, "住所を入力してください").max(100, "住所は100文字以内で入力してください"),
  customer_phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{2,4}-\d{2,4}-\d{4}$/.test(val), "電話番号は半角数字でXXX-XXX-XXXXの形式で入力してください"),
  customer_mobile_phone: z
    .string()
    .min(1, "携帯電話番号を入力してください")
    .regex(/^\d{3}-\d{4}-\d{4}$/, "携帯電話番号は半角数字で000-0000-0000の形式で入力してください"),

  // 勤務先情報
  employer_name: z.string().min(1, "勤務先名称を入力してください").max(100, "勤務先名称は100文字以内で入力してください"),
  employer_postal_code: z
    .string()
    .min(1, "勤務先郵便番号を入力してください")
    .regex(/^\d{3}-\d{4}$/, "勤務先郵便番号は半角数字で000-0000の形式で入力してください"),
  employer_address: z.string().min(1, "勤務先住所を入力してください").max(100, "勤務先住所は100文字以内で入力してください"),
  employer_phone: z
    .string()
    .min(1, "勤務先電話番号を入力してください")
    .regex(/^\d{2,4}-\d{2,4}-\d{4}$/, "勤務先電話番号は半角数字でXXX-XXX-XXXXの形式で入力してください"),
  employment_type: z.string().min(1, "雇用形態を選択してください"),
  years_employed: z
    .string()
    .min(1, "勤続年数を入力してください")
    .regex(/^[0-9]+$/, "0以上の整数で入力してください"),
  annual_income: z
    .string()
    .min(1, "年収を入力してください")
    .regex(/^[0-9]+$/, "0以上の整数で入力してください"),

  // 書類
  identification_doc: z
    .any()
    .refine((val) => val !== null, "本人確認書類を添付してください")
    .refine((val) => !val || val.size <= 10 * 1024 * 1024, "ファイルサイズは10MB以下にしてください")
    .refine((val) => !val || /\.(jpg|jpeg|png|pdf)$/i.test(val.name), "JPG、PNG、PDFファイルのみ対応しています"),
  income_doc: z
    .any()
    .refine((val) => val !== null, "収入証明書類を添付してください")
    .refine((val) => !val || val.size <= 10 * 1024 * 1024, "ファイルサイズは10MB以下にしてください")
    .refine((val) => !val || /\.(jpg|jpeg|png|pdf)$/i.test(val.name), "JPG、PNG、PDFファイルのみ対応しています"),

  // ローン情報
  vehicle_price: z
    .string()
    .min(1, "車両価格を入力してください")
    .regex(/^[0-9]+$/, "0以上の整数で入力してください"),
  down_payment: z
    .string()
    .min(1, "頭金を入力してください")
    .regex(/^[0-9]+$/, "0以上の整数で入力してください"),
  payment_months: z.string().min(1, "支払回数を入力してください"),
  bonus_months: z.string().optional(),
  bonus_amount: z
    .string()
    .regex(/^[0-9]+$/, "0以上の整数で入力してください")
    .optional(),

  // 連帯保証人情報（任意）
  guarantor_name: z.string().max(100, "連帯保証人名は100文字以内で入力してください").optional(),
  guarantor_name_kana: z
    .string()
    .regex(/^[ァ-ヶー]*$/, "カタカナで入力してください")
    .max(100, "フリガナは100文字以内で入力してください")
    .optional(),
  guarantor_relationship: z.string().max(50, "続柄は50文字以内で入力してください").optional(),
  guarantor_phone: z
    .string()
    .regex(/^\d{2,4}-\d{2,4}-\d{4}$/, "連帯保証人の電話番号は半角数字でXXX-XXX-XXXXの形式で入力してください")
    .optional(),
  guarantor_postal_code: z
    .string()
    .regex(/^\d{3}-\d{4}$/, "郵便番号は半角数字で000-0000の形式で入力してください")
    .optional(),
  guarantor_address: z.string().max(100, "住所は100文字以内で入力してください").optional(),

  // その他
  notes: z.string().max(1000, "備考は1000文字以内で入力してください").optional(),
});

export type LoanApplicationFormData = z.infer<typeof loanApplicationSchema>;

export const validateLoanApplication = (data: unknown): ValidationResult => validateForm(loanApplicationSchema, data);
