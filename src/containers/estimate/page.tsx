// src/containers/estimate/page.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EstimateComponent from "../../components/estimate/page";
import type { EstimateError, EstimateFormData } from "../../validations/estimate/page";
import { getValidationErrors, validateEstimate } from "../../validations/custome_estimate";
import { estimateService } from "../../services/estimate/page";

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
  });

  // 入力値変更ハンドラ
  const handleInputChange = (section: "tradeIn" | "loanCalculation", name: string, value: string | number | boolean | number[]) => {
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
    />
  );
};

export default EstimateContainer;
