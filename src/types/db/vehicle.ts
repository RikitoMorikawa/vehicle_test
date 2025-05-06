// src/types/db/vehicle.ts
export interface Vehicle {
  id: string;
  name: string;
  maker: string;
  year: number;
  mileage: number;
  price: number;
  image_path: string;
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
}

export interface VehicleSearchParams {
  maker?: string;
  year?: string;
  type?: string;
  color?: string;
  mileage?: string;
}
