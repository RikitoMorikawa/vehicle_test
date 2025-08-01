// src/server/vehicle-detail/handler_000.ts
import { supabase } from "../../lib/supabase";

// 車両詳細データを取得 - 複数画像URL付加
export const getVehicleDetail = async (id: string) => {
  try {
    // 基本情報の取得
    const { data: vehicleData, error: vehicleError } = await supabase.from("vehicles").select("*").eq("id", id).single();

    if (vehicleError) {
      throw vehicleError;
    }

    // 複数画像URLを追加
    if (vehicleData) {
      return {
        ...vehicleData,
        // 複数画像の場合は最初の画像をメイン画像として使用
        imageUrl:
          vehicleData.images && vehicleData.images.length > 0
            ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/vehicle-images/${vehicleData.images[0]}`
            : null,
        // 全画像のURLを配列で提供
        imageUrls:
          vehicleData.images?.map((imagePath: string) => `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/vehicle-images/${imagePath}`) || [],
      };
    }

    return vehicleData;
  } catch (error) {
    console.error("車両詳細の取得中にエラーが発生しました:", error);
    throw error;
  }
};

// 閲覧履歴機能は一時的に無効化
export const recordVehicleView = async (userId: string, vehicleId: string) => {
  console.log("閲覧履歴記録スキップ:", userId, vehicleId);
  return null;
};
