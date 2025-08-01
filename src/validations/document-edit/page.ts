// src/validations/document-edit/page.ts
import { z } from "zod";

// 下取り車両情報のバリデーションスキーマ
export const tradeInSchema = z.object({
  trade_in_available: z.boolean(),
  vehicle_name: z.string().default(""),
  registration_number: z.string().default(""),
  mileage: z.number().nonnegative("走行距離は0以上で入力してください").default(0),
  first_registration_date: z.string().default(""),
  inspection_expiry_date: z.string().default(""),
  chassis_number: z.string().default(""),
  exterior_color: z.string().default(""),
});

// ローン計算のバリデーションスキーマ
export const loanCalculationSchema = z.object({
  down_payment: z.number().nonnegative("頭金は0以上で入力してください"),
  principal: z.number().nonnegative("元金は0以上で入力してください"),
  annual_rate: z.number().nonnegative("年利は0以上で入力してください").max(50, "年利は50%以下で入力してください"),
  payment_count: z.number().positive("支払回数は1以上で入力してください"),
  payment_period: z.number().nonnegative("支払期間は0以上で入力してください"),
  interest_fee: z.number().nonnegative("利息は0以上で入力してください"),
  total_payment: z.number().nonnegative("総支払額は0以上で入力してください"),
  first_payment: z.number().nonnegative("初回支払額は0以上で入力してください"),
  monthly_payment: z.number().nonnegative("月々支払額は0以上で入力してください"),
  bonus_amount: z.number().nonnegative("ボーナス額は0以上で入力してください"),
  bonus_months: z.array(z.number()).optional().default([]),
});

// 付属品のバリデーションスキーマ
export const accessorySchema = z.object({
  name: z.string().min(1, "品名は必須です"),
  price: z.number().nonnegative("価格は0以上で入力してください"),
});

// 税金・保険料のバリデーションスキーマ
export const taxInsuranceFeesSchema = z.object({
  automobile_tax: z.number().nonnegative("自動車税は0以上で入力してください"),
  environmental_performance_tax: z.number().nonnegative("環境性能割は0以上で入力してください"),
  weight_tax: z.number().nonnegative("重量税は0以上で入力してください"),
  liability_insurance_fee: z.number().nonnegative("自賠責保険料は0以上で入力してください"),
});

// 法定費用のバリデーションスキーマ
export const legalFeesSchema = z.object({
  inspection_registration_stamp: z.number().nonnegative("検査登録印紙代は0以上で入力してください"),
  parking_certificate_stamp: z.number().nonnegative("車庫証明印紙代は0以上で入力してください"),
  trade_in_stamp: z.number().nonnegative("下取車印紙代は0以上で入力してください"),
  recycling_deposit: z.number().nonnegative("リサイクル預託金は0以上で入力してください"),
  other_nontaxable: z.number().nonnegative("その他非課税は0以上で入力してください"),
});

// 手続代行費用のバリデーションスキーマ
export const processingFeesSchema = z.object({
  inspection_registration_fee: z.number().nonnegative("検査登録費用は0以上で入力してください"),
  parking_certificate_fee: z.number().nonnegative("車庫証明費用は0以上で入力してください"),
  recycling_management_fee: z.number().nonnegative("リサイクル管理費用は0以上で入力してください"),
  delivery_fee: z.number().nonnegative("納車費用は0以上で入力してください"),
  other_fees: z.number().nonnegative("その他費用は0以上で入力してください"),
});

// 販売価格のバリデーションスキーマ
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

// 配送情報のバリデーションスキーマ
export const shippingInfoSchema = z.object({
  area_code: z.number().min(1, "配送エリアを選択してください").nullable().default(null),
  prefecture: z.string().default(""),
  city: z.string().default(""),
  shipping_cost: z.number().min(0, "送料は0以上である必要があります").default(0),
});

// 見積もり編集フォームデータの型定義
export interface EstimateFormData {
  document_type: "estimate" | "invoice" | "order";
  tradeIn: z.infer<typeof tradeInSchema>;
  loanCalculation: z.infer<typeof loanCalculationSchema>;
  accessories: z.infer<typeof accessorySchema>[];
  taxInsuranceFees: z.infer<typeof taxInsuranceFeesSchema>;
  legalFees: z.infer<typeof legalFeesSchema>;
  processingFees: z.infer<typeof processingFeesSchema>;
  salesPrice: z.infer<typeof salesPriceSchema>;
  shippingInfo: z.infer<typeof shippingInfoSchema>;
}

// 配送情報の型定義
export interface ShippingInfo {
  area_code: number | null;
  prefecture: string;
  city: string;
  shipping_cost: number;
}

// エラー型定義
export interface EstimateError {
  document_type?: string;
  tradeIn?: { [key: string]: string } | string;
  loanCalculation?: { [key: string]: string } | string;
  accessories?: { [key: string]: string } | string;
  taxInsuranceFees?: { [key: string]: string } | string;
  legalFees?: { [key: string]: string } | string;
  processingFees?: { [key: string]: string } | string;
  salesPrice?: { [key: string]: string } | string;
  shippingInfo?: { [key: string]: string } | string;
  general?: string;
}

// メインのバリデーションスキーマ
const documentEditSchema = z.object({
  document_type: z.enum(["estimate", "invoice", "order"]).default("estimate"),
  tradeIn: tradeInSchema,
  loanCalculation: loanCalculationSchema,
  accessories: z.array(accessorySchema),
  taxInsuranceFees: taxInsuranceFeesSchema,
  legalFees: legalFeesSchema,
  processingFees: processingFeesSchema,
  salesPrice: salesPriceSchema,
  shippingInfo: shippingInfoSchema,
});

export type DocumentType = "estimate" | "invoice" | "order";

// バリデーション関数
export const validateEstimate = (data: unknown): z.SafeParseReturnType<EstimateFormData, EstimateFormData> => {
  return documentEditSchema.safeParse(data);
};

// バリデーションエラーを構造化する関数
export const getValidationErrors = (validation: z.SafeParseReturnType<EstimateFormData, EstimateFormData>): EstimateError => {
  if (validation.success) {
    return {};
  }

  const errors: EstimateError = {};

  validation.error.errors.forEach((err) => {
    const path = err.path;

    if (path.length === 0) {
      errors.general = err.message;
      return;
    }

    const section = path[0] as keyof EstimateFormData;

    if (path.length === 1) {
      // セクション全体のエラー
      (errors as any)[section] = err.message;
    } else if (path.length >= 2) {
      // セクション内の特定フィールドのエラー
      const fieldName = path[1] as string;

      // accessoriesの配列要素のエラー処理
      if (section === "accessories" && typeof fieldName === "number") {
        if (!(errors as any)[section] || typeof (errors as any)[section] === "string") {
          (errors as any)[section] = {} as Record<string, string>;
        }

        const accessoryField = path[2] as string;
        ((errors as any)[section] as Record<string, string>)[`${fieldName}.${accessoryField}`] = err.message;
        return;
      }

      if (!(errors as any)[section] || typeof (errors as any)[section] === "string") {
        (errors as any)[section] = {} as Record<string, string>;
      }

      ((errors as any)[section] as Record<string, string>)[fieldName] = err.message;
    }
  });

  return errors;
};

// 従来の関数名も保持（互換性のため）
export const validateDocumentEdit = validateEstimate;