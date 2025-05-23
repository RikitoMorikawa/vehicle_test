// src/services/common/pdf/page.ts
import { pdfHandler } from "../../../server/common/pdf/handler_000";
import type { EstimatePDFData } from "../../../types/common/pdf/page";

export const pdfService = {
  // 見積書データを取得してプレビュー用に返す
  async previewEstimatePDF(estimateId: string): Promise<EstimatePDFData> {
    try {
      console.log("Fetching estimate data for preview:", estimateId);

      // サーバーから見積書データを取得
      const estimateData = await pdfHandler.fetchEstimateData(estimateId);

      console.log("Estimate data fetched successfully");
      return estimateData;
    } catch (error) {
      console.error("Error fetching estimate data:", error);
      throw error;
    }
  },

  // 見積書データを取得（汎用）
  async getEstimateData(estimateId: string): Promise<EstimatePDFData> {
    return this.previewEstimatePDF(estimateId);
  },

  // 印刷用（将来の拡張用）
  async printEstimate(estimateId: string): Promise<void> {
    try {
      // データを取得してブラウザの印刷機能を呼び出す
      await this.previewEstimatePDF(estimateId);
      window.print();
    } catch (error) {
      console.error("Error printing estimate:", error);
      throw error;
    }
  },
};
