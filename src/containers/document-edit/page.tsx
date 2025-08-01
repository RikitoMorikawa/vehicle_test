// src/containers/document-edit/page.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DocumentEditComponent from "../../components/document-edit/page";
import { documentEditService } from "../../services/document-edit/page";
import { documentEditHandler } from "../../server/document-edit/handler_000";
import { validateEstimate, getValidationErrors, type EstimateError, type EstimateFormData, type ShippingInfo } from "../../validations/document-edit/page";
import type { Vehicle } from "../../server/estimate/handler_000";
import type { Accessory } from "../../types/db/accessories";

interface LocationState {
  returnPath?: string;
}

const DocumentEditContainer: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState;
  const { returnPath } = state || {};

  const [vehicle, setVehicle] = useState<Vehicle | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<EstimateError | null>(null);

  const [formData, setFormData] = useState<EstimateFormData>({
    document_type: "estimate",
    tradeIn: {
      trade_in_available: false,
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
      payment_count: 0,
      payment_period: 0,
      interest_fee: 0,
      total_payment: 0,
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
      shipping_cost: 0,
      prefecture: "",
      city: "",
    },
  });

  // 書類データの取得
  useEffect(() => {
    const fetchDocument = async () => {
      if (!documentId) {
        setError("書類IDが見つかりません");
        navigate(-1);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const documentData = await documentEditService.getDocument(documentId);

        // 車両情報を設定
        if (documentData.vehicle_id) {
          const vehicleData = await documentEditHandler.fetchVehicleById(documentData.vehicle_id);
          setVehicle(vehicleData);

          // 基本価格を車両価格で初期化
          setFormData((prev) => ({
            ...prev,
            salesPrice: {
              ...prev.salesPrice,
              base_price: vehicleData.price,
            },
          }));
        }

        // フォームデータに変換して設定
        const convertedFormData = await documentEditHandler.convertToFormData(documentData);
        setFormData((prev) => ({
          ...prev,
          ...convertedFormData,
        }));
      } catch (err) {
        console.error("書類取得エラー:", err);
        const errorMessage = err instanceof Error ? err.message : "書類の取得に失敗しました";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId, navigate]);

  // 入力変更ハンドラー
  const handleInputChange = (
    section: "tradeIn" | "loanCalculation" | "taxInsuranceFees" | "legalFees" | "processingFees" | "salesPrice" | "document_type",
    name: string,
    value: string | number | boolean | number[]
  ) => {
    if (section === "document_type") {
      setFormData((prev) => ({
        ...prev,
        document_type: value as "estimate" | "invoice" | "order",
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

    // エラークリア
    if (errors) {
      setErrors((prev) => {
        if (!prev) return null;
        const newErrors = { ...prev };
        if (section === "document_type" && newErrors.document_type) {
          delete newErrors.document_type;
        } else if (section !== "document_type" && newErrors[section]) {
          if (typeof newErrors[section] === "object") {
            const sectionErrors = { ...newErrors[section] };
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

    // 成功メッセージクリア
    if (success) {
      setSuccess(null);
    }
  };

  // 付属品変更ハンドラー
  const handleAccessoryChange = (action: "add" | "remove", value: Accessory | number) => {
    if (action === "add" && typeof value === "object") {
      setFormData((prev) => ({
        ...prev,
        accessories: [...(prev.accessories || []), value],
      }));
    } else if (action === "remove" && typeof value === "number") {
      setFormData((prev) => ({
        ...prev,
        accessories: (prev.accessories || []).filter((_, index) => index !== value),
      }));
    }
  };

  // 配送情報変更ハンドラー
  const handleShippingChange = (shippingInfo: ShippingInfo) => {
    setFormData((prev) => ({
      ...prev,
      shippingInfo,
    }));
  };

  // フォーム送信ハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentId) return;

    // バリデーション
    const validation = validateEstimate(formData);
    if (!validation.success) {
      const structuredErrors = getValidationErrors(validation);
      setErrors(structuredErrors);
      setError("入力内容に誤りがあります。");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      setErrors(null);

      // 更新実行
      await documentEditHandler.updateDocument(documentId, formData);

      setSuccess("書類を更新しました");

      // 少し待ってから遷移
      setTimeout(() => {
        if (returnPath) {
          navigate(returnPath);
        } else {
          navigate("/reports");
        }
      }, 1500);
    } catch (err) {
      console.error("書類更新エラー:", err);
      const errorMessage = err instanceof Error ? err.message : "書類の更新に失敗しました";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // キャンセルハンドラー
  const handleCancel = () => {
    if (returnPath) {
      navigate(returnPath);
    } else {
      navigate("/reports");
    }
  };

  // ローディング状態
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mr-3"></div>
              <span className="text-gray-600">書類を読み込み中...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // エラー状態
  if (error && !vehicle && !formData.document_type) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
              <p className="text-gray-600 mb-4">指定された書類を読み込むことができませんでした。</p>
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DocumentEditComponent
      loading={isLoading}
      error={error}
      vehicle={vehicle}
      formData={formData}
      errors={errors}
      success={success}
      documentId={documentId || ""}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onAccessoryChange={handleAccessoryChange}
      onShippingChange={handleShippingChange}
    />
  );
};

export default DocumentEditContainer;