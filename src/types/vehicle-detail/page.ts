// src/types/vehicle-detail/page.ts
import { Vehicle } from "../db/vehicle";

export interface VehicleDetailComponentProps {
  vehicle?: Vehicle | null;
  loading: boolean;
  error: string | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  onInquiry?: () => void;
}