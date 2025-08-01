import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { FileText, Car, Calendar, Building } from "lucide-react";
import type { DocumentEditFormData, DocumentType } from "../../validations/document-edit/page";
import type { EstimateReport } from "../../types/report/page";

interface DocumentEditPageProps {
  document: EstimateReport;
  documentType: DocumentType;
  formData: DocumentEditFormData;
  errors: Record<string, string>;
  isLoading: boolean;
  success: string | null;
  error: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const DocumentEditPage: React.FC<DocumentEditPageProps> = ({
  document,
  documentType,
  formData,
  errors,
  isLoading,
  success,
  error,
  onInputChange,
  onSubmit,
  onCancel,
}) => {
  const getDocumentTypeLabel = () => {
    switch (documentType) {
      case "estimate": return "見積書";
      case "invoice": return "請求書";
      case "order": return "注文書";
      default: return "書類";
    }
  };

  const getDocumentTypeColor = () => {
    switch (documentType) {
      case "estimate": return "bg-blue-100 text-blue-800";
      case "invoice": return "bg-green-100 text-green-800";
      case "order": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow rounded-lg">
              {/* ヘッダー */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-6 h-6 text-gray-400 mr-3" />
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900">
                        {getDocumentTypeLabel()}の編集
                      </h1>
                      <div className="flex items-center mt-1 space-x-4">
                        <p className="text-sm text-gray-600">
                          資料番号: {document.estimateNumber}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDocumentTypeColor()}`}>
                          {getDocumentTypeLabel()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 車両情報表示 */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Car className="w-4 h-4 mr-2" />
                    <span>
                      {document.vehicleInfo.maker} {document.vehicleInfo.name} ({document.vehicleInfo.year}年)
                    </span>
                  </div>
                  {document.companyName && (
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      <span>{document.companyName}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      作成日: {new Date(document.createdAt).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                </div>
              </div>

              {/* エラー・成功メッセージ */}
              {error && (
                <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="px-6 py-4 bg-green-50 border-b border-green-200">
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              {/* フォーム */}
              <form onSubmit={onSubmit} className="p-6 space-y-8">
                {/* 基本情報 */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    基本情報
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="資料番号"
                      name="estimateNumber"
                      value={formData.estimateNumber}
                      onChange={onInputChange}
                      error={errors.estimateNumber}
                      disabled={isLoading}
                      required
                    />
                    
                    <Input
                      label="会社名"
                      name="companyName"
                      value={formData.companyName || ""}
                      onChange={onInputChange}
                      error={errors.companyName}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* 顧客情報 */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    顧客情報
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="顧客名"
                      name="customerName"
                      value={formData.customerName || ""}
                      onChange={onInputChange}
                      error={errors.customerName}
                      disabled={isLoading}
                    />
                    
                    <Input
                      label="メールアドレス"
                      name="customerEmail"
                      type="email"
                      value={formData.customerEmail || ""}
                      onChange={onInputChange}
                      error={errors.customerEmail}
                      disabled={isLoading}
                    />
                    
                    <Input
                      label="電話番号"
                      name="customerPhone"
                      type="tel"
                      value={formData.customerPhone || ""}
                      onChange={onInputChange}
                      error={errors.customerPhone}
                      disabled={isLoading}
                    />
                    
                    <Input
                      label="税率（%）"
                      name="taxRate"
                      type="number"
                      value={formData.taxRate.toString()}
                      onChange={onInputChange}
                      error={errors.taxRate}
                      disabled={isLoading}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                {/* 日付情報 */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    日付情報
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="納期"
                      name="deliveryDate"
                      type="date"
                      value={formData.deliveryDate || ""}
                      onChange={onInputChange}
                      error={errors.deliveryDate}
                      disabled={isLoading}
                    />
                    
                    <Input
                      label="有効期限"
                      name="validUntil"
                      type="date"
                      value={formData.validUntil || ""}
                      onChange={onInputChange}
                      error={errors.validUntil}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* 備考 */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    備考
                  </h2>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      備考
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes || ""}
                      onChange={onInputChange}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      placeholder="備考事項があれば入力してください"
                      disabled={isLoading}
                    />
                    {errors.notes && (
                      <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                    )}
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                  >
                    キャンセル
                  </Button>
                  
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    保存
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DocumentEditPage;
