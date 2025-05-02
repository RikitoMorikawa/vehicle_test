import { useQuery } from "@tanstack/react-query";
import { vehicleHandler } from "../../server/vehicle-list/handler_000";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { SearchParams, VehicleQueryResult } from "../../types/vehicle-list/page";

function useVehicles(currentPage: number, searchParams: SearchParams): VehicleQueryResult {
  const { data, isLoading, error } = useQuery({
    queryKey: [...QUERY_KEYS.VEHICLES, currentPage, searchParams],
    queryFn: () => vehicleHandler.fetchVehicles(currentPage, searchParams),
  });

  return {
    vehicles: data?.vehicles || [],
    totalPages: data?.totalPages || 1,
    isLoading,
    error: error as Error | null,
  };
}

export const vehicleService = {
  useVehicles,
};
