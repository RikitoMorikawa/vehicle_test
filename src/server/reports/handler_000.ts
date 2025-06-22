// src/server/reports/handler_000.ts
import { supabase } from "../../lib/supabase";
import type { EstimateReport } from "../../types/report/page";

export const reportsHandler = {
  // 見積書一覧を取得（user_idとvehicle_idを含む）
  async fetchEstimatesList(): Promise<EstimateReport[]> {
    try {
      const { data, error } = await supabase
        .from("estimate_vehicles")
        .select(
          `
          id,
          user_id,
          vehicle_id,
          maker,
          name,
          year,
          document_type,
          created_at,
          company_id,
          sales_prices!inner(payment_total),
          users:user_id(company_name)
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Database query error:", error);
        throw new Error(`見積書の取得に失敗しました: ${error.message}`);
      }

      if (!data) {
        return [];
      }

      // データを EstimateReport 形式に変換
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const estimates: EstimateReport[] = data.map((item: any) => {
        const totalAmount = item.sales_prices?.[0]?.payment_total || 0;
        const companyName = item.users?.company_name || "";

        return {
          id: item.id,
          estimateNumber: `EST-${item.id.slice(0, 8).toUpperCase()}`,
          user_id: item.user_id,
          vehicle_id: item.vehicle_id,
          vehicleInfo: {
            maker: item.maker,
            name: item.name,
            year: item.year,
          },
          document_type: item.document_type,
          companyName,
          totalAmount,
          createdAt: item.created_at,
          status: "completed" as const,
        };
      });

      return estimates;
    } catch (error) {
      console.error("Error in fetchEstimatesList:", error);
      throw error;
    }
  },

  // 特定の見積書を取得
  async fetchEstimateById(id: string): Promise<EstimateReport> {
    try {
      const { data, error } = await supabase
        .from("estimate_vehicles")
        .select(
          `
          id,
          user_id,
          vehicle_id,
          maker,
          name,
          year,
          document_type,
          created_at,
          company_id,
          sales_prices!inner(payment_total),
          users:user_id(company_name)
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Database query error:", error);
        throw new Error(`見積書の取得に失敗しました: ${error.message}`);
      }

      if (!data) {
        throw new Error("見積書が見つかりません");
      }

      const totalAmount = data.sales_prices?.[0]?.payment_total || 0;
      const companyName = data.users?.[0]?.company_name || "";

      return {
        id: data.id,
        estimateNumber: `EST-${data.id.slice(0, 8).toUpperCase()}`,
        user_id: data.user_id,
        vehicle_id: data.vehicle_id,
        vehicleInfo: {
          maker: data.maker,
          name: data.name,
          year: data.year,
        },
        document_type: data.document_type,
        companyName,
        totalAmount,
        createdAt: data.created_at,
        status: "completed" as const,
      };
    } catch (error) {
      console.error("Error in fetchEstimateById:", error);
      throw error;
    }
  },

  // フィルタリング対応の検索機能
  async searchEstimates(params: {
    companyId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    searchText?: string;
    userId?: string;
    vehicleId?: string;
  }): Promise<EstimateReport[]> {
    try {
      let query = supabase.from("estimate_vehicles").select(`
          id,
          user_id,
          vehicle_id,
          maker,
          name,
          year,
          document_type,
          created_at,
          company_id,
          sales_prices!inner(payment_total),
          users:user_id(company_name)
        `);

      // フィルタリング条件を追加
      if (params.userId) {
        query = query.eq("user_id", params.userId);
      }

      if (params.vehicleId) {
        query = query.eq("vehicle_id", params.vehicleId);
      }

      if (params.companyId) {
        query = query.eq("company_id", params.companyId);
      }

      if (params.dateFrom) {
        query = query.gte("created_at", params.dateFrom);
      }

      if (params.dateTo) {
        query = query.lte("created_at", params.dateTo);
      }

      if (params.searchText) {
        // 加盟店名も検索対象に含める
        query = query.or(`maker.ilike.%${params.searchText}%,name.ilike.%${params.searchText}%,users.company_name.ilike.%${params.searchText}%`);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Database query error:", error);
        throw new Error(`見積書の検索に失敗しました: ${error.message}`);
      }

      if (!data) {
        return [];
      }

      // データを EstimateReport 形式に変換
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const estimates: EstimateReport[] = data.map((item: any) => {
        const totalAmount = item.sales_prices?.[0]?.payment_total || 0;
        const companyName = item.users?.company_name || "";

        return {
          id: item.id,
          estimateNumber: `EST-${item.id.slice(0, 8).toUpperCase()}`,
          user_id: item.user_id,
          vehicle_id: item.vehicle_id,
          vehicleInfo: {
            maker: item.maker,
            name: item.name,
            year: item.year,
          },
          document_type: item.document_type,
          companyName,
          totalAmount,
          createdAt: item.created_at,
          status: "completed" as const,
        };
      });

      return estimates;
    } catch (error) {
      console.error("Error in searchEstimates:", error);
      throw error;
    }
  },

  // PDF生成（既存）
  async generateEstimatePDF(): Promise<Blob> {
    // TODO: PDF生成機能を実装
    throw new Error("PDF生成機能は未実装です");
  },
};
