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
  price: z.number().nonnegative("価格は0以上で入力してください").int("価格は整数で入力してください"),
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

// 販売価格のバリデーションスキーマを追加
export const salesPriceSchema = z.object({
  base_price: z.number().nonnegative("本体価格は0以上で入力してください"),
  discount: z.number().nonnegative("値引き額は0以上で入力してください"),
  inspection_fee: z.number().nonnegative("検査費用は0以上で入力してください"),
  accessories_fee: z.number().nonnegative("付属品費用は0以上で入力してください"),
  vehicle_price: z.number().nonnegative("車両価格は0以上で入力してください"),
  tax_insurance: z.number().nonnegative("税金・保険料は0以上で入力してください"),
  legal_fee: z.number().nonnegative("法定費用は0以上で入力してください"),
  processing_fee: z.number().nonnegative("手続代行費用は0以上で入力してください"),
  misc_fee: z.number().nonnegative("その他費用は0以上で入力してください"),
  consumption_tax: z.number().nonnegative("消費税は0以上で入力してください"),
  total_price: z.number().nonnegative("総額は0以上で入力してください"),
  trade_in_price: z.number().nonnegative("下取り価格は0以上で入力してください"),
  trade_in_debt: z.number().nonnegative("下取り債務は0以上で入力してください"),
  payment_total: z.number().nonnegative("支払総額は0以上で入力してください"),
});

// ★新しく追加: 配送エリア情報のバリデーションスキーマ
export const shippingInfoSchema = z.object({
  area_code: z.number().min(1, "配送エリアを選択してください").nullable(),
  prefecture: z.string().min(1, "都道府県を選択してください"),
  city: z.string().min(1, "市区町村を選択してください"),
  shipping_cost: z.number().min(0, "送料は0以上である必要があります"),
});

// 型の導出
export type TradeInFormData = z.infer<typeof tradeInSchema>;

// フォームデータ型定義
export interface EstimateFormData {
  document_type?: string;
  salesPrice: z.infer<typeof salesPriceSchema>;
  tradeIn: z.infer<typeof tradeInSchema>;
  loanCalculation: z.infer<typeof loanCalculationSchema>;
  accessories: z.infer<typeof accessorySchema>[];
  taxInsuranceFees: z.infer<typeof taxInsuranceFeesSchema>;
  legalFees: z.infer<typeof legalFeesSchema>;
  processingFees: z.infer<typeof processingFeesSchema>;
  shippingInfo: z.infer<typeof shippingInfoSchema>;
}

// ★配送エリア関連の型定義を追加
export interface ShippingInfo {
  area_code: number | null;
  prefecture: string;
  city: string;
  shipping_cost: number;
}


// エラー型定義も更新
export interface EstimateError {
  document_type?: string;
  salesPrice?: { [key: string]: string } | string;
  tradeIn?: { [key: string]: string } | string;
  loanCalculation?: { [key: string]: string } | string;
  accessories?: { [key: string]: string } | string;
  taxInsuranceFees?: { [key: string]: string } | string;
  general?: string;
  legalFees?: { [key: string]: string } | string;
  processingFees?: { [key: string]: string } | string;
  shippingInfo?: { [key: string]: string } | string;
}

// ★配送エリアエラー型を追加
export interface ShippingInfoError {
  area_code?: string;
  prefecture?: string;
  city?: string;
  shipping_cost?: string;
}


// サービスパラメータ型定義
export interface CreateEstimateParams {
  vehicleId: string;
  formData: EstimateFormData;
}

// ValidationResult型
export type ValidationResult<T> = z.SafeParseReturnType<T, T>;
