// src/validations/estimate/page.ts
import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0); // 時間部分をリセット

// 下取り車両のバリデーションスキーマ
export const tradeInSchema = z.object({
  trade_in_available: z.boolean(),
  vehicle_name: z.string().max(100, "車両名は100文字以内で入力してください"),
  // 登録番号の例: 1234-5678 (空文字も許容)
  registration_number: z.string().regex(/^[あ-んア-ン一-龥0-9-]{0,10}$/, "登録番号は正しいナンバープレート形式で入力してください"),
  mileage: z.number().nonnegative("走行距離は0以上で入力してください").int("走行距離は整数で入力してください"),
  // 初度登録年月: 過去の日付を許可
  first_registration_date: z
    .string()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .refine((val) => val === null || new Date(val) <= today, "初度登録年月は現在より過去の日付を入力してください"),
  inspection_expiry_date: z
    .string()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .refine((val) => val === null || new Date(val) > today, "車検満了日は現在より未来の日付を入力してください"),
  chassis_number: z
    .string()
    .length(17, "車台番号は英数字17文字で入力してください")
    .regex(/^[a-zA-Z0-9]+$/, "車台番号は英数字のみで入力してください")
    .optional()
    .or(z.literal("")),
  exterior_color: z.string().max(50, "外装色は50文字以内で入力してください"),
});

// ローン計算のバリデーションスキーマ
export const loanCalculationSchema = z.object({
  down_payment: z.number().nonnegative("頭金は0以上で入力してください"),
  principal: z.number().nonnegative("元金は0以上で入力してください"),
  interest_fee: z.number().nonnegative("金利手数料は0以上で入力してください"),
  total_payment: z.number().nonnegative("支払総額は0以上で入力してください"),
  payment_count: z.number().int().positive("支払回数は1以上で入力してください"),
  payment_period: z.number().int().positive("支払期間は1以上で入力してください"),
  first_payment: z.number().nonnegative("初回支払額は0以上で入力してください"),
  monthly_payment: z.number().nonnegative("月々支払額は0以上で入力してください"),
  bonus_amount: z.number().nonnegative("ボーナス加算額は0以上で入力してください"),
  bonus_months: z.array(z.number()).optional(),
});

// (A)付属品・特別仕様内訳のバリデーションスキーマを追加
export const accessorySchema = z.object({
  name: z.string().min(1, "品名を入力してください").max(100, "品名は100文字以内で入力してください"),
  price: z.number().nonnegative("価格は0以上で入力してください").int("価格は整数で入力してください").min(1, "価格は1以上で入力してください"),
});

// (B) 税金・保険料内訳のバリデーションスキーマを追加
export const taxInsuranceFeesSchema = z.object({
  automobile_tax: z.number().nonnegative("自動車税は0以上で入力してください"),
  environmental_performance_tax: z.number().nonnegative("環境性能割は0以上で入力してください"),
  weight_tax: z.number().nonnegative("重量税は0以上で入力してください"),
  liability_insurance_fee: z.number().nonnegative("自賠責保険料は0以上で入力してください"),
  voluntary_insurance_fee: z.number().nonnegative("任意保険料は0以上で入力してください"),
});

// (C)預り法定費用内訳のバリデーションスキーマを追加
export const legalFeesSchema = z.object({
  inspection_registration_stamp: z.number().nonnegative("検査登録印紙代は0以上で入力してください"),
  parking_certificate_stamp: z.number().nonnegative("車庫証明印紙代は0以上で入力してください"),
  trade_in_stamp: z.number().nonnegative("下取車印紙代は0以上で入力してください"),
  recycling_deposit: z.number().nonnegative("リサイクル預託金は0以上で入力してください"),
  other_nontaxable: z.number().nonnegative("その他非課税は0以上で入力してください"),
});

// (D) 手続代行費用内訳のバリデーションスキーマを追加
export const processingFeesSchema = z.object({
  inspection_registration_fee: z.number().nonnegative("検査登録費用は0以上で入力してください"),
  parking_certificate_fee: z.number().nonnegative("車庫証明費用は0以上で入力してください"),
  trade_in_processing_fee: z.number().nonnegative("下取車手続費用は0以上で入力してください"),
  trade_in_assessment_fee: z.number().nonnegative("下取車査定費用は0以上で入力してください"),
  recycling_management_fee: z.number().nonnegative("リサイクル管理費用は0以上で入力してください"),
  delivery_fee: z.number().nonnegative("納車費用は0以上で入力してください"),
  other_fees: z.number().nonnegative("その他費用は0以上で入力してください"),
});

// 型の導出
export type TradeInFormData = z.infer<typeof tradeInSchema>;
// フォームデータ型定義
export interface EstimateFormData {
  tradeIn: z.infer<typeof tradeInSchema>;
  loanCalculation: z.infer<typeof loanCalculationSchema>;
  accessories: z.infer<typeof accessorySchema>[];
  taxInsuranceFees: z.infer<typeof taxInsuranceFeesSchema>;
  legalFees: z.infer<typeof legalFeesSchema>;
  processingFees: z.infer<typeof processingFeesSchema>;
}

// エラー型定義も更新
export interface EstimateError {
  tradeIn?: { [key: string]: string } | string;
  loanCalculation?: { [key: string]: string } | string;
  accessories?: { [key: string]: string } | string;
  taxInsuranceFees?: { [key: string]: string } | string;
  general?: string;
  legalFees?: { [key: string]: string } | string;
  processingFees?: { [key: string]: string } | string;
}

// サービスパラメータ型定義
export interface CreateEstimateParams {
  vehicleId: string;
  formData: EstimateFormData;
}

// ValidationResult型
export type ValidationResult<T> = z.SafeParseReturnType<T, T>;
