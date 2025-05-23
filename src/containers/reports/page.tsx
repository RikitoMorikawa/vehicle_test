// src/containers/reports/page.tsx
import React, { useState, useEffect } from "react";
import ReportsPage from "../../components/reports/page";
import { reportsService } from "../../services/reports/page";

// 見積書データの型定義（コンポーネントと同じ）
interface EstimateReport {
  id: string;
  estimateNumber: string;
  vehicleInfo: {
    maker: string;
    name: string;
    year: number;
  };
  customerName?: string;
  companyName?: string;
  totalAmount: number;
  createdAt: string;
  status: "draft" | "completed" | "sent";
}

const ReportsContainer: React.FC = () => {
  const [estimates, setEstimates] = useState<EstimateReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // PDFダウンロードハンドラー（未実装）
  const handleDownloadPDF = async (estimateId: string) => {
    try {
      console.log("PDF download requested for estimate:", estimateId);
      // TODO: PDF生成・ダウンロード機能を実装
      // await reportsService.downloadEstimatePDF(estimateId);
      alert(`見積書ID: ${estimateId} のPDFダウンロード機能は準備中です`);
    } catch (err) {
      console.error("Failed to download PDF:", err);
      setError("PDFのダウンロードに失敗しました");
    }
  };

  return <ReportsPage estimates={estimates} loading={loading} error={error} onDownloadPDF={handleDownloadPDF} />;
};

export default ReportsContainer;
