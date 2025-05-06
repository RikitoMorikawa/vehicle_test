// src/services/vehicle-edit/page.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { vehicleEditHandler } from "../../server/vehicle-edit/handler_000";
import { QUERY_KEYS } from "../../constants/queryKeys";
import type { VehicleFormData } from "../../types/vehicle-register/page";

function useVehicle(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.VEHICLE_DETAIL, id],
    queryFn: () => vehicleEditHandler.fetchVehicle(id),
    enabled: !!id,
  });
}

function useUpdateVehicle() {
  return useMutation({
    mutationFn: (data: { id: string; formData: VehicleFormData }) =>
      vehicleEditHandler.updateVehicle(data.id, data.formData),
  });
}

function useDeleteVehicle() {
  return useMutation({
    mutationFn: (id: string) => vehicleEditHandler.deleteVehicle(id),
  });
}


export const vehicleEditService = {
  useVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
};