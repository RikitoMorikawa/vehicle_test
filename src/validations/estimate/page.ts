import { z } from "zod";
import { validateForm, ValidationResult, FormData } from "../index";

// 下取り車両のバリデーションスキーマ
const tradeInSchema = z.object({
  vehicle_name: z.string().min(1, "車名を入力してください"),
  registration_number: z.string().min(1, "登録番号を入力してください"),
  mileage: z.number().min(0, "走行距離は0以上で入力してください"),
  first_registration_date: z.string().min(1, "初度登録年月を入力してください"),
  inspection_expiry_date: z.string().min(1, "車検満了日を入力してください"),
  chassis_number: z.string().min(1, "車台番号を入力してください"),
  exterior_color: z.string().min(1, "外装色を入力してください"),
});

// 販売価格のバリデーションスキーマ
const salesPriceSchema = z.object({
  base_price: z.number().min(1, "本体価格は1以上で入力してください"),
  discount: z.number().min(0, "値引き額は0以上で入力してください"),
  inspection_fee: z.number().min(0, "検査費用は0以上で入力してください"),
  accessories_fee: z.number().min(0, "付属品費用は0以上で入力してください"),
  vehicle_price: z.number().min(0, "車両価格は0以上で入力してください"),
  tax_insurance: z.number().min(0, "税金・保険料は0以上で入力してください"),
  legal_fee: z.number().min(0, "法定費用は0以上で入力してください"),
  processing_fee: z.number().min(0, "手続代行費用は0以上で入力してください"),
  misc_fee: z.number().min(0, "その他費用は0以上で入力してください"),
  consumption_tax: z.number().min(0, "消費税は0以上で入力してください"),
  total_price: z.number().min(0, "合計金額は0以上で入力してください"),
  trade_in_price: z.number().min(0, "下取り価格は0以上で入力してください"),
  trade_in_debt: z.number().min(0, "下取り車ローン残債は0以上で入力してください"),
  payment_total: z.number().min(0, "お支払い総額は0以上で入力してください"),
});

// ローン計算のバリデーションスキーマ
const loanCalculationSchema = z.object({
  down_payment: z.number().min(0, "頭金は0以上で入力してください"),
  principal: z.number().min(0, "元金は0以上で入力してください"),
  interest_fee: z.number().min(0, "金利手数料は0以上で入力してください"),
  total_payment: z.number().min(0, "支払総額は0以上で入力してください"),
  payment_count: z.number().min(1, "支払回数は1以上で入力してください"),
  payment_period: z.number().min(1, "支払期間は1以上で入力してください"),
  first_payment: z.number().min(0, "初回支払額は0以上で入力してください"),
  monthly_payment: z.number().min(0, "月々支払額は0以上で入力してください"),
  bonus_months: z.array(z.string()),
  bonus_amount: z.number().min(0, "ボーナス加算額は0以上で入力してください"),
});

// 手続代行費用のバリデーションスキーマ
const processingFeesSchema = z.object({
  inspection_registration_fee: z.number().min(0, "検査登録費用は0以上で入力してください"),
  parking_certificate_fee: z.number().min(0, "車庫証明費用は0以上で入力してください"),
  trade_in_processing_fee: z.number().min(0, "下取車手続費用は0以上で入力してください"),
  trade_in_assessment_fee: z.number().min(0, "下取車査定費用は0以上で入力してください"),
  recycling_management_fee: z.number().min(0, "リサイクル管理費用は0以上で入力してください"),
  delivery_fee: z.number().min(0, "納車費用は0以上で入力してください"),
  other_fees: z.number().min(0, "その他費用は0以上で入力してください"),
});

// 預り法定費用のバリデーションスキーマ
const legalFeesSchema = z.object({
  inspection_registration_stamp: z.number().min(0, "検査登録印紙代は0以上で入力してください"),
  parking_certificate_stamp: z.number().min(0, "車庫証明印紙代は0以上で入力してください"),
  trade_in_stamp: z.number().min(0, "下取車印紙代は0以上で入力してください"),
  recycling_deposit: z.number().min(0, "リサイクル預託金は0以上で入力してください"),
  other_nontaxable: z.number().min(0, "その他非課税は0以上で入力してください"),
});

// 税金・保険料のバリデーションスキーマ
const taxInsuranceFeesSchema = z.object({
  automobile_tax: z.number().min(0, "自動車税は0以上で入力してください"),
  environmental_performance_tax: z.number().min(0, "環境性能割は0以上で入力してください"),
  weight_tax: z.number().min(0, "重量税は0以上で入力してください"),
  liability_insurance_fee: z.number().min(0, "自賠責保険料は0以上で入力してください"),
  voluntary_insurance_fee: z.number().min(0, "任意保険料は0以上で入力してください"),
});

// 付属品のバリデーションスキーマ
const accessorySchema = z.object({
  name: z.string().min(1, "品名を入力してください"),
  price: z.number().min(0, "価格は0以上で入力してください"),
});

// 見積全体のバリデーションスキーマ
export const estimateSchema = z.object({
  tradeIn: tradeInSchema,
  salesPrice: salesPriceSchema,
  loanCalculation: loanCalculationSchema,
  processingFees: processingFeesSchema,
  legalFees: legalFeesSchema,
  taxInsuranceFees: taxInsuranceFeesSchema,
  accessories: z.array(accessorySchema),
});

// 型エイリアス - アカウント設定画面と同様
export type EstimateFormData = FormData<typeof estimateSchema>;

// バリデーション関数 - アカウント設定画面と同様
export const validateEstimate = (data: unknown): ValidationResult => validateForm(estimateSchema, data);
