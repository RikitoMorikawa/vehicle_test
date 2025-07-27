// src/validations/vehicle-register/page.ts
import { z } from "zod";
import { validateForm, ValidationResult } from "../index";

export const vehicleRegisterSchema = z.object({
  vehicle_id: z.string().min(1, "車両IDを入力してください"),
  maker: z.string().min(1, "メーカーを選択してください"),
  name: z.string().min(1, "車名を入力してください").max(100, "車名は最大50文字以内で入力してください"),
  model_code: z.string().min(1, "型式を入力してください").max(50, "型式は最大50文字以内で入力してください"),
  year: z.string().min(1, "年式を選択してください"),
  // 走行距離を0以上の整数に制限
  mileage: z
    .string()
    .min(1, "走行距離を入力してください")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val)), "0以上の整数を入力してください"),
  // 価格を0以上の整数に制限
  price: z
    .string()
    .min(1, "価格を入力してください")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val)), "0以上の整数を入力してください"),
  color: z.string().min(1, "ボディカラーを入力してください").max(50, "ボディカラーは最大50文字以内で入力してください"),
  // 排気量を0以上の整数に制限
  engine_size: z
    .string()
    .min(1, "排気量を入力してください")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val)), "0以上の整数を入力してください"),
  transmission: z.string().min(1, "シフトを選択してください"),
  drive_system: z.string().min(1, "駆動方式を選択してください"),
  grade: z.string().max(100, "グレードは最大100文字以内で入力してください"),
  full_model_code: z.string().max(50, "フル型式は最大50文字以内で入力してください"),
  door_count: z.string().min(1, "ドア数は1以上で入力してください").max(10, "ドア数は10以下で入力してください"),
  desired_number: z.string().max(10, "希望ナンバーは最大10文字以内で入力してください"),
  // 登録番号の例: 1234-5678
  // 登録番号を任意フィールドに変更 - 入力がある場合のみ形式チェック
  registration_number: z
    .string()
    .refine(
      (val) => val === "" || /^[あ-んア-ン一-龥0-9-]{1,10}$/.test(val),
      "登録番号は正しいナンバープレート形式で入力してください"
    )
    .optional(),
  chassis_number: z
    .string()
    .max(30, "車台番号は最大30文字以内で入力してください")
    .regex(/^[a-zA-Z0-9]*$/, "車台番号は英数字のみで入力してください"),
  // 新規登録時特有のフィールド - 画像は必須
  imageFiles: z
    .array(z.any().refine((val) => val instanceof File, "ファイル形式が正しくありません"))
    .min(1, "車両画像は最低1枚選択してください")
    .max(5, "車両画像は最大5枚まで選択できます")
});

export type VehicleRegisterFormData = z.infer<typeof vehicleRegisterSchema>;

export const validateVehicleRegisterForm = (data: unknown): ValidationResult => validateForm(vehicleRegisterSchema, data);
