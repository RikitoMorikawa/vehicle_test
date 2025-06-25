// src/containers/estimate/page.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EstimateComponent from "../../components/estimate/page";
import type { EstimateError, EstimateFormData, ShippingInfo } from "../../validations/estimate/page";
import { getValidationErrors, validateEstimate } from "../../validations/custome_estimate";
import { estimateService } from "../../services/estimate/page";
import { useAuth } from "../../hooks/useAuth"; // ★追加
import { Accessory } from "../../types/db/accessories";

const EstimateContainer: React.FC = () => {
  const { id: vehicleId } = useParams<{ id: string }>(); // ★変数名をvehicleIdに変更
  const navigate = useNavigate();
  const { user } = useAuth(); // ★追加：認証情報を取得

  // 車両情報の取得
  const { vehicle, isLoading: vehicleLoading, error: vehicleError, refetch: refetchVehicle } = estimateService.useVehicle(vehicleId || "");

  // ★ページマウント時に最新データを取得
  React.useEffect(() => {
    if (vehicleId) {
      refetchVehicle();
    }
  }, [vehicleId, refetchVehicle]);

  // 見積もり作成ミューテーション
  const createEstimate = estimateService.useCreateEstimate();

  // 状態管理
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<EstimateError | null>(null);

  // フォームの初期状態
  const [formData, setFormData] = useState<EstimateFormData>({
    document_type: "estimate",
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
      annual_rate: 0,
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
    shippingInfo: {
      area_code: null,
      prefecture: "",
      city: "",
      shipping_cost: 0,
    },
  });

  // フォームデータの各セクション変更を監視して販売価格の対応するフィールドを更新するuseEffect
  // EstimateContainer の修正版 useEffect
  React.useEffect(() => {

    // 基本集計のみ（消費税計算は SalesPriceInfo に委ねる）
    const totalTaxInsurance =
      (formData.taxInsuranceFees.automobile_tax || 0) +
      (formData.taxInsuranceFees.environmental_performance_tax || 0) +
      (formData.taxInsuranceFees.weight_tax || 0) +
      (formData.taxInsuranceFees.liability_insurance_fee || 0) +
      (formData.taxInsuranceFees.voluntary_insurance_fee || 0);
    const totalLegalFee =
      (formData.legalFees.inspection_registration_stamp || 0) +
      (formData.legalFees.parking_certificate_stamp || 0) +
      (formData.legalFees.trade_in_stamp || 0) +
      (formData.legalFees.recycling_deposit || 0) +
      (formData.legalFees.other_nontaxable || 0);
    const totalProcessingFee =
      (formData.processingFees.inspection_registration_fee || 0) +
      (formData.processingFees.parking_certificate_fee || 0) +
      (formData.processingFees.trade_in_processing_fee || 0) +
      (formData.processingFees.trade_in_assessment_fee || 0) +
      (formData.processingFees.recycling_management_fee || 0) +
      (formData.processingFees.delivery_fee || 0) +
      (formData.processingFees.other_fees || 0);
    const totalAccessoriesFee = (formData.accessories || []).reduce(
      (total, accessory) => total + (typeof accessory.price === "number" ? accessory.price : 0),
      0
    );

    // ★修正：基本的な集計項目のみ更新（消費税・総額計算はSalesPriceInfoに委ねる）
    const basicUpdateNeeded =
      formData.salesPrice.tax_insurance !== totalTaxInsurance ||
      formData.salesPrice.legal_fee !== totalLegalFee ||
      formData.salesPrice.processing_fee !== totalProcessingFee ||
      formData.salesPrice.accessories_fee !== totalAccessoriesFee;

    if (basicUpdateNeeded) {

      setFormData((prev) => ({
        ...prev,
        salesPrice: {
          ...prev.salesPrice,
          // ★重要：基本集計項目のみ更新
          tax_insurance: totalTaxInsurance,
          legal_fee: totalLegalFee,
          processing_fee: totalProcessingFee,
          accessories_fee: totalAccessoriesFee,
          // ★消費税・総額関連は更新しない（SalesPriceInfoに委ねる）
        },
      }));
    } else {
      console.log("⏸️ Container 更新不要: 基本項目は同期済み");
    }

    console.groupEnd();
  }, [
    // ★修正：基本集計に必要な依存関係のみ
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
    section:
      | "salesPrice"
      | "tradeIn"
      | "loanCalculation"
      | "accessories"
      | "taxInsuranceFees"
      | "legalFees"
      | "processingFees"
      | "document_type"
      | "shippingInfo",
    name: string,
    value: string | number | boolean | number[]
  ) => {
    // document_typeの処理
    if (section === "document_type") {
      setFormData((prev) => ({
        ...prev,
        document_type: value as string,
      }));
      return;
    }

    // 配送エリア情報の処理
    if (section === "shippingInfo") {
      setFormData((prev) => ({
        ...prev,
        shippingInfo: {
          ...prev.shippingInfo,
          [name]: value,
        },
      }));
      return;
    }

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

    if (!user) {
      setErrors({ general: "ログインが必要です" }); // ★修正：setError → setErrors
      return;
    }

    if (!vehicleId) {
      setErrors({ general: "車両情報が不足しています" }); // ★修正：setError → setErrors
      return;
    }

    // バリデーション処理
    if (!validateAllFields()) {
      return;
    }

    try {
      setIsLoading(true);
      setApiError(null);

      // user.idを追加して見積書作成
      await createEstimate.mutateAsync({
        vehicleId,
        userId: user.id, // ★ログインユーザーIDを渡す
        ...formData,
      });

      // 成功時の処理
      setSuccess("見積書を作成しました");

      // ★デバッグ用ログ追加
      console.log("vehicleId:", vehicleId);
      console.log("user:", user);
      // 少し待ってから遷移（成功メッセージを見せるため）
      setTimeout(() => {
        navigate(`/vehicle/${vehicleId}`);
      }, 1000);
    } catch (err) {
      console.error("見積書作成エラー:", err);
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

  // 付属品変更用のハンドラ
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

  // 配送エリア変更用のハンドラ
  const handleShippingChange = (shippingInfo: ShippingInfo) => {
    setFormData((prev) => ({
      ...prev,
      shippingInfo,
    }));
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
      onShippingChange={handleShippingChange}
    />
  );
};

export default EstimateContainer;
