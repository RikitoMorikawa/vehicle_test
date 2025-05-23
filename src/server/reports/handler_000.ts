// src/server/reports/handler_000.ts
import { supabase } from "../../lib/supabase";
import type { EstimateReport, EstimateVehicleRawData, EstimateSearchParams } from "../../types/report/page";

export const reportsHandler = {
  // 見積書一覧を取得
  async fetchEstimatesList(): Promise<EstimateReport[]> {
    try {
      console.log("Fetching estimates list...");

      const { data, error } = await supabase
        .from("estimate_vehicles")
        .select(
          `
          id,
          maker,
          name,
          year,
          created_at,
          company_id,
          sales_prices(
            payment_total
          ),
          companies(
            name
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching estimates:", error);
        throw error;
      }

      // 型安全なデータ変換
      const estimates: EstimateReport[] =
        (data as EstimateVehicleRawData[])?.map((item, index) => ({
          id: item.id,
          estimateNumber: `EST-${String(index + 1).padStart(4, "0")}`,
          vehicleInfo: {
            maker: item.maker,
            name: item.name,
            year: item.year,
          },
          customerName: undefined,
          companyName: item.companies?.[0]?.name || "未設定",
          totalAmount: item.sales_prices?.[0]?.payment_total || 0,
          createdAt: item.created_at,
          status: "completed" as const,
        })) || [];

      console.log(`Fetched ${estimates.length} estimates`);
      return estimates;
    } catch (error) {
      console.error("Failed to fetch estimates list:", error);
      throw error;
    }
  },

  // 特定の見積書を取得
  async fetchEstimateById(id: string): Promise<EstimateReport> {
    try {
      console.log("Fetching estimate with ID:", id);

      const { data, error } = await supabase
        .from("estimate_vehicles")
        .select(
          `
          id,
          maker,
          name,
          year,
          created_at,
          company_id,
          sales_prices(
            payment_total
          ),
          companies(
            name
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching estimate:", error);
        throw error;
      }

      // 型安全なデータ変換
      const rawData = data as EstimateVehicleRawData;
      const estimate: EstimateReport = {
        id: rawData.id,
        estimateNumber: `EST-${rawData.id.slice(-4).toUpperCase()}`,
        vehicleInfo: {
          maker: rawData.maker,
          name: rawData.name,
          year: rawData.year,
        },
        customerName: undefined,
        companyName: rawData.companies?.[0]?.name || "未設定",
        totalAmount: rawData.sales_prices?.[0]?.payment_total || 0,
        createdAt: rawData.created_at,
        status: "completed",
      };

      return estimate;
    } catch (error) {
      console.error("Failed to fetch estimate:", error);
      throw error;
    }
  },

  // 見積書の検索・フィルタリング
  async searchEstimates(params: EstimateSearchParams): Promise<EstimateReport[]> {
    try {
      console.log("Searching estimates with params:", params);

      let query = supabase.from("estimate_vehicles").select(`
          id,
          maker,
          name,
          year,
          created_at,
          company_id,
          sales_prices(
            payment_total
          ),
          companies(
            name
          )
        `);

      // 加盟店フィルター
      if (params.companyId) {
        query = query.eq("company_id", params.companyId);
      }

      // 日付範囲フィルター
      if (params.dateFrom) {
        query = query.gte("created_at", params.dateFrom);
      }
      if (params.dateTo) {
        query = query.lte("created_at", params.dateTo);
      }

      // テキスト検索（車名またはメーカー）
      if (params.searchText) {
        query = query.or(`maker.ilike.%${params.searchText}%,name.ilike.%${params.searchText}%`);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Error searching estimates:", error);
        throw error;
      }

      // 型安全なデータ変換
      const estimates: EstimateReport[] =
        (data as EstimateVehicleRawData[])?.map((item, index) => ({
          id: item.id,
          estimateNumber: `EST-${String(index + 1).padStart(4, "0")}`,
          vehicleInfo: {
            maker: item.maker,
            name: item.name,
            year: item.year,
          },
          customerName: undefined,
          companyName: item.companies?.[0]?.name || "未設定",
          totalAmount: item.sales_prices?.[0]?.payment_total || 0,
          createdAt: item.created_at,
          status: "completed",
        })) || [];

      return estimates;
    } catch (error) {
      console.error("Failed to search estimates:", error);
      throw error;
    }
  },

  // PDF生成（未実装）
  async generateEstimatePDF(estimateId: string): Promise<Blob> {
    try {
      console.log("Generating PDF for estimate:", estimateId);

      // TODO: PDF生成ライブラリ（jsPDF、react-pdf等）を使用してPDF生成
      throw new Error("PDF generation not implemented yet");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      throw error;
    }
  },
};
