// src / containers / vehicle - register / page.tsx;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { vehicleRegisterService } from "../../services/vehicle-register/page";
import VehicleRegisterComponent from "../../components/vehicle-register/page";
import type { VehicleFormData, VehicleRegisterError } from "../../types/vehicle-register/page";

const VehicleRegisterContainer: React.FC = () => {
  const navigate = useNavigate();
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
  const [error, setError] = useState<VehicleRegisterError | null>(null);

  const registerVehicle = vehicleRegisterService.useRegisterVehicle();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error?.[name as keyof VehicleRegisterError]) {
      setError((prev) => (prev ? { ...prev, [name]: undefined } : null));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: VehicleRegisterError = {};
    let isValid = true;

    if (!formData.vehicle_id) {
      newErrors.vehicle_id = "車両IDを入力してください";
      isValid = false;
    }
    if (!formData.maker) {
      newErrors.maker = "メーカーを選択してください";
      isValid = false;
    }
    if (!formData.name) {
      newErrors.name = "車名を入力してください";
      isValid = false;
    }
    if (!formData.model_code) {
      newErrors.model_code = "型式を入力してください";
      isValid = false;
    }
    if (!formData.year) {
      newErrors.year = "年式を入力してください";
      isValid = false;
    }
    if (!formData.mileage) {
      newErrors.mileage = "走行距離を入力してください";
      isValid = false;
    }
    if (!formData.price) {
      newErrors.price = "価格を入力してください";
      isValid = false;
    }
    if (!formData.color) {
      newErrors.color = "ボディカラーを入力してください";
      isValid = false;
    }
    if (!formData.engine_size) {
      newErrors.engine_size = "排気量を入力してください";
      isValid = false;
    }
    if (!formData.transmission) {
      newErrors.transmission = "シフトを選択してください";
      isValid = false;
    }
    if (!formData.drive_system) {
      newErrors.drive_system = "駆動方式を選択してください";
      isValid = false;
    }
    if (!formData.inspection_date) {
      newErrors.inspection_date = "車検満了日を入力してください";
      isValid = false;
    }

    setError(isValid ? null : newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await registerVehicle.mutateAsync(formData);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError({
        general: "車両の登録に失敗しました",
      });
    }
  };

  return (
    <VehicleRegisterComponent
      formData={formData}
      isLoading={registerVehicle.isPending}
      error={error}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/dashboard")}
    />
  );
};

export default VehicleRegisterContainer;
