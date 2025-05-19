import React from "react";
import Input from "../../ui/Input";
import { EstimateError } from "../../../types/estimate/page";
import { ProcessingFees } from "../../../types/db/processing_fees";

interface ProcessingFeesInfoProps {
  processingFees: ProcessingFees;
  onInputChange: (section: "processingFees", field: string, value: string | number) => void;
  errors?: EstimateError | null;
}

const ProcessingFeesInfo: React.FC<ProcessingFeesInfoProps> = ({ processingFees, onInputChange, errors }) => {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">手続代行費用内訳</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="検査登録費用"
          type="number"
          value={processingFees.inspection_registration_fee}
          onChange={(e) => onInputChange("processingFees", "inspection_registration_fee", parseInt(e.target.value))}
          error={errors?.inspection_registration_fee}
        />
        <Input
          label="車庫証明費用"
          type="number"
          value={processingFees.parking_certificate_fee}
          onChange={(e) => onInputChange("processingFees", "parking_certificate_fee", parseInt(e.target.value))}
          error={errors?.parking_certificate_fee}
        />
        <Input
          label="下取車手続費用"
          type="number"
          value={processingFees.trade_in_processing_fee}
          onChange={(e) => onInputChange("processingFees", "trade_in_processing_fee", parseInt(e.target.value))}
          error={errors?.trade_in_processing_fee}
        />
        <Input
          label="下取車査定費用"
          type="number"
          value={processingFees.trade_in_assessment_fee}
          onChange={(e) => onInputChange("processingFees", "trade_in_assessment_fee", parseInt(e.target.value))}
          error={errors?.trade_in_assessment_fee}
        />
        <Input
          label="リサイクル管理費用"
          type="number"
          value={processingFees.recycling_management_fee}
          onChange={(e) => onInputChange("processingFees", "recycling_management_fee", parseInt(e.target.value))}
          error={errors?.recycling_management_fee}
        />
        <Input
          label="納車費用"
          type="number"
          value={processingFees.delivery_fee}
          onChange={(e) => onInputChange("processingFees", "delivery_fee", parseInt(e.target.value))}
          error={errors?.delivery_fee}
        />
        <Input
          label="その他費用"
          type="number"
          value={processingFees.other_fees}
          onChange={(e) => onInputChange("processingFees", "other_fees", parseInt(e.target.value))}
          error={errors?.other_fees}
        />
      </div>
    </div>
  );
};

export default ProcessingFeesInfo;
