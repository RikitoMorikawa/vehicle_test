import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DocumentEditPage from "../../components/document-edit/page";
import { documentEditService } from "../../services/document-edit/page";
import { documentEditHandler } from "../../server/document-edit/handler_000";
import { validateDocumentEdit, type DocumentEditFormData, type DocumentType } from "../../validations/document-edit/page";
import type { EstimateReport } from "../../types/report/page";

interface LocationState {
  documentType?: DocumentType;
  vehicleId?: string;
  returnPath?: string;
}

const DocumentEditContainer: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const state = location.state as LocationState;
  const { documentType = "estimate", returnPath } = state || {};
  
  const [document, setDocument] = useState<EstimateReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<DocumentEditFormData>({
    estimateNumber: "",
    companyName: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryDate: "",
    validUntil: "",
    notes: "",
    items: [],
    taxRate: 10,
    documentType: "estimate"
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
        
        const data = await documentEditService.getDocument(documentId);
        setDocument(data);
        
        // フォームデータを設定
        setFormData({
          estimateNumber: data.estimateNumber,
          companyName: data.companyName || "",
          customerName: data.customerName || "",
          customerEmail: data.customerEmail || "",
          customerPhone: data.customerPhone || "",
          deliveryDate: data.deliveryDate || "",
          validUntil: data.validUntil || "",
          notes: data.notes || "",
          taxRate: data.taxRate || 10,
          documentType: documentType
        });
      } catch (err) {
        console.error("書類取得エラー:", err);
        const errorMessage = err instanceof Error ? err.message : "書類の取得に失敗しました";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId, navigate, documentType]);

  // 入力変更ハンドラー
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === "taxRate" ? parseFloat(value) || 0 : value
    }));
    
    // エラークリア
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // 成功メッセージクリア
    if (success) {
      setSuccess(null);
    }
  };

  // フォーム送信ハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentId) return;

    // バリデーション
    const validation = validateDocumentEdit(formData);
    if (!validation.success) {
      setErrors(validation.errors);
      setError("入力内容に誤りがあります。");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      setErrors({});
      
      // フォームデータの前処理
      const processedData = documentEditHandler.preprocessFormData(formData);
      
      // 更新実行
      const updatedDocument = await documentEditHandler.updateDocument(documentId, processedData);
      
      setSuccess("書類を更新しました");
      setDocument(updatedDocument);
      
      // 少し待ってから遷移
      setTimeout(() => {
        if (returnPath) {
          navigate(returnPath);
        } else {
          navigate(-1);
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
      navigate(-1);
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
  if (error && !document) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {error}
              </h3>
              <p className="text-gray-600 mb-4">
                指定された書類を読み込むことができませんでした。
              </p>
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

  if (!document) return null;

  return (
    <DocumentEditPage
      document={document}
      documentType={documentType}
      formData={formData}
      errors={errors}
      isLoading={isLoading}
      success={success}
      error={error}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default DocumentEditContainer;
