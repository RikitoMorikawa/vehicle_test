// src / validations / auth / page.ts;
import { z } from "zod";
import { validateForm, ValidationResult, FormData } from "../index";

// ログイン用バリデーションスキーマ
export const loginSchema = z.object({
  email: z.string().min(1, "メールアドレスを入力してください").email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

// 登録用バリデーションスキーマ
export const registerSchema = z.object({
  email: z.string().min(1, "メールアドレスを入力してください").email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください").min(6, "パスワードは6文字以上で入力してください"),
  company_name: z.string().min(1, "会社名を選択してください"),
  user_name: z.string().min(1, "担当者名を入力してください"),
  phone: z
    .string()
    .min(1, "電話番号を入力してください")
    .regex(/^\d{2,4}-\d{2,4}-\d{4}$/, "電話番号は半角数字でXXX-XXX-XXXXの形式で入力してください"),
});

// 型エイリアス
export type LoginFormData = FormData<typeof loginSchema>;
export type RegisterFormData = FormData<typeof registerSchema>;

// バリデーション関数
export const validateLoginForm = (data: unknown): ValidationResult => validateForm(loginSchema, data);
export const validateRegisterForm = (data: unknown): ValidationResult => validateForm(registerSchema, data);
