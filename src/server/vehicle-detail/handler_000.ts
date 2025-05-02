// src/server/vehicle-detail/handler_000.ts
import { supabase } from "../../lib/supabase";

// 車両詳細データを取得 - 画像URL付加
export const getVehicleDetail = async (id: string) => {
  try {
    // 基本情報の取得
    const { data: vehicleData, error: vehicleError } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .single();

    if (vehicleError) {
      throw vehicleError;
    }

    // 画像URLを追加
    if (vehicleData) {
      return {
        ...vehicleData,
        imageUrl: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/vehicle-images/${vehicleData.image_path}`
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