// src/types/vehicle-register/page.ts
export interface VehicleFormData {
  vehicle_id: string;
  maker: string;
  name: string;
  model_code: string;
  year: string;
  mileage: string;
  price: string;
  color: string;
  engine_size: string;
  transmission: string;
  drive_system: string;
  inspection_date: string;
  image_path?: string;
  image?: File;
  view360_images?: string[];

  // 新しく追加したフィールド
  vehicle_status?: string;
  full_model_code?: string;
  grade?: string;
  registration_number?: string;
  first_registration_date?: string;
  chassis_number?: string;
  body_type?: string;
  door_count?: string; // フォームでは文字列として扱う
  desired_number?: string;
  sales_format?: string;
  accident_history?: string; // フォームでは文字列として扱う
  recycling_deposit?: string; // フォームでは文字列として扱う
  registration_date?: string;
  tax_rate?: string; // フォームでは文字列として扱う
}

export interface VehicleRegisterError {
  general?: string;
  vehicle_id?: string;
  maker?: string;
  name?: string;
  model_code?: string;
  year?: string;
  mileage?: string;
  price?: string;
  color?: string;
  engine_size?: string;
  transmission?: string;
  drive_system?: string;
  inspection_date?: string;
  image?: string;

  // 新しく追加したフィールドのエラー
  vehicle_status?: string;
  full_model_code?: string;
  grade?: string;
  registration_number?: string;
  first_registration_date?: string;
  chassis_number?: string;
  body_type?: string;
  door_count?: string;
  desired_number?: string;
  sales_format?: string;
  accident_history?: string;
  recycling_deposit?: string;
  registration_date?: string;
  tax_rate?: string;
}
