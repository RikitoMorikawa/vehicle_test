// src/validations/account-settings/page.ts
import { z } from "zod";
import { validateForm, ValidationResult, FormData } from "../index";

// プロフィール更新用バリデーションスキーマ
export const profileSchema = z.object({
  company_name: z.string().min(1, "会社名を入力してください"),
  user_name: z.string().min(1, "担当者名を入力してください"),
  phone: z.string().min(1, "電話番号を入力してください"),
  email: z.string().min(1, "メールアドレスを入力してください").email("有効なメールアドレスを入力してください"),
});

// パスワード更新用バリデーションスキーマ
export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "現在のパスワードを入力してください"),
    newPassword: z.string().min(1, "新しいパスワードを入力してください").min(8, "パスワードは8文字以上で入力してください"),
    confirmPassword: z.string().min(1, "確認用パスワードを入力してください"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "新しいパスワードと確認用パスワードが一致しません",
    path: ["confirmPassword"],
  });

// 型エイリアス
export type ProfileFormData = FormData<typeof profileSchema>;
export type PasswordFormData = FormData<typeof passwordSchema>;

// バリデーション関数
export const validateProfileForm = (data: unknown): ValidationResult => validateForm(profileSchema, data);
export const validatePasswordForm = (data: unknown): ValidationResult => validateForm(passwordSchema, data);
