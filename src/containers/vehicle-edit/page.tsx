import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VehicleEditComponent from "../../components/vehicle-edit/page";
import { vehicleEditService } from "../../services/vehicle-edit/page";
import { validateVehicleEditForm } from "../../validations/vehicle-edit/page";
import type { VehicleFormData, VehicleRegisterError } from "../../types/vehicle-register/page";

const VehicleEditContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<VehicleRegisterError | null>(null);

  const [formData, setFormData] = useState<VehicleFormData>({
    name: "",
    maker: "",
    year: new Date().getFullYear().toString(),
    mileage: "",
    price: "",
    model_code: "",
    color: "",
    engine_size: "",
    transmission: "",
    drive_system: "",
    inspection_date: "",
    vehicle_id: "",
  });

  const { data: vehicle, isLoading } = vehicleEditService.useVehicle(id!);
  const updateVehicle = vehicleEditService.useUpdateVehicle();

  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name,
        maker: vehicle.maker,
        year: vehicle.year.toString(),
        mileage: vehicle.mileage.toString(),
        price: vehicle.price.toString(),
        model_code: vehicle.model_code || "",
        color: vehicle.color || "",
        engine_size: vehicle.engine_size?.toString() || "",
        transmission: vehicle.transmission || "",
        drive_system: vehicle.drive_system || "",
        inspection_date: vehicle.inspection_date || "",
        vehicle_id: vehicle.vehicle_id || "",
      });
    }
  }, [vehicle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error?.[name as keyof VehicleRegisterError]) {
      setError((prev) => (prev ? { ...prev, [name]: undefined } : null));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const validation = validateVehicleEditForm(formData);
    if (!validation.success) {
      setError(validation.errors);
      return;
    }

    try {
      await updateVehicle.mutateAsync({ id, formData });
      navigate("/vehicles");
    } catch (err: unknown) {
      console.error(err);
      setError({
        general: err instanceof Error ? err.message : "車両の更新に失敗しました",
      });
    }
  };

  return (
    <VehicleEditComponent
      formData={formData}
      isLoading={isLoading}
      isSaving={updateVehicle.isPending}
      error={error}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/vehicles")}
    />
  );
};

export default VehicleEditContainer;
