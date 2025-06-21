// src/types/vehicle-register/page.ts の修正部分のみ
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

  // 複数画像対応（変更部分）
  images: string[];
  imageFiles?: File[];

  view360_images?: string[];

  // 新しく追加したフィールド（既存のまま）
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
  view360_images?: string;
  images?: string; // 複数画像対応

  // 新しく追加したフィールドのエラー（既存のまま）
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
