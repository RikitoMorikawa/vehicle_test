// src/containers/estimate/page.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EstimateComponent from "../../components/estimate/page";
import type { EstimateError, EstimateFormData } from "../../validations/estimate/page";
import { getValidationErrors, validateEstimate } from "../../validations/custome_estimate";
import { estimateService } from "../../services/estimate/page";
import { Accessory } from "../../types/db/accessories";

const EstimateContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URLから車両IDを取得
  const navigate = useNavigate();

  // 車両情報の取得
  const { vehicle, isLoading: vehicleLoading, error: vehicleError } = estimateService.useVehicle(id || "");

  // 見積もり作成ミューテーション
  const createEstimate = estimateService.useCreateEstimate();

  // 状態管理
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<EstimateError | null>(null);

  // フォームの初期状態
  const [formData, setFormData] = useState<EstimateFormData>({
    salesPrice: {
      base_price: 0,
      discount: 0,
      inspection_fee: 0,
      accessories_fee: 0,
      vehicle_price: 0,
      tax_insurance: 0,
      legal_fee: 0,
      processing_fee: 0,
      misc_fee: 0,
      // 追加されたカラム
      consumption_tax: 0,
      total_price: 0,
      trade_in_price: 0,
      trade_in_debt: 0,
      payment_total: 0,
    },
    tradeIn: {
      trade_in_available: true, // 下取り車両の有無
      vehicle_name: "",
      registration_number: "",
      mileage: 0,
      first_registration_date: "",
      inspection_expiry_date: "",
      chassis_number: "",
      exterior_color: "",
    },
    loanCalculation: {
      down_payment: 0,
      principal: 0,
      interest_fee: 0,
      total_payment: 0,
      payment_count: 24,
      payment_period: 2, // 24ヶ月 = 2年
      first_payment: 0,
      monthly_payment: 0,
      bonus_amount: 0,
      bonus_months: [],
    },
    accessories: [],
    taxInsuranceFees: {
      automobile_tax: 0,
      environmental_performance_tax: 0,
      weight_tax: 0,
      liability_insurance_fee: 0,
      voluntary_insurance_fee: 0,
    },
    legalFees: {
      inspection_registration_stamp: 0,
      parking_certificate_stamp: 0,
      trade_in_stamp: 0,
      recycling_deposit: 0,
      other_nontaxable: 0,
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
  });

  // フォームデータの各セクション変更を監視して販売価格の対応するフィールドを更新するuseEffect
  React.useEffect(() => {
    // 税金・保険料の合計
    const totalTaxInsurance =
      (formData.taxInsuranceFees.automobile_tax || 0) +
      (formData.taxInsuranceFees.environmental_performance_tax || 0) +
      (formData.taxInsuranceFees.weight_tax || 0) +
      (formData.taxInsuranceFees.liability_insurance_fee || 0) +
      (formData.taxInsuranceFees.voluntary_insurance_fee || 0);

    // 法定費用の合計
    const totalLegalFee =
      (formData.legalFees.inspection_registration_stamp || 0) +
      (formData.legalFees.parking_certificate_stamp || 0) +
      (formData.legalFees.trade_in_stamp || 0) +
      (formData.legalFees.recycling_deposit || 0) +
      (formData.legalFees.other_nontaxable || 0);

    // 手続代行費用の合計
    const totalProcessingFee =
      (formData.processingFees.inspection_registration_fee || 0) +
      (formData.processingFees.parking_certificate_fee || 0) +
      (formData.processingFees.trade_in_processing_fee || 0) +
      (formData.processingFees.trade_in_assessment_fee || 0) +
      (formData.processingFees.recycling_management_fee || 0) +
      (formData.processingFees.delivery_fee || 0) +
      (formData.processingFees.other_fees || 0);

    // 付属品費用の合計
    const totalAccessoriesFee = (formData.accessories || []).reduce((total, accessory) => {
      return total + (typeof accessory.price === "number" ? accessory.price : 0);
    }, 0);

    // 値が異なる場合のみ更新（無限ループ防止）
    const needsUpdate =
      formData.salesPrice.tax_insurance !== totalTaxInsurance ||
      formData.salesPrice.legal_fee !== totalLegalFee ||
      formData.salesPrice.processing_fee !== totalProcessingFee ||
      formData.salesPrice.accessories_fee !== totalAccessoriesFee;

    if (needsUpdate) {
      setFormData((prev) => ({
        ...prev,
        salesPrice: {
          ...prev.salesPrice,
          tax_insurance: totalTaxInsurance,
          legal_fee: totalLegalFee,
          processing_fee: totalProcessingFee,
          accessories_fee: totalAccessoriesFee,
        },
      }));
    }
  }, [
    // 全ての依存項目を列挙
    formData.taxInsuranceFees,
    formData.legalFees,
    formData.processingFees,
    formData.accessories,
    formData.salesPrice.tax_insurance,
    formData.salesPrice.legal_fee,
    formData.salesPrice.processing_fee,
    formData.salesPrice.accessories_fee,
  ]);

  // 入力値変更ハンドラ
  const handleInputChange = (
    section: "salesPrice" | "tradeIn" | "loanCalculation" | "accessories" | "taxInsuranceFees" | "legalFees" | "processingFees",
    name: string,
    value: string | number | boolean | number[]
  ) => {
    // ローン計算の特別処理
    if (section === "loanCalculation") {
      if (name === "payment_count" && typeof value === "number") {
        // 支払回数が変更されたら、支払期間も自動計算して更新（月→年の変換）
        const paymentPeriodValue = Math.floor(value / 12);

        setFormData((prev) => ({
          ...prev,
          loanCalculation: {
            ...prev.loanCalculation,
            [name]: value,
            payment_period: paymentPeriodValue,
          },
        }));
        return;
      }

      // ボーナス月の配列処理
      if (name === "bonus_months" && Array.isArray(value)) {
        setFormData((prev) => ({
          ...prev,
          loanCalculation: {
            ...prev.loanCalculation,
            bonus_months: value,
          },
        }));
        return;
      }
    }

    // 数値フィールドの一般的な処理
    if ((section === "tradeIn" && name === "mileage") || (section === "loanCalculation" && typeof value !== "object")) {
      // 値の変換（文字列→数値）
      const numValue = value === "" ? 0 : typeof value === "string" ? parseInt(value.replace(/[^0-9]/g, "") || "0", 10) : value;

      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: numValue,
        },
      }));
    } else {
      // その他のテキストフィールド
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }));
    }
  };

  // バリデーション実行
  const validateAllFields = (): boolean => {
    const validation = validateEstimate(formData);

    if (!validation.success) {
      const structuredErrors = getValidationErrors(validation);
      setErrors(structuredErrors);
      return false;
    }

    setErrors(null);
    return true;
  };

  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    // エラーと成功メッセージをリセット
    setSuccess(null);
    setApiError(null);

    // バリデーション実行
    const isValid = validateAllFields();
    if (!isValid) return;

    // ローディング開始
    setIsLoading(true);

    try {
      // 見積もり作成APIを呼び出し
      await createEstimate.mutateAsync({
        vehicleId: id,
        ...formData,
      });

      // 成功メッセージを表示
      setSuccess("見積書が正常に作成されました");

      // 成功後に一覧画面へリダイレクト
      setTimeout(() => {
        navigate("/vehicles");
      }, 2000);
    } catch (err) {
      console.error("Failed to create estimate:", err);
      setApiError("見積書の作成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // キャンセルハンドラ
  const handleCancel = () => {
    navigate(-1);
  };

  // ローディング状態の統合
  const isPageLoading = isLoading || vehicleLoading;

  // エラーメッセージの統合
  const pageError = apiError || (vehicleError ? "車両情報の取得に失敗しました" : null);

  // 付属品変更用の新しいハンドラを追加
  const handleAccessoryChange = (action: "add" | "remove", value: Accessory | number) => {
    if (action === "add" && typeof value !== "number") {
      // 付属品を追加
      setFormData((prev) => ({
        ...prev,
        accessories: [...prev.accessories, value as Accessory],
      }));
    } else if (action === "remove" && typeof value === "number") {
      // インデックスで付属品を削除
      setFormData((prev) => ({
        ...prev,
        accessories: prev.accessories.filter((_, index) => index !== value),
      }));
    }
  };

  return (
    <EstimateComponent
      loading={isPageLoading}
      error={pageError}
      vehicle={vehicle}
      formData={formData}
      errors={errors}
      success={success}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onAccessoryChange={handleAccessoryChange}
    />
  );
};

export default EstimateContainer;
