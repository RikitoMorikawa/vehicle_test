// src / services / estimate / page.ts;
import { useQuery, useMutation } from "@tanstack/react-query";
import { estimateHandler } from "../../server/estimate/handler_000";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { VehicleQueryResult } from "../../types/estimate/page";
import type { EstimateFormData } from "../../types/estimate/page";

function useVehicle(id: string): VehicleQueryResult {
  const { data, isLoading, error } = useQuery({
    queryKey: [...QUERY_KEYS.VEHICLE_DETAIL, id],
    queryFn: () => estimateHandler.fetchVehicle(id),
    enabled: !!id,
  });

  return {
    vehicle: data || null,
    isLoading,
    error: error as Error | null,
  };
}

function useCreateEstimate() {
  return useMutation({
    mutationFn: (data: { vehicleId: string } & EstimateFormData) => estimateHandler.createEstimate(data),
  });
}

export const estimateService = {
  useVehicle,
  useCreateEstimate,
};