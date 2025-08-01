// src/containers/document-edit/page.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DocumentEditComponent from "../../components/document-edit/page";
import type { EstimateError, EstimateFormData, ShippingInfo } from "../../validations/estimate/page";
import { Vehicle } from "../../server/estimate/handler_000";
import { Accessory } from "../../types/db/accessories";
import { fetchDocumentData, updateDocument, deleteDocument } from "../../services/document-edit/page";
import { useAuth } from "../../hooks/useAuth";

const DocumentEditContainer: React.FC = () => {
  const { id: documentId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // 状態管理（新規作成と同じ構造）
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | undefined>(undefined);
  const [errors, setErrors] = useState<EstimateError | null>(null);

  // フォームデータの初期状態（新規作成と同じ）
  const [formData, setFormData] = useState<EstimateFormData>({
    document_type: "estimate",
    tradeIn: {
      trade_in_available: true,
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
      payment_period: 2,
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
      consumption_tax: 0,
      total_price: 0,
      trade_in_price: 0,
      trade_in_debt: 0,
      payment_total: 0,
    },
    shippingInfo: {
      area_code: null,
      prefecture: "",
      city: "",
      shipping_cost: 0,
    },
  });

  // 既存データの取得
  useEffect(() => {
    const loadDocumentData = async () => {
      if (!documentId) {
        setError("ドキュメントIDが指定されていません");
        setLoading(false);
        return;
      }

      if (!user) {
        setError("ログインが必要です");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await fetchDocumentData(documentId);

        if (data.success && data.data) {
          setFormData(data.data.formData);
          setVehicle(data.data.vehicle);
        } else {
          setError(data.error || "データの取得に失敗しました");
        }
      } catch (err) {
        console.error("Document load error:", err);
        setError("データの読み込み中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    loadDocumentData();
  }, [documentId, user]);

  // フォームデータの各セクション変更を監視して販売価格の対応するフィールドを更新（新規作成と同じロジック）
  useEffect(() => {
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
          tax_insurance: totalTaxInsurance,
          legal_fee: totalLegalFee,
          processing_fee: totalProcessingFee,
          accessories_fee: totalAccessoriesFee,
        },
      }));
    }
  }, [
    formData.taxInsuranceFees,
    formData.legalFees,
    formData.processingFees,
    formData.accessories,
    formData.salesPrice.tax_insurance,
    formData.salesPrice.legal_fee,
    formData.salesPrice.processing_fee,
    formData.salesPrice.accessories_fee,
  ]);

  // 入力値変更ハンドラ（新規作成と同じ）
  const handleInputChange = useCallback(
    (
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
        const numValue = value === "" ? 0 : typeof value === "string" ? parseInt(value.replace(/[^0-9]/g, "") || "0", 10) : value;
        setFormData((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            [name]: numValue,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            [name]: value,
          },
        }));
      }

      // エラーをクリア
      if (errors) {
        setErrors((prevErrors) => {
          if (!prevErrors) return null;

          const newErrors = { ...prevErrors };
          if (section === "document_type") {
            delete newErrors.document_type;
          } else if (newErrors[section]) {
            if (typeof newErrors[section] === "object") {
              const sectionErrors = { ...newErrors[section] } as Record<string, string>;
              delete sectionErrors[name];
              if (Object.keys(sectionErrors).length === 0) {
                delete newErrors[section];
              } else {
                newErrors[section] = sectionErrors;
              }
            } else {
              delete newErrors[section];
            }
          }

          return Object.keys(newErrors).length === 0 ? null : newErrors;
        });
      }
    },
    [errors]
  );

  // 付属品変更ハンドラ（新規作成と同じ）
  const handleAccessoryChange = useCallback(
    (action: "add" | "remove", value: Accessory | number) => {
      if (action === "add" && typeof value !== "number") {
        setFormData((prev) => ({
          ...prev,
          accessories: [...prev.accessories, value as Accessory],
        }));
      } else if (action === "remove" && typeof value === "number") {
        setFormData((prev) => ({
          ...prev,
          accessories: prev.accessories.filter((_, index) => index !== value),
        }));
      }

      // 付属品関連のエラーをクリア
      if (errors?.accessories) {
        setErrors((prevErrors) => {
          if (!prevErrors) return null;
          const newErrors = { ...prevErrors };
          delete newErrors.accessories;
          return Object.keys(newErrors).length === 0 ? null : newErrors;
        });
      }
    },
    [errors]
  );

  // 配送情報変更ハンドラ（新規作成と同じ）
  const handleShippingChange = useCallback(
    (shippingInfo: ShippingInfo) => {
      setFormData((prev) => ({
        ...prev,
        shippingInfo,
      }));

      // 配送情報関連のエラーをクリア
      if (errors?.shippingInfo) {
        setErrors((prevErrors) => {
          if (!prevErrors) return null;
          const newErrors = { ...prevErrors };
          delete newErrors.shippingInfo;
          return Object.keys(newErrors).length === 0 ? null : newErrors;
        });
      }
    },
    [errors]
  );

  // フォーム送信ハンドラ（更新処理）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setErrors({ general: "ログインが必要です" });
      return;
    }

    if (!documentId) {
      setErrors({ general: "ドキュメントIDが不足しています" });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setErrors(null);
      setSuccess(null);

      const response = await updateDocument(documentId, {
        userId: user.id,
        ...formData,
      });

      if (response.success) {
        setSuccess("書類が正常に更新されました");

        // 3秒後に書類一覧ページに戻る
        setTimeout(() => {
          navigate("/documents");
        }, 3000);
      } else {
        if (response.errors) {
          setErrors(response.errors);
        } else {
          setError(response.error || "更新に失敗しました");
        }
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("更新中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // キャンセルハンドラ
  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // 削除ハンドラ
  const handleDelete = async () => {
    if (!user) {
      setErrors({ general: "ログインが必要です" });
      return;
    }

    if (!documentId) {
      setErrors({ general: "ドキュメントIDが不足しています" });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await deleteDocument(documentId);

      if (response.success) {
        setSuccess("書類が正常に削除されました");

        // 2秒後に書類一覧ページに戻る
        setTimeout(() => {
          navigate("/documents");
        }, 2000);
      } else {
        setError(response.error || "削除に失敗しました");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("削除中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // レンダリング
  return (
    <DocumentEditComponent
      loading={loading}
      error={error}
      vehicle={vehicle}
      formData={formData}
      errors={errors}
      success={success}
      documentId={documentId || ""}
      isEdit={true}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onAccessoryChange={handleAccessoryChange}
      onShippingChange={handleShippingChange}
      onDelete={handleDelete}
    />
  );
};

export default DocumentEditContainer;
