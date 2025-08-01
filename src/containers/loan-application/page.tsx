import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { loanApplicationService } from "../../services/loan-application/page";
import LoanApplicationComponent from "../../components/loan-application/page";
import type { LoanApplicationFormData, LoanApplicationError } from "../../types/loan-application/page";
import { validateLoanApplication } from "../../validations/loan-application/page";

const LoanApplicationContainer: React.FC = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const submitApplication = loanApplicationService.useSubmitLoanApplication();

  const [formData, setFormData] = useState<LoanApplicationFormData>({
    // 基本情報
    customer_name: "",
    customer_name_kana: "",
    customer_birth_date: "",
    customer_postal_code: "",
    customer_address: "",
    customer_phone: "",
    customer_mobile_phone: "",

    // 居住情報（新規追加）
    residence_type: "",
    residence_years: "",
    marital_status: "",
    family_composition: "",
    dependents_count: "",

    // 勤務先情報
    employer_name: "",
    employer_postal_code: "",
    employer_address: "",
    employer_phone: "",
    employment_type: "",
    years_employed: "",
    annual_income: "",

    // 書類
    identification_doc: null,
    income_doc: null,

    // ローン情報
    vehicle_price: "",
    down_payment: "",
    payment_months: "",
    bonus_months: "",
    bonus_amount: "",

    // 連帯保証人情報
    guarantor_name: "",
    guarantor_name_kana: "",
    guarantor_relationship: "",
    guarantor_phone: "",
    guarantor_postal_code: "",
    guarantor_address: "",

    // 備考
    notes: "",
  });

  const [error, setError] = useState<LoanApplicationError | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // エラーをクリア
    if (error?.[name as keyof LoanApplicationError]) {
      setError((prev) => (prev ? { ...prev, [name]: undefined } : null));
    }
  };

  const handleFileChange = (name: string, file: File) => {
    setFormData((prev) => ({ ...prev, [name]: file }));

    // エラーをクリア
    if (error?.[name as keyof LoanApplicationError]) {
      setError((prev) => (prev ? { ...prev, [name]: undefined } : null));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    // バリデーション実行
    const validation = validateLoanApplication(formData);
    if (!validation.success) {
      setError(validation.errors || {});
      // 最初のエラーがある要素にスクロール
      const firstErrorElement = document.querySelector('[class*="text-red-600"]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    try {
      const result = await submitApplication.mutateAsync({
        userId: user.id,
        vehicleId,
        formData,
      });

      if (result.success) {
        navigate("/application-complete", {
          state: {
            applicationId: result.applicationId,
            message: "ローン審査申込が正常に送信されました。審査結果は後日ご連絡いたします。",
          },
        });
      } else {
        setError({
          general: result.error || "申込の送信に失敗しました。もう一度お試しください。",
        });
      }
    } catch (err) {
      console.error("ローン申請送信エラー:", err);
      setError({
        general: "申込の送信に失敗しました。ネットワーク接続を確認してもう一度お試しください。",
      });
    }
  };

  return (
    <LoanApplicationComponent
      vehicle={null}
      formData={formData}
      error={error}
      isLoading={submitApplication.isPending}
      onSubmit={handleSubmit}
      onInputChange={handleInputChange}
      onFileChange={handleFileChange}
    />
  );
};

export default LoanApplicationContainer;
