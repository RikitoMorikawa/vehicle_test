import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { loanApplicationService } from "../../services/loan-application/page";
import LoanApplicationComponent from "../../components/loan-application/page";
import type { LoanApplicationFormData, LoanApplicationError } from "../../types/loan-application/page";

const LoanApplicationContainer: React.FC = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: userInfo, isLoading: isUserLoading } = loanApplicationService.useGetUserInfo(user?.id);
  const submitApplication = loanApplicationService.useSubmitLoanApplication();

  const [formData, setFormData] = useState<LoanApplicationFormData>({
    customer_name: "",
    customer_name_kana: "",
    customer_birth_date: "",
    customer_postal_code: "",
    customer_address: "",
    customer_phone: "",
    customer_mobile_phone: "",
    employer_name: "",
    employer_postal_code: "",
    employer_address: "",
    employer_phone: "",
    employment_type: "",
    years_employed: "",
    annual_income: "",
    identification_doc: null,
    income_doc: null,
    vehicle_price: "",
    down_payment: "",
    payment_months: "",
    bonus_months: "",
    bonus_amount: "",
    guarantor_name: "",
    guarantor_name_kana: "",
    guarantor_relationship: "",
    guarantor_phone: "",
    guarantor_postal_code: "",
    guarantor_address: "",
    notes: "",
  });

  const [error, setError] = useState<LoanApplicationError | null>(null);

  // ユーザー情報が取得できたらフォームに初期値を設定
  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
      }));
    }
  }, [userInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error?.[name]) {
      setError((prev) => (prev ? { ...prev, [name]: undefined } : null));
    }
  };

  const handleFileChange = (name: string, file: File) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
    if (error?.[name]) {
      setError((prev) => (prev ? { ...prev, [name]: undefined } : null));
    }
  };

  const validateForm = (): boolean => {
    const errors: LoanApplicationError = {};

    // 必須フィールドの検証
    const requiredFields = [
      "customer_name",
      "customer_name_kana",
      "customer_birth_date",
      "customer_postal_code",
      "customer_address",
      "customer_mobile_phone",
      "employer_name",
      "employer_postal_code",
      "employer_address",
      "employer_phone",
      "employment_type",
      "years_employed",
      "annual_income",
      "vehicle_price",
      "down_payment",
      "payment_months",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field as keyof LoanApplicationFormData]) {
        errors[field] = "この項目は必須です";
      }
    });

    // ファイル検証
    if (!formData.identification_doc) {
      errors.identification_doc = "本人確認書類を添付してください";
    }
    if (!formData.income_doc) {
      errors.income_doc = "収入証明書類を添付してください";
    }

    // 数値フィールドの検証
    const numericFields = ["years_employed", "annual_income", "vehicle_price", "down_payment", "payment_months", "bonus_amount"];
    numericFields.forEach((field) => {
      const value = formData[field as keyof LoanApplicationFormData];
      if (value && isNaN(Number(value))) {
        errors[field] = "数値を入力してください";
      }
    });

    // カスタム検証（例：頭金は車両価格より小さい必要がある）
    if (formData.down_payment && formData.vehicle_price && Number(formData.down_payment) >= Number(formData.vehicle_price)) {
      errors.down_payment = "頭金は車両価格より小さい金額にしてください";
    }

    setError(Object.keys(errors).length > 0 ? errors : null);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!user) {
      setError({
        general: "ログインが必要です。再度ログインしてください。",
      });
      return;
    }

    if (!vehicleId) {
      setError({
        general: "車両情報が不足しています。",
      });
      return;
    }

    try {
      console.log("ローン申請を送信中...");
      const result = await submitApplication.mutateAsync({
        userId: user.id,
        vehicleId,
        formData,
      });

      if (result.success) {
        console.log("ローン申請が完了しました");
        navigate("/application-complete");
      } else {
        setError({
          general: result.error || "申込の送信に失敗しました。もう一度お試しください。",
        });
      }
    } catch (err) {
      console.error("ローン申請送信エラー:", err);
      setError({
        general: "申込の送信に失敗しました。もう一度お試しください。",
      });
    }
  };

  return (
    <LoanApplicationComponent
      vehicle={null}
      formData={formData}
      error={error}
      isLoading={submitApplication.isPending || isUserLoading}
      onSubmit={handleSubmit}
      onInputChange={handleInputChange}
      onFileChange={handleFileChange}
    />
  );
};

export default LoanApplicationContainer;
