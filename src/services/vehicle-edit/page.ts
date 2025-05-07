// src/services/vehicle-edit/page.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleEditHandler } from "../../server/vehicle-edit/handler_000";
import { QUERY_KEYS } from "../../constants/queryKeys";
import type { VehicleFormData } from "../../types/vehicle-register/page";

function useVehicle(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.VEHICLE_EDIT, id],
    queryFn: () => vehicleEditHandler.fetchVehicle(id),
    enabled: !!id,
  });
}

function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; formData: VehicleFormData }) => vehicleEditHandler.updateVehicle(data.id, data.formData),
    onSuccess: () => {
      // 車両一覧のキャッシュを無効化して再フェッチを強制
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLE_DETAIL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLE_EDIT });
    },
  });
}

function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehicleEditHandler.deleteVehicle(id),
    onSuccess: () => {
      // 車両一覧のキャッシュを無効化して再フェッチを強制
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLES });
    },
  });
}

export const vehicleEditService = {
  useVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
};
