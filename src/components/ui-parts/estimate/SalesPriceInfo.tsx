import React from "react";
import Input from "../../ui/Input";
import { SalesPrice, EstimateError } from "../../../types/estimate/page";

interface SalesPriceInfoProps {
  salesPrice: SalesPrice;
  onInputChange: (section: "salesPrice", field: string, value: string | number) => void;
  errors?: EstimateError | null;
}

const SalesPriceInfo: React.FC<SalesPriceInfoProps> = ({ salesPrice, onInputChange, errors }) => {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">販売価格情報</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="本体価格"
          type="number"
          value={salesPrice.base_price}
          onChange={(e) => onInputChange("salesPrice", "base_price", parseInt(e.target.value))}
          error={errors?.base_price}
        />
        <Input
          label="値引き額"
          type="number"
          value={salesPrice.discount}
          onChange={(e) => onInputChange("salesPrice", "discount", parseInt(e.target.value))}
          error={errors?.discount}
        />
        <Input
          label="検査費用"
          type="number"
          value={salesPrice.inspection_fee}
          onChange={(e) => onInputChange("salesPrice", "inspection_fee", parseInt(e.target.value))}
          error={errors?.inspection_fee}
        />
        <Input
          label="付属品費用"
          type="number"
          value={salesPrice.accessories_fee}
          onChange={(e) => onInputChange("salesPrice", "accessories_fee", parseInt(e.target.value))}
          error={errors?.accessories_fee}
        />
        <Input
          label="車両価格"
          type="number"
          value={salesPrice.vehicle_price}
          onChange={(e) => onInputChange("salesPrice", "vehicle_price", parseInt(e.target.value))}
          error={errors?.vehicle_price}
        />
        <Input
          label="税金・保険料"
          type="number"
          value={salesPrice.tax_insurance}
          onChange={(e) => onInputChange("salesPrice", "tax_insurance", parseInt(e.target.value))}
          error={errors?.tax_insurance}
        />
        <Input
          label="法定費用"
          type="number"
          value={salesPrice.legal_fee}
          onChange={(e) => onInputChange("salesPrice", "legal_fee", parseInt(e.target.value))}
          error={errors?.legal_fee}
        />
        <Input
          label="手続代行費用"
          type="number"
          value={salesPrice.processing_fee}
          onChange={(e) => onInputChange("salesPrice", "processing_fee", parseInt(e.target.value))}
          error={errors?.processing_fee}
        />
        <Input
          label="その他費用"
          type="number"
          value={salesPrice.misc_fee}
          onChange={(e) => onInputChange("salesPrice", "misc_fee", parseInt(e.target.value))}
          error={errors?.misc_fee}
        />
      </div>
    </div>
  );
};

export default SalesPriceInfo;
