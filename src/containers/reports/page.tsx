// src/containers/reports/page.tsx
import React, { useState, useEffect } from "react";
import ReportsPage from "../../components/reports/page";
import { reportsService } from "../../services/reports/page";
import { pdfService } from "../../services/common/pdf/page";
import { generateAndDownloadPDF } from "../../utils/pdfDownload";
import type { EstimateReport } from "../../types/report/page";
import type { EstimatePDFData } from "../../types/common/pdf/page";

const ReportsContainer: React.FC = () => {
  const [estimates, setEstimates] = useState<EstimateReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // タブ状態管理
  const [activeTab, setActiveTab] = useState<"estimate" | "invoice" | "order">("estimate");

  // ダウンロード状態管理
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

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

  return (
    <ReportsPage
      estimates={estimates}
      loading={loading}
      error={error}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      filteredEstimates={filteredEstimates}
      downloadingIds={downloadingIds}
      formatDate={formatDate}
      getTabLabel={getTabLabel}
      estimateCount={estimateCount}
      invoiceCount={invoiceCount}
      orderCount={orderCount}
      onDownloadPDF={handleDownloadPDF}
    />
  );
};

export default ReportsContainer;
