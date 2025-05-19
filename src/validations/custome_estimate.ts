// src/validations/custome_estimate.ts
import { z } from "zod";
import { EstimateError, EstimateFormData, loanCalculationSchema, tradeInSchema } from "./estimate/page";

// バリデーション関数
export const validateEstimate = (data: unknown): z.SafeParseReturnType<EstimateFormData, EstimateFormData> => {
  const estimateSchema = z.object({
    tradeIn: tradeInSchema,
    loanCalculation: loanCalculationSchema,
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
