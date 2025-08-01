// src/validations/custome_estimate.ts
import { z } from "zod";
import {
  salesPriceSchema,
  EstimateError,
  EstimateFormData,
  loanCalculationSchema,
  tradeInSchema,
  accessorySchema,
  taxInsuranceFeesSchema,
  legalFeesSchema,
  processingFeesSchema,
  shippingInfoSchema,
} from "./estimate/page";

// バリデーション関数
export const validateEstimate = (data: unknown): z.SafeParseReturnType<EstimateFormData, EstimateFormData> => {
  const estimateSchema = z.object({
    salesPrice: salesPriceSchema, // 車両本体価格のバリデーションを追加
    tradeIn: tradeInSchema, // 下取り車両情報のバリデーションを追加
    loanCalculation: loanCalculationSchema, // ローン計算のバリデーションを追加
    accessories: z.array(accessorySchema), // 付属品配列のバリデーションを追加
    taxInsuranceFees: taxInsuranceFeesSchema, // 税金・保険料のバリデーションを追加
    legalFees: legalFeesSchema, // 法定費用のバリデーションを追加
    processingFees: processingFeesSchema, // 手続き費用のバリデーションを追加
    shippingInfo: shippingInfoSchema, // 配送情報のバリデーションを追加
  });

  return estimateSchema.safeParse(data);
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
        // 配列インデックスがfieldNameに入っている場合
        if (!(errors as any)[section] || typeof (errors as any)[section] === "string") {
          (errors as any)[section] = {} as Record<string, string>;
        }

        // エラーパスの3番目の要素（アクセサリーのフィールド名）を取得
        const accessoryField = path[2] as string;

        // accessories[0].name のような形式でエラーキーを設定
        ((errors as any)[section] as Record<string, string>)[`${fieldName}.${accessoryField}`] = err.message;
        return;
      }

      if (!(errors as any)[section] || typeof (errors as any)[section] === "string") {
        // 型アサーションを使ってエラーを回避
        (errors as any)[section] = {} as Record<string, string>;
      }

      // ここでも型アサーションを使用
      ((errors as any)[section] as Record<string, string>)[fieldName] = err.message;
    }
  });

  return errors;
};
