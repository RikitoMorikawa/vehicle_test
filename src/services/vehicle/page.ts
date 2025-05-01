import { useQuery } from "@tanstack/react-query";
import { vehicleHandler } from "../../server/vehicles/handler";
import { QUERY_KEYS } from "../../constants/queryKeys";
import type { Vehicle } from "../../types/vehicle";

interface SearchParams {
  keyword: string;
  maker: string;
  year: string;
  mileage: string;
  sort: string;
}

interface VehicleQueryResult {
  vehicles: Vehicle[];
  totalPages: number;
  isLoading: boolean;
  error: Error | null;
}

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
