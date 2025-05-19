// src/validations/estimate/page.ts
import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0); // 時間部分をリセット

// 下取り車両のバリデーションスキーマ
export const tradeInSchema = z.object({
  vehicle_name: z.string().max(100, "車両名は100文字以内で入力してください"),
  // 登録番号の例: 1234-5678 (空文字も許容)
  registration_number: z.string().regex(/^[あ-んア-ン一-龥0-9-]{0,10}$/, "登録番号は正しいナンバープレート形式で入力してください"),
  mileage: z.number().nonnegative("走行距離は0以上で入力してください").int("走行距離は整数で入力してください"),
  // 初度登録年月: 空または過去の日付を許可
  first_registration_date: z
    .string()
    .refine((val) => val === "" || new Date(val) <= today, "初度登録年月は現在より過去の日付を入力してください")
    .optional()
    .or(z.literal("")),
  inspection_expiry_date: z.string(),
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

// 型の導出
export type TradeInFormData = z.infer<typeof tradeInSchema>;
// フォームデータ型定義
export interface EstimateFormData {
  tradeIn: z.infer<typeof tradeInSchema>;
  loanCalculation: z.infer<typeof loanCalculationSchema>;
}

// エラー型定義も更新
export interface EstimateError {
  tradeIn?: { [key: string]: string } | string;
  loanCalculation?: { [key: string]: string } | string;
  general?: string;
}

// サービスパラメータ型定義
export interface CreateEstimateParams {
  vehicleId: string;
  formData: EstimateFormData;
}

// ValidationResult型
export type ValidationResult<T> = z.SafeParseReturnType<T, T>;
