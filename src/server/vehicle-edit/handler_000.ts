// src/server/vehicle-edit/handler_000.ts
import { supabase } from "../../lib/supabase";
import type { VehicleFormData } from "../../types/vehicle-register/page";
import type { Vehicle } from "../../types/db/vehicle";

export const vehicleEditHandler = {
  async fetchVehicle(id: string): Promise<Vehicle> {
    const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).single();

    if (error) throw error;
    return data;
  },

  async updateVehicle(id: string, data: VehicleFormData): Promise<Vehicle> {
    // booleanの文字列を実際のboolean値に変換
    const convertedAccidentHistory = data.accident_history === "true" ? true : data.accident_history === "false" ? false : undefined;

    const convertedRecyclingDeposit = data.recycling_deposit === "true" ? true : data.recycling_deposit === "false" ? false : undefined;

    const { data: updatedVehicle, error } = await supabase
      .from("vehicles")
      .update({
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
        view360_images: data.view360_images,

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
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Vehicle update error:", error);
      throw new Error(error.message || "車両の更新に失敗しました");
    }

    return updatedVehicle;
  },

  async deleteVehicle(id: string): Promise<void> {
    // 車両データを取得
    const { data: vehicle, error: fetchError } = await supabase.from("vehicles").select("image_path, view360_images").eq("id", id).single();

    if (fetchError) {
      console.error("Fetch vehicle error:", fetchError);
      throw new Error(fetchError.message || "車両情報の取得に失敗しました");
    }

    // メイン画像の削除
    if (vehicle.image_path) {
      const { error: storageError } = await supabase.storage.from("vehicle-images").remove([vehicle.image_path]);

      if (storageError) {
        console.error("Main image delete error:", storageError);
      }
    }

    // 360度ビュー画像の削除
    if (vehicle.view360_images && vehicle.view360_images.length > 0) {
      const { error: view360Error } = await supabase.storage.from("vehicle-360").remove(vehicle.view360_images);

      if (view360Error) {
        console.error("360 view images delete error:", view360Error);
      }

      // フォルダ内のすべてのファイルを確実に削除するために、プレフィックス検索を使用
      try {
        // フォルダ内のすべてのファイルを検索
        const { data: remainingFiles } = await supabase.storage.from("vehicle-360").list(id);

        if (remainingFiles && remainingFiles.length > 0) {
          // 残っているファイルのパスを作成
          const filesToRemove = remainingFiles.map((file) => `${id}/${file.name}`);

          // 残っているファイルを削除
          const { error: cleanupError } = await supabase.storage.from("vehicle-360").remove(filesToRemove);

          if (cleanupError) {
            console.error("Failed to remove remaining files:", cleanupError);
          }
        }
      } catch (error) {
        console.error("Error during folder cleanup:", error);
      }
    }

    // 車両データの削除
    const { error: deleteError } = await supabase.from("vehicles").delete().eq("id", id);

    if (deleteError) {
      console.error("Vehicle delete error:", deleteError);
      throw new Error(deleteError.message || "車両の削除に失敗しました");
    }
  },
};
