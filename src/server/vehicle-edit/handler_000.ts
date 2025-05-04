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
};