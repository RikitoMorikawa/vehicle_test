// src/services/reports/page.ts
import { reportsHandler } from "../../server/reports/handler_000";
import type { EstimateReport } from "../../types/report/page";

export const reportsService = {
  // 見積書一覧を取得
  async getEstimatesList(): Promise<EstimateReport[]> {
    try {
      const estimates = await reportsHandler.fetchEstimatesList();
      return estimates;
    } catch (error) {
      console.error("Error fetching estimates list:", error);
      throw error;
    }
  },

  // 特定ユーザー・特定車両の見積書一覧を取得
  async getEstimatesForVehicleAndUser(vehicleId: string, userId: string): Promise<EstimateReport[]> {
    try {
      const estimates = await reportsHandler.searchEstimates({
        vehicleId,
        userId,
      });
      return estimates;
    } catch (error) {
      console.error("Error fetching estimates for vehicle and user:", error);
      throw error;
    }
  },

  // 特定ユーザーの見積書一覧を取得
  async getEstimatesForUser(userId: string): Promise<EstimateReport[]> {
    try {
      const estimates = await reportsHandler.searchEstimates({
        userId,
      });
      return estimates;
    } catch (error) {
      console.error("Error fetching estimates for user:", error);
      throw error;
    }
  },

  // 特定の見積書を取得
  async getEstimateById(id: string): Promise<EstimateReport> {
    try {
      const estimate = await reportsHandler.fetchEstimateById(id);
      return estimate;
    } catch (error) {
      console.error("Error fetching estimate:", error);
      throw error;
    }
  },

  // PDF生成・ダウンロード（未実装）
  async downloadEstimatePDF(estimateId: string): Promise<Blob> {
    try {
      // TODO: PDF生成機能を実装
      const pdfBlob = await reportsHandler.generateEstimatePDF(estimateId);
      return pdfBlob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  },

  // 見積書の検索・フィルタリング
  async searchEstimates(params: {
    companyId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    searchText?: string;
    userId?: string; // ★追加
    vehicleId?: string; // ★追加
  }): Promise<EstimateReport[]> {
    try {
      const estimates = await reportsHandler.searchEstimates(params);
      return estimates;
    } catch (error) {
      console.error("Error searching estimates:", error);
      throw error;
    }
  },
};
