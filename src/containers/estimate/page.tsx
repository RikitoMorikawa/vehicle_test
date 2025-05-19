import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EstimateComponent from "../../components/estimate/page";
import { estimateService } from "../../services/estimate/page";
import type { EstimateError, EstimateFormData } from "../../types/estimate/page";
import { Accessory } from "../../types/db/accessories";
import { validateEstimate } from "../../validations/estimate/page";

const EstimateContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vehicle, isLoading, error: apiError } = estimateService.useVehicle(id!);
  const createEstimate = estimateService.useCreateEstimate();

  // ローン申込画面と同様のエラー/成功状態管理
  const [error, setError] = useState<EstimateError | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<EstimateFormData>({
    tradeIn: {
      vehicle_name: "",
      registration_number: "",
      mileage: 0,
      first_registration_date: "",
      inspection_expiry_date: "",
      chassis_number: "",
      exterior_color: "",
    },
    salesPrice: {
      base_price: vehicle?.price || 0,
      discount: 0,
      inspection_fee: 0,
      accessories_fee: 0,
      vehicle_price: vehicle?.price || 0,
      tax_insurance: 0,
      legal_fee: 0,
      processing_fee: 0,
      misc_fee: 0,
      consumption_tax: 0,
      total_price: 0,
      trade_in_price: 0,
      trade_in_debt: 0,
      payment_total: 0,
    },
    loanCalculation: {
      down_payment: 0,
      principal: 0,
      interest_fee: 0,
      total_payment: 0,
      payment_count: 36,
      payment_period: 36,
      first_payment: 0,
      monthly_payment: 0,
      bonus_months: [],
      bonus_amount: 0,
    },
    processingFees: {
      inspection_registration_fee: 0,
      parking_certificate_fee: 0,
      trade_in_processing_fee: 0,
      trade_in_assessment_fee: 0,
      recycling_management_fee: 0,
      delivery_fee: 0,
      other_fees: 0,
    },
    legalFees: {
      inspection_registration_stamp: 0,
      parking_certificate_stamp: 0,
      trade_in_stamp: 0,
      recycling_deposit: 0,
      other_nontaxable: 0,
    },
    taxInsuranceFees: {
      automobile_tax: 0,
      environmental_performance_tax: 0,
      weight_tax: 0,
      liability_insurance_fee: 0,
      voluntary_insurance_fee: 0,
    },
    accessories: [],
  });

  // src/containers/estimate/page.tsx
  const handleInputChange = (
    section: "tradeIn" | "salesPrice" | "loanCalculation" | "processingFees" | "legalFees" | "taxInsuranceFees",
    name: string,
    value: number | string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));

    // セクションとフィールド名から単一のエラーキーを取得
    const errorKey = name; // 単純にフィールド名をエラーキーとして使用

    // エラーをクリア
    if (error && error[errorKey]) {
      setError((prev) => {
        if (!prev) return null;
        const newError = { ...prev };
        delete newError[errorKey];
        return Object.keys(newError).length > 0 ? newError : null;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    // エラーと成功メッセージをリセット
    setError(null);
    setSuccess(null);

    // バリデーションを実行
    const validationResult = validateEstimate(formData);

    if (!validationResult.success) {
      // バリデーションエラーがある場合はエラーメッセージをセット
      setError(validationResult.errors);
      return;
    }

    try {
      // バリデーションが成功した場合はフォームデータを送信
      await createEstimate.mutateAsync({
        vehicleId: id,
        ...formData,
      });
      setSuccess("見積書が正常に作成されました");
      setTimeout(() => {
        navigate("/vehicles");
      }, 2000);
    } catch (err) {
      console.error("Failed to create estimate:", err);
      setError({
        general: "見積書の作成に失敗しました",
      });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // アクセサリー専用のハンドラ関数
  const handleAccessoriesChange = (action: "add" | "remove", value: Accessory | number) => {
    if (action === "add" && typeof value !== "number") {
      // アクセサリー追加の処理
      // const newAccessories = [...formData.accessories, value];
      // フォームデータの更新 (具体的な更新方法はアプリケーションによって異なります)
      // 例: setFormData({ ...formData, accessories: newAccessories });

      // または他のロジックを実行
      console.log("Adding accessory:", value);
    } else if (action === "remove" && typeof value === "number") {
      // アクセサリー削除の処理
      const updatedAccessories = [...formData.accessories];
      updatedAccessories.splice(value, 1);
      // フォームデータの更新
      // 例: setFormData({ ...formData, accessories: updatedAccessories });

      // または他のロジックを実行
      console.log("Removing accessory at index:", value);
    }
  };

  return (
    <EstimateComponent
      vehicle={vehicle}
      loading={isLoading}
      error={apiError ? "見積書の作成に失敗しました" : null}
      formData={formData}
      errors={error}
      success={success}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onAccessoryChange={handleAccessoriesChange} // アクセサリー変更のハンドラを渡す
    />
  );
};

export default EstimateContainer;
