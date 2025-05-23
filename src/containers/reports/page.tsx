// src/containers/reports/page.tsx
import React, { useState, useEffect } from "react";
import ReportsPage from "../../components/reports/page";
import { reportsService } from "../../services/reports/page";
import { pdfService } from "../../services/common/pdf/page";
import type { EstimateReport } from "../../types/report/page";
import type { EstimatePDFData } from "../../types/common/pdf/page";

const ReportsContainer: React.FC = () => {
  const [estimates, setEstimates] = useState<EstimateReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PDFプレビュー用の状態
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState<EstimatePDFData | null>(null);
  const [previewEstimateId, setPreviewEstimateId] = useState<string | null>(null);

  // 見積書一覧を取得
  useEffect(() => {
    const fetchEstimates = async () => {
      try {
        setLoading(true);
        setError(null);

        // サービスから見積書一覧を取得
        const data = await reportsService.getEstimatesList();
        setEstimates(data);
      } catch (err) {
        console.error("Failed to fetch estimates:", err);
        setError("見積書の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchEstimates();
  }, []);

  // PDFプレビューハンドラー
  const handlePreviewPDF = async (estimateId: string) => {
    try {
      console.log("PDF preview requested for estimate:", estimateId);
      setError(null);
      setPreviewLoading(true);
      setPreviewEstimateId(estimateId);
      setIsPreviewOpen(true);

      // 既存のプレビューデータをクリア
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
    // PDFPreviewModalコンポーネント内でダウンロード処理を行う
    console.log("Download requested for estimate:", estimateId);
  };

  return (
    <ReportsPage
      estimates={estimates}
      loading={loading}
      error={error}
      onPreviewPDF={handlePreviewPDF}
      isPreviewOpen={isPreviewOpen}
      previewLoading={previewLoading}
      previewData={previewData}
      previewEstimateId={previewEstimateId}
      onClosePreview={handleClosePreview}
      onDownloadPDF={handleDownloadPDF}
    />
  );
};

export default ReportsContainer;
