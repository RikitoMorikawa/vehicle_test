// src/types/vehicle-register/page.tsimport { Vehicle } from '../vehicle';

export interface VehicleFormData {
  name: string;
  maker: string;
  year: string;
  mileage: string;
  price: string;
  model_code: string;
  color: string;
  engine_size: string;
  transmission: string;
  drive_system: string;
  inspection_date: string;
  vehicle_id: string;
}

export interface VehicleRegisterError {
  name?: string;
  maker?: string;
  year?: string;
  mileage?: string;
  price?: string;
  model_code?: string;
  color?: string;
  engine_size?: string;
  transmission?: string;
  drive_system?: string;
  inspection_date?: string;
  vehicle_id?: string;
  general?: string;
}

export interface RegisterVehicleComponentProps {
  formData: VehicleFormData;
  isLoading: boolean;
  error: VehicleRegisterError | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}