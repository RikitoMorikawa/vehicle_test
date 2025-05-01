// src/validations/index.ts
import { z, ZodSchema } from "zod";

/**
 * 汎用バリデーション関数
 * どのようなZodスキーマでも使用できる
 */
export const validateForm = <T>(schema: ZodSchema<T>, data: unknown) => {
  try {
    schema.parse(data);
    return { success: true, errors: {} as Record<string, never> };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path[0] as string;
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return {
      success: false,
      errors: { general: "バリデーションエラーが発生しました" } as Record<string, string>,
    };
  }
};

/**
 * バリデーション結果の型
 */
export type ValidationResult = {
  success: boolean;
  errors: Record<string, string>;
};

/**
 * フォームデータに対する型を取得
 */
export type FormData<T extends ZodSchema> = z.infer<T>;
