// src/containers/reports/page.tsx
import React, { useState, useEffect, useMemo } from "react";
import ReportsPage from "../../components/reports/page";
import PDFPreviewModal from "../../components/common/PDFPreviewModal";
import { reportsService } from "../../services/reports/page";
import { pdfService } from "../../services/common/pdf/page";
import type { EstimateReport } from "../../types/report/page";
import type { EstimatePDFData } from "../../types/common/pdf/page";

const ReportsContainer: React.FC = () => {
  const [estimates, setEstimates] = useState<EstimateReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // タブ状態管理
  const [activeTab, setActiveTab] = useState<"estimate" | "invoice" | "order">("estimate");

  // ページネーション状態管理を追加
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // PDFプレビューモーダル状態
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfData, setPdfData] = useState<EstimatePDFData | null>(null);
  const [loadingPdfId, setLoadingPdfId] = useState<string | null>(null);

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

  // ページネーション処理
  const paginatedEstimates = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEstimates.slice(startIndex, endIndex);
  }, [filteredEstimates, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredEstimates.length / itemsPerPage);

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

  // PDFプレビュー表示ハンドラー
  const handlePreviewPDF = async (estimateId: string) => {
    try {
      setLoadingPdfId(estimateId);
      setError(null);

      // PDFデータを取得
      const data = await pdfService.previewEstimatePDF(estimateId);
      setPdfData(data);
      setShowPDFModal(true);
    } catch (error) {
      console.error("PDFプレビューエラー:", error);
      setError(error instanceof Error ? error.message : "PDFプレビューの表示に失敗しました");
    } finally {
      setLoadingPdfId(null);
    }
  };

  // PDFモーダルを閉じる
  const handleClosePDFModal = () => {
    setShowPDFModal(false);
    setPdfData(null);
  };

  // ページ変更ハンドラー
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // タブ変更ハンドラー（ページをリセット）
  const handleTabChange = (tab: "estimate" | "invoice" | "order") => {
    setCurrentPage(1); // タブ変更時にページをリセット
    setActiveTab(tab);
  };

  return (
    <>
      <ReportsPage
        estimates={estimates}
        loading={loading}
        error={error}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        filteredEstimates={filteredEstimates}
        downloadingIds={new Set([loadingPdfId].filter(Boolean) as string[])}
        formatDate={formatDate}
        getTabLabel={getTabLabel}
        estimateCount={estimateCount}
        invoiceCount={invoiceCount}
        orderCount={orderCount}
        onDownloadPDF={handlePreviewPDF}
        // ページネーション関連のpropsを追加
        currentPage={currentPage}
        totalPages={totalPages}
        paginatedEstimates={paginatedEstimates}
        onPageChange={handlePageChange}
      />

      {/* PDFプレビューモーダル */}
      {pdfData && <PDFPreviewModal isOpen={showPDFModal} onClose={handleClosePDFModal} data={pdfData} />}
    </>
  );
};

export default ReportsContainer;
