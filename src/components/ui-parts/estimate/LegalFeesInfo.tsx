import React from "react";
import Input from "../../ui/Input";
import { LegalFees, EstimateError } from "../../../types/estimate/page";

interface LegalFeesInfoProps {
  legalFees: LegalFees;
  onInputChange: (section: "legalFees", field: string, value: string | number) => void;
  errors?: EstimateError | null;
}

const LegalFeesInfo: React.FC<LegalFeesInfoProps> = ({ legalFees, onInputChange, errors }) => {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">預り法定費用内訳</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="検査登録印紙代"
          type="number"
          value={legalFees.inspection_registration_stamp}
          onChange={(e) => onInputChange("legalFees", "inspection_registration_stamp", parseInt(e.target.value))}
          error={errors?.inspection_registration_stamp}
        />
        <Input
          label="車庫証明印紙代"
          type="number"
          value={legalFees.parking_certificate_stamp}
          onChange={(e) => onInputChange("legalFees", "parking_certificate_stamp", parseInt(e.target.value))}
          error={errors?.parking_certificate_stamp}
        />
        <Input
          label="下取車印紙代"
          type="number"
          value={legalFees.trade_in_stamp}
          onChange={(e) => onInputChange("legalFees", "trade_in_stamp", parseInt(e.target.value))}
          error={errors?.trade_in_stamp}
        />
        <Input
          label="リサイクル預託金"
          type="number"
          value={legalFees.recycling_deposit}
          onChange={(e) => onInputChange("legalFees", "recycling_deposit", parseInt(e.target.value))}
          error={errors?.recycling_deposit}
        />
        <Input
          label="その他非課税"
          type="number"
          value={legalFees.other_nontaxable}
          onChange={(e) => onInputChange("legalFees", "other_nontaxable", parseInt(e.target.value))}
          error={errors?.other_nontaxable}
        />
      </div>
    </div>
  );
};

export default LegalFeesInfo;
