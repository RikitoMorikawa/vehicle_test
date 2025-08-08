// src/services/vehicle-register/vehicleIdService.ts
import { supabase } from "../../lib/supabase";

export const vehicleIdService = {
  /**
   * 次の車両IDを生成する（8桁の連番）
   * @returns Promise<string> - 次の8桁車両ID（例: "00000001"）
   */
  async generateNextVehicleId(): Promise<string> {
    try {
      // vehiclesテーブルからすべてのvehicle_idを取得
      const { data, error } = await supabase
        .from("vehicles")
        .select("vehicle_id")
        .not("vehicle_id", "is", null);

      if (error) {
        console.error("Error fetching vehicle_ids:", error);
        throw new Error("車両IDの取得に失敗しました");
      }

      let maxId = 0;

      // 数字8桁のvehicle_idのみを抽出して最大値を求める
      if (data && data.length > 0) {
        data.forEach((row) => {
          const vehicleId = row.vehicle_id;
          // 数字8桁かどうかをチェック（正規表現で厳密にチェック）
          if (vehicleId && /^\d{8}$/.test(vehicleId)) {
            const numericId = parseInt(vehicleId, 10);
            if (numericId > maxId) {
              maxId = numericId;
            }
          }
        });
      }

      // 次のIDを生成（最大値+1、初回は1）
      const nextId = maxId + 1;

      // 8桁の0埋め文字列として返す
      return nextId.toString().padStart(8, "0");
    } catch (error) {
      console.error("Error generating vehicle ID:", error);
      // エラー時は現在時刻ベースの8桁IDを生成
      const fallbackId = Date.now().toString().slice(-8).padStart(8, "0");
      return fallbackId;
    }
  }
};