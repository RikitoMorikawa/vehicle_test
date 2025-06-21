// src/types/db/vehicle.ts
export interface Vehicle {
  id: string;
  name: string;
  maker: string;
  year: number;
  mileage: number;
  price: number;
  images?: string;
  created_at?: string;
  updated_at?: string;
  imageUrl?: string;
  model_code?: string;
  color?: string;
  engine_size?: number;
  transmission?: string;
  drive_system?: string;
  inspection_date?: string;
  description?: string;
  features?: string[];
  vehicle_id?: string;
  manufacturer_code?: string;
  other_images_path?: string[];
  view360_images?: string[];
  // 新しく追加したカラム
  vehicle_status?: string;
  full_model_code?: string;
  grade?: string;
  registration_number?: string;
  first_registration_date?: string; // 日付はフロントエンドでは文字列として扱う
  chassis_number?: string;
  body_type?: string;
  door_count?: number;
  desired_number?: string;
  sales_format?: string;
  accident_history?: boolean;
  recycling_deposit?: boolean;
  registration_date?: string; // 日付はフロントエンドでは文字列として扱う
  tax_rate?: 8 | 10;
}

export interface VehicleSearchParams {
  maker?: string;
  year?: string;
  type?: string;
  color?: string;
  mileage?: string;
}
