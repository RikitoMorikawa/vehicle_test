// src/validations/admin/edit-user/page.ts
import { z } from "zod";
import { validateForm, ValidationResult } from "../../index";

// ユーザー編集用バリデーションスキーマ
export const editUserSchema = z.object({
  company_name: z.string().min(1, "会社名を入力してください"),
  user_name: z.string().min(1, "担当者名を入力してください"),
  phone: z.string().min(1, "電話番号を入力してください").regex(/^\d{2,4}-\d{2,4}-\d{4}$/, "電話番号は半角数字でXXX-XXX-XXXXの形式で入力してください"),
  email: z.string().min(1, "メールアドレスを入力してください").email("有効なメールアドレスを入力してください"),
  password: z.string().optional(),
  currentPassword: z.string().optional(),
  is_approved: z.boolean(),
});

// パスワード更新用の追加バリデーション
export const passwordUpdateSchema = z.object({
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
});

// バリデーション関数
export const validateEditUserForm = (data: unknown): ValidationResult => validateForm(editUserSchema, data);

// パスワード更新のバリデーション関数
export const validatePasswordUpdate = (data: { currentPassword: string; password: string }): ValidationResult => 
  validateForm(passwordUpdateSchema, data);