import React from "react";
import Input from "../../ui/Input";
import { TradeIn, EstimateError } from "../../../types/estimate/page";

interface TradeInInfoProps {
  tradeIn: TradeIn;
  onInputChange: (section: "tradeIn", field: string, value: string | number) => void;
  errors?: EstimateError | null;
}

const TradeInInfo: React.FC<TradeInInfoProps> = ({ tradeIn, onInputChange, errors }) => {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">下取り車両情報</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="車名"
          value={tradeIn.vehicle_name}
          onChange={(e) => onInputChange("tradeIn", "vehicle_name", e.target.value)}
          error={errors?.vehicle_name}
        />
        <Input
          label="登録番号"
          value={tradeIn.registration_number}
          onChange={(e) => onInputChange("tradeIn", "registration_number", e.target.value)}
          error={errors?.registration_number}
        />
        <Input
          label="走行距離"
          type="number"
          value={tradeIn.mileage}
          onChange={(e) => onInputChange("tradeIn", "mileage", parseInt(e.target.value))}
          error={errors?.mileage}
        />
        <Input
          label="初度登録年月"
          type="date"
          value={tradeIn.first_registration_date}
          onChange={(e) => onInputChange("tradeIn", "first_registration_date", e.target.value)}
          error={errors?.first_registration_date}
        />
        <Input
          label="車検満了日"
          type="date"
          value={tradeIn.inspection_expiry_date}
          onChange={(e) => onInputChange("tradeIn", "inspection_expiry_date", e.target.value)}
          error={errors?.inspection_expiry_date}
        />
        <Input
          label="車台番号"
          value={tradeIn.chassis_number}
          onChange={(e) => onInputChange("tradeIn", "chassis_number", e.target.value)}
          error={errors?.chassis_number}
        />
        <Input
          label="外装色"
          value={tradeIn.exterior_color}
          onChange={(e) => onInputChange("tradeIn", "exterior_color", e.target.value)}
          error={errors?.exterior_color}
        />
      </div>
    </div>
  );
};

export default TradeInInfo;
