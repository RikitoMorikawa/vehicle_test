// src/server/vehicle-register/handler_000.ts

import { supabase } from "../../lib/supabase";
import type { VehicleFormData } from "../../types/vehicle-register/page";

export const vehicleRegisterHandler = {
  async registerVehicle(data: VehicleFormData) {
    // booleanの文字列を実際のboolean値に変換
    const convertedAccidentHistory = data.accident_history === "true" ? true : data.accident_history === "false" ? false : undefined;
    const convertedRecyclingDeposit = data.recycling_deposit === "true" ? true : data.recycling_deposit === "false" ? false : undefined;

    // 車両データを挿入して、生成されたIDを取得
    const { data: insertedData, error } = await supabase
      .from("vehicles")
      .insert([
        {
          // 基本情報
          name: data.name,
          maker: data.maker,
          year: parseInt(data.year),
          mileage: parseInt(data.mileage),
          price: parseInt(data.price),
          model_code: data.model_code,
          color: data.color,
          engine_size: parseInt(data.engine_size),
          transmission: data.transmission,
          drive_system: data.drive_system,
          inspection_date: data.inspection_date,
          vehicle_id: data.vehicle_id,
          image_path: data.image_path,
          view360_images: data.view360_images || [], // 追加

          // 新しく追加したフィールド
          vehicle_status: data.vehicle_status || undefined,
          full_model_code: data.full_model_code || undefined,
          grade: data.grade || undefined,
          registration_number: data.registration_number || undefined,
          first_registration_date: data.first_registration_date || undefined,
          chassis_number: data.chassis_number || undefined,
          body_type: data.body_type || undefined,
          door_count: data.door_count ? parseInt(data.door_count) : undefined,
          desired_number: data.desired_number || undefined,
          sales_format: data.sales_format || undefined,
          accident_history: convertedAccidentHistory,
          recycling_deposit: convertedRecyclingDeposit,
          registration_date: data.registration_date || undefined,
          tax_rate: data.tax_rate ? parseInt(data.tax_rate) : undefined,
        },
      ])
      .select();

    if (error) {
      console.error("Vehicle registration error:", error);
      throw new Error(error.message || "車両の登録に失敗しました");
    }

    // 登録されたデータを返す（コンテナーでIDを使用するため）
    return insertedData[0];
  },
};
