// src/types/vehicle-register/page.ts

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
  image_path?: string;
  image?: File;
  view360_images?: string[]; // 追加
  view360_files?: File[];    // 追加
}

export interface VehicleRegisterError {
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
  view360_images?: string; // 追加
  general?: string;
}

export interface RegisterVehicleComponentProps {
  formData: VehicleFormData;
  isLoading: boolean;
  error: VehicleRegisterError | null;
  imagePreview: string | null;
  view360ImagePreviews: string[]; // 追加
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onView360ImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 追加
  onRemoveView360Image: (index: number) => void; // 追加
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}