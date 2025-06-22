// src/components/ui-parts/vehicle-detail/VehicleDocuments.tsx
import React, { useState, useEffect } from "react";
import Button from "../../ui/Button";
import { FileText, Calendar, Car, Building, Download } from "lucide-react";
import { reportsService } from "../../../services/reports/page";
import { pdfService } from "../../../services/common/pdf/page";
import { generateAndDownloadPDF } from "../../../utils/pdfDownload";
import type { EstimateReport } from "../../../types/report/page";

interface VehicleDocumentsProps {
  vehicleId: string;
  userId: string;
}

const VehicleDocuments: React.FC<VehicleDocumentsProps> = ({ vehicleId, userId }) => {
  const [estimates, setEstimates] = useState<EstimateReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // タブ状態管理
  const [activeTab, setActiveTab] = useState<"estimate" | "invoice" | "order">("estimate");

  // ダウンロード状態管理
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

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

  // タブに応じて書類をフィルタリング
  const filteredEstimates = estimates.filter((estimate) => {
    const documentType = estimate.document_type || "estimate";
    return documentType === activeTab;
  });

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

  // PDFダウンロードハンドラー
  const handleDownloadPDF = async (estimateId: string) => {
    try {
      // ダウンロード開始状態に設定
      setDownloadingIds((prev) => new Set(prev).add(estimateId));

      // PDFデータを取得
      const pdfData = await pdfService.previewEstimatePDF(estimateId);

      if (!pdfData) {
        throw new Error("PDFデータの取得に失敗しました");
      }

      // PDFを生成してダウンロード
      await generateAndDownloadPDF(pdfData);
    } catch (error) {
      console.error("PDFダウンロードエラー:", error);
      setError(error instanceof Error ? error.message : "PDFのダウンロードに失敗しました。もう一度お試しください。");
    } finally {
      // ダウンロード完了状態に設定
      setDownloadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(estimateId);
        return newSet;
      });
    }
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

            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{getTabLabel(activeTab)}一覧</h3>
                <div className="text-sm text-gray-600">
                  {filteredEstimates.length}件の{getTabLabel(activeTab)}
                </div>
              </div>
            </div>

            {/* タブコンテンツ */}
            {filteredEstimates.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>{getTabLabel(activeTab)}はありません</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredEstimates.map((estimate) => {
                  const isDownloading = downloadingIds.has(estimate.id);

                  return (
                    <div key={estimate.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <FileText className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">資料番号: {estimate.estimateNumber}</span>
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
                            onClick={() => handleDownloadPDF(estimate.id)}
                            disabled={isDownloading}
                            className="flex items-center text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                            {isDownloading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-1"></div>
                                生成中...
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 mr-1" />
                                ダウンロード
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDocuments;
