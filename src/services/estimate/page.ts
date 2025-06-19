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
  } = useQuery<Vehicle, Error>({
    queryKey: [...QUERY_KEYS.VEHICLE_DETAIL, id],
    queryFn: () => estimateHandler.fetchVehicle(id),
    enabled: !!id, // idがある場合のみクエリを実行
    retry: 1, // エラー時の再試行回数を制限
  });

  return {
    vehicle,
    isLoading,
    error,
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
