// src/services/estimate/page.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { estimateHandler, Vehicle } from "../../server/estimate/handler_000";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { EstimateFormData } from "../../validations/estimate/page";

// 車両情報を取得するフック
function useVehicle(id: string) {
  const {
    data: vehicle,
    isLoading,
    error,
    refetch,
  } = useQuery<Vehicle, Error>({
    queryKey: [...QUERY_KEYS.VEHICLE_DETAIL, id],
    queryFn: () => estimateHandler.fetchVehicle(id),
    enabled: !!id,
    retry: 1,
    staleTime: 0, // ★常に最新データを取得
    refetchOnWindowFocus: true, // ★フォーカス時に再取得
  });

  return {
    vehicle,
    isLoading,
    error,
    refetch,
  };
}

// 見積もりを作成するフック（user_id対応版）
function useCreateEstimate() {
  return useMutation({
    mutationFn: (data: { vehicleId: string; userId: string } & EstimateFormData) => estimateHandler.createEstimate(data),
  });
}

export const estimateService = {
  useVehicle,
  useCreateEstimate,
};
