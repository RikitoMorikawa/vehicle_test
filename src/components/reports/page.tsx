// src/components/reports/page.tsx
import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Button from "../ui/Button";
import { FileText, Calendar, Car, Building, Eye } from "lucide-react";
import PDFPreviewModal from "../common/PDFPreviewModal";
import type { EstimateReport } from "../../types/report/page";
import type { EstimatePDFData } from "../../types/common/pdf/page";

interface ReportsPageProps {
  estimates: EstimateReport[];
  loading: boolean;
  error: string | null;
  onPreviewPDF: (estimateId: string) => void;
  // PDFプレビューモーダル用
  isPreviewOpen: boolean;
  previewLoading: boolean;
  previewUrl?: string | null;
  previewData?: EstimatePDFData | null;
  previewEstimateId: string | null;
  onClosePreview: () => void;
  onDownloadPDF?: (estimateId: string) => void;
}

const ReportsPage: React.FC<ReportsPageProps> = ({
  estimates,
  loading,
  error,
  onPreviewPDF,
  isPreviewOpen,
  previewLoading,
  previewUrl = null,
  previewData,
  previewEstimateId,
  onClosePreview,
  onDownloadPDF,
}) => {
  // タブ状態管理
  const [activeTab, setActiveTab] = useState<"estimate" | "invoice" | "order">("estimate");

  // タブに応じて見積書をフィルタリング
  const filteredEstimates = estimates.filter((estimate) => {
    const documentType = estimate.document_type || "estimate";
    return documentType === activeTab;
  });

  // 日付フォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // タブのラベル取得
  const getTabLabel = (tabType: "estimate" | "invoice" | "order") => {
    switch (tabType) {
      case "estimate":
        return "見積書";
      case "invoice":
        return "請求書";
      case "order":
        return "注文書";
      default:
        return "見積書";
    }
  };

  // 各タブの件数を計算
  const getCounts = () => {
    const estimateCount = estimates.filter((e) => (e.document_type || "estimate") === "estimate").length;
    const invoiceCount = estimates.filter((e) => e.document_type === "invoice").length;
    const orderCount = estimates.filter((e) => e.document_type === "order").length;

    return { estimateCount, invoiceCount, orderCount };
  };

  const { estimateCount, invoiceCount, orderCount } = getCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 p-8 overflow-auto">
            <div className="max-w-full mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">帳票管理</h1>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-full mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">帳票管理</h1>
              <div className="text-sm text-gray-600">
                全体: {estimates.length}件 | {getTabLabel(activeTab)}: {filteredEstimates.length}件
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* タブナビゲーション */}
              <div className="border-b border-gray-200">
                <nav className="flex" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("estimate")}
                    className={`px-6 py-4 text-center text-sm font-medium ${
                      activeTab === "estimate" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    見積書 ({estimateCount})
                  </button>
                  <button
                    onClick={() => setActiveTab("invoice")}
                    className={`px-6 py-4 text-center text-sm font-medium ${
                      activeTab === "invoice" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    請求書 ({invoiceCount})
                  </button>
                  <button
                    onClick={() => setActiveTab("order")}
                    className={`px-6 py-4 text-center text-sm font-medium ${
                      activeTab === "order" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    注文書 ({orderCount})
                  </button>
                </nav>
              </div>

              {/* タブコンテンツ */}
              {filteredEstimates.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>{getTabLabel(activeTab)}データはありません</p>
                    <p className="text-sm mt-2">新しい{getTabLabel(activeTab)}を作成してください</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">書類番号</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">車両情報</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">加盟店</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">顧客名</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">支払総額</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEstimates.map((estimate) => {
                        return (
                          <tr key={estimate.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-900">{estimate.estimateNumber}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Car className="w-4 h-4 text-gray-400 mr-2" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {estimate.vehicleInfo.maker} {estimate.vehicleInfo.name}
                                  </div>
                                  <div className="text-sm text-gray-500">{estimate.vehicleInfo.year}年</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Building className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900">{estimate.companyName || "-"}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{estimate.customerName || "-"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-semibold text-gray-900">¥{estimate.totalAmount.toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900">{formatDate(estimate.createdAt)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPreviewPDF(estimate.id)}
                                className="flex items-center text-blue-600 border-blue-300 hover:bg-blue-50"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                プレビュー
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />

      {/* PDFプレビューモーダル */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pb-8">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[85vh] flex flex-col mb-4">
            <PDFPreviewModal
              isOpen={isPreviewOpen}
              onClose={onClosePreview}
              pdfUrl={previewUrl}
              estimateId={previewEstimateId}
              loading={previewLoading}
              onDownload={onDownloadPDF}
              estimateData={previewData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
