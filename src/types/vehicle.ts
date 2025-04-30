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
}

export interface VehicleSearchParams {
  maker?: string;
  year?: string;
  type?: string;
  color?: string;
  mileage?: string;
}