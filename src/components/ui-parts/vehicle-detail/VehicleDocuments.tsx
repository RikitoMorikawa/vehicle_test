// src/components/ui-parts/vehicle-detail/VehicleDocuments.tsx
import React, { useState, useEffect } from "react";
import Button from "../../ui/Button";
import { FileText, Calendar, Car, Building, Eye } from "lucide-react";
import PDFPreviewModal from "../../common/PDFPreviewModal";
import { reportsService } from "../../../services/reports/page";
import { pdfService } from "../../../services/common/pdf/page";
import type { EstimateReport } from "../../../types/report/page";
import type { EstimatePDFData } from "../../../types/common/pdf/page";

interface VehicleDocumentsProps {
  vehicleId: string;
  userId: string;
}

const VehicleDocuments: React.FC<VehicleDocumentsProps> = ({ vehicleId, userId }) => {
  const [estimates, setEstimates] = useState<EstimateReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PDFプレビュー用の状態
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState<EstimatePDFData | null>(null);
  const [previewEstimateId, setPreviewEstimateId] = useState<string | null>(null);

  // 見積書一覧を取得（この車両かつログインユーザーが作成したもののみ）
  useEffect(() => {
    const fetchVehicleEstimates = async () => {
      try {
        setLoading(true);
        setError(null);

        // 専用のサービスメソッドを使用してフィルタリング済みの見積書を取得
        const filteredEstimates = await reportsService.getEstimatesForVehicleAndUser(vehicleId, userId);
        setEstimates(filteredEstimates);
      } catch (err) {
        console.error("Failed to fetch vehicle estimates:", err);
        setError("見積書の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId && userId) {
      fetchVehicleEstimates();
    }
  }, [vehicleId, userId]);

  // PDFプレビューハンドラー
  const handlePreviewPDF = async (estimateId: string) => {
    try {
      setError(null);
      setPreviewLoading(true);
      setPreviewEstimateId(estimateId);
      setIsPreviewOpen(true);
      setPreviewData(null);

      // 見積書データを取得
      const estimateData = await pdfService.previewEstimatePDF(estimateId);
      setPreviewData(estimateData);
    } catch (err) {
      console.error("Failed to generate PDF preview:", err);
      setError("PDFプレビューの生成に失敗しました");
      setIsPreviewOpen(false);
    } finally {
      setPreviewLoading(false);
    }
  };

  // プレビューモーダルを閉じる
  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewEstimateId(null);
    setPreviewData(null);
  };

  // ダウンロードハンドラー
  const handleDownloadPDF = (estimateId: string) => {
    console.log("Download requested for estimate:", estimateId);
  };

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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">各種資料</h2>
        <p className="text-sm text-gray-600">この車両に関連する見積書やその他の資料を確認できます。</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {estimates.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>この車両の資料はまだありません</p>
              <p className="text-sm mt-2">見積書を作成すると、ここに表示されます</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">見積書一覧</h3>
                <div className="text-sm text-gray-600">{estimates.length}件の資料</div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {estimates.map((estimate) => (
                <div key={estimate.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">見積書番号: {estimate.estimateNumber}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Car className="w-4 h-4 text-gray-400 mr-2" />
                          <span>
                            {estimate.vehicleInfo.maker} {estimate.vehicleInfo.name} ({estimate.vehicleInfo.year}年)
                          </span>
                        </div>

                        {estimate.companyName && (
                          <div className="flex items-center">
                            <Building className="w-4 h-4 text-gray-400 mr-2" />
                            <span>{estimate.companyName}</span>
                          </div>
                        )}

                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{formatDate(estimate.createdAt)}</span>
                        </div>
                      </div>

                      <div className="mt-2">
                        <span className="text-lg font-semibold text-red-600">¥{estimate.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewPDF(estimate.id)}
                        className="flex items-center text-blue-600 border-blue-300 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        プレビュー
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PDFプレビューモーダル */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pb-8">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[85vh] flex flex-col mb-4">
            <PDFPreviewModal
              isOpen={isPreviewOpen}
              onClose={handleClosePreview}
              pdfUrl={null}
              estimateId={previewEstimateId}
              loading={previewLoading}
              onDownload={handleDownloadPDF}
              estimateData={previewData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDocuments;
