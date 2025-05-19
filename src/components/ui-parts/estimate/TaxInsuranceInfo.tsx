import React from "react";
import Input from "../../ui/Input";
import { EstimateError } from "../../../types/estimate/page";
import { TaxInsuranceFees } from "../../../types/db/tax_insurance_fees";

interface TaxInsuranceInfoProps {
  taxInsuranceFees: TaxInsuranceFees;
  onInputChange: (section: "taxInsuranceFees", field: string, value: string | number) => void;
  errors?: EstimateError | null;
}

const TaxInsuranceInfo: React.FC<TaxInsuranceInfoProps> = ({ taxInsuranceFees, onInputChange, errors }) => {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">税金・保険料内訳</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="自動車税"
          type="number"
          value={taxInsuranceFees.automobile_tax}
          onChange={(e) => onInputChange("taxInsuranceFees", "automobile_tax", parseInt(e.target.value))}
          error={errors?.automobile_tax}
        />
        <Input
          label="環境性能割"
          type="number"
          value={taxInsuranceFees.environmental_performance_tax}
          onChange={(e) => onInputChange("taxInsuranceFees", "environmental_performance_tax", parseInt(e.target.value))}
          error={errors?.environmental_performance_tax}
        />
        <Input
          label="重量税"
          type="number"
          value={taxInsuranceFees.weight_tax}
          onChange={(e) => onInputChange("taxInsuranceFees", "weight_tax", parseInt(e.target.value))}
          error={errors?.weight_tax}
        />
        <Input
          label="自賠責保険料"
          type="number"
          value={taxInsuranceFees.liability_insurance_fee}
          onChange={(e) => onInputChange("taxInsuranceFees", "liability_insurance_fee", parseInt(e.target.value))}
          error={errors?.liability_insurance_fee}
        />
        <Input
          label="任意保険料"
          type="number"
          value={taxInsuranceFees.voluntary_insurance_fee}
          onChange={(e) => onInputChange("taxInsuranceFees", "voluntary_insurance_fee", parseInt(e.target.value))}
          error={errors?.voluntary_insurance_fee}
        />
      </div>
    </div>
  );
};

export default TaxInsuranceInfo;
