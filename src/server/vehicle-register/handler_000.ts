// src/server/vehicle-register/handler_000.ts
import { supabase } from '../../lib/supabase';
import type { VehicleFormData } from '../../types/vehicle-register/page';

export const vehicleRegisterHandler = {
  async registerVehicle(data: VehicleFormData) {
    const { error } = await supabase
      .from('vehicles')
      .insert([{
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
        vehicle_id: data.vehicle_id
      }])
      .select();

    if (error) {
      console.error('Vehicle registration error:', error);
      throw new Error(error.message || '車両の登録に失敗しました');
    }
  }
};