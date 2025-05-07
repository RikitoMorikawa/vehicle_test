// src/server/vehicle-edit/handler_000.ts
import { supabase } from "../../lib/supabase";
import type { VehicleFormData } from "../../types/vehicle-register/page";
import type { Vehicle } from "../../types/db/vehicle";

export const vehicleEditHandler = {
  async fetchVehicle(id: string): Promise<Vehicle> {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateVehicle(id: string, data: VehicleFormData): Promise<Vehicle> {
    const { data: updatedVehicle, error } = await supabase
      .from("vehicles")
      .update({
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
        image_path: data.image_path, // ここに image_path を追加
        view360_images: data.view360_images, // 360度ビュー画像パスを追加
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
  const { data: vehicle, error: fetchError } = await supabase
    .from("vehicles")
    .select("image_path, view360_images")
    .eq("id", id)
    .single();
    
  if (fetchError) {
    console.error("Fetch vehicle error:", fetchError);
    throw new Error(fetchError.message || "車両情報の取得に失敗しました");
  }
  
  // メイン画像の削除
  if (vehicle.image_path) {
    const { error: storageError } = await supabase
      .storage
      .from("vehicle-images")
      .remove([vehicle.image_path]);
      
    if (storageError) {
      console.error("Main image delete error:", storageError);
    }
  }
  
  // 360度ビュー画像の削除
  if (vehicle.view360_images && vehicle.view360_images.length > 0) {
    const { error: view360Error } = await supabase
      .storage
      .from("vehicle-360")
      .remove(vehicle.view360_images);
      
    if (view360Error) {
      console.error("360 view images delete error:", view360Error);
    }
    
    // フォルダ内のすべてのファイルを確実に削除するために、プレフィックス検索を使用
    try {
      // フォルダ内のすべてのファイルを検索
      const { data: remainingFiles } = await supabase
        .storage
        .from("vehicle-360")
        .list(id);
        
      if (remainingFiles && remainingFiles.length > 0) {
        // 残っているファイルのパスを作成
        const filesToRemove = remainingFiles.map(file => `${id}/${file.name}`);
        
        // 残っているファイルを削除
        const { error: cleanupError } = await supabase
          .storage
          .from("vehicle-360")
          .remove(filesToRemove);
          
        if (cleanupError) {
          console.error("Failed to remove remaining files:", cleanupError);
        }
      }
    } catch (error) {
      console.error("Error during folder cleanup:", error);
    }
  }
  
  // 車両データの削除
  const { error: deleteError } = await supabase
    .from("vehicles")
    .delete()
    .eq("id", id);
    
  if (deleteError) {
    console.error("Vehicle delete error:", deleteError);
    throw new Error(deleteError.message || "車両の削除に失敗しました");
  }
}
};