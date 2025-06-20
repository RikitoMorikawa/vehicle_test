// src/types/vehicle-detail/page.ts
import { VehicleOrderStatus } from "../../server/orders/handler_000";
import { Vehicle } from "../db/vehicle";

export interface VehicleDetailComponentProps {
  vehicle?: Vehicle | null;
  loading: boolean;
  error: string | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  onInquiry?: () => void;
  orderStatus?: VehicleOrderStatus;
  orderStatusLoading?: boolean;
  isCreatingOrder?: boolean;
  isCancellingOrder?: boolean;
}