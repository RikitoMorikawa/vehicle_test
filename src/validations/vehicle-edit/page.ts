// src/validations/vehicle-edit/page.tsimport { z } from "zod";
import { z } from "zod";
import { validateForm, ValidationResult } from "../index";

export const vehicleEditSchema = z.object({
  vehicle_id: z.string().min(1, "車両IDを入力してください"),
  maker: z.string().min(1, "メーカーを選択してください"),
  name: z.string().min(1, "車名を入力してください"),
  model_code: z.string().min(1, "型式を入力してください"),
  year: z.string().min(1, "年式を入力してください"),
  mileage: z.string().min(1, "走行距離を入力してください"),
  price: z.string().min(1, "価格を入力してください"),
  color: z.string().min(1, "ボディカラーを入力してください"),
  engine_size: z.string().min(1, "排気量を入力してください"),
  transmission: z.string().min(1, "シフトを選択してください"),
  drive_system: z.string().min(1, "駆動方式を選択してください"),
  inspection_date: z.string().min(1, "車検満了日を入力してください"),
});

export type VehicleEditFormData = z.infer<typeof vehicleEditSchema>;

export const validateVehicleEditForm = (data: unknown): ValidationResult => validateForm(vehicleEditSchema, data);