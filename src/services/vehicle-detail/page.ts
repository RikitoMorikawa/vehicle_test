// src/services/vehicle-detail/page.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { Vehicle } from "../../types/db/vehicle";
import { QUERY_KEYS } from "../../constants/queryKeys";

// 車両詳細を取得するフック
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

      // 複数画像対応の修正
      if (data) {
        return {
          ...data,
          // 複数画像の場合は最初の画像をメイン画像として使用
          imageUrl: data.images && data.images.length > 0
            ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/vehicle-images/${data.images[0]}`
            : null,
          // 全画像のURLを配列で提供
          imageUrls: data.images?.map((imagePath: string) => 
            `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/vehicle-images/${imagePath}`
          ) || []
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