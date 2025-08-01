// src/services/vehicle-register/page.ts
import { useMutation } from '@tanstack/react-query';
import { vehicleRegisterHandler } from '../../server/vehicle-register/handler_000';
import type { VehicleFormData } from '../../types/vehicle-register/page';

function useRegisterVehicle() {
  return useMutation({
    mutationFn: (data: VehicleFormData) => vehicleRegisterHandler.registerVehicle(data),
  });
}

export const vehicleRegisterService = {
  useRegisterVehicle,
};