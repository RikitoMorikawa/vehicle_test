// src/components/reports/page.tsx
import React from "react";
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
  previewData?: EstimatePDFData | null; // この行を追加
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
  previewData, // この行を追加（destructuring）
  previewEstimateId,
  onClosePreview,
  onDownloadPDF,
}) => {
  // 日付フォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

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
              <div className="text-sm text-gray-600">見積書: {estimates.length}件</div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
              {estimates.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>見積書データはありません</p>
                    <p className="text-sm mt-2">新しい見積書を作成してください</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">見積書番号</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">車両情報</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">加盟店</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">顧客名</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">支払総額</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {estimates.map((estimate) => {
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
                                  <div className="text-sm text-gray-500">{estimate.vehicleInfo.year}年式</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Building className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900">{estimate.companyName || "未設定"}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900">{estimate.customerName || "未設定"}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900">¥{estimate.totalAmount.toLocaleString()}</span>
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
      <PDFPreviewModal
        isOpen={isPreviewOpen}
        onClose={onClosePreview}
        pdfUrl={previewUrl}
        estimateId={previewEstimateId}
        loading={previewLoading}
        onDownload={onDownloadPDF}
        estimateData={previewData} // currentEstimateData → previewData に変更
      />
    </div>
  );
};

export default ReportsPage;
