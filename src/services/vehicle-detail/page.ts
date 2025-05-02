// src/services/vehicle-detail/page.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { Vehicle } from "../../types/db/vehicle";
import { QUERY_KEYS } from "../../constants/queryKeys";

// 車両詳細を取得するフック - 修正版
const useVehicleDetail = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.VEHICLE_DETAIL, id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`車両詳細の取得に失敗しました: ${error.message}`);
      }

      // 画像URLを追加（vehicle-listハンドラーと同じロジック）
      if (data) {
        return {
          ...data,
          imageUrl: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/vehicle-images/${data.image_path}`
        } as Vehicle;
      }

      return null;
    },
    enabled: !!id,
    retry: 1,
  });
};

export const vehicleDetailService = {
  useVehicleDetail,
};