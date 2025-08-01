// src/services/document-edit/page.ts
import { supabase } from "../../lib/supabase";
import type { EstimateReport } from "../../types/report/page";

class DocumentEditService {
  /**
   * 書類の詳細を取得
   */
  async getDocument(documentId: string): Promise<EstimateReport> {
    try {
      const { data, error } = await supabase
        .from("estimate_vehicles")
        .select(`
          id,
          user_id,
          vehicle_id,
          maker,
          name,
          year,
          mileage,
          price,
          document_type,
          created_at,
          company_id,
          area_code,
          sales_prices!inner(
            base_price,
            discount,
            inspection_fee,
            accessories_fee,
            vehicle_price,
            tax_insurance,
            legal_fee,
            processing_fee,
            misc_fee,
            consumption_tax,
            total_price,
            trade_in_price,
            trade_in_debt,
            payment_total
          ),
          users:user_id(company_name),
          companies:company_id(name)
        `)
        .eq("id", documentId)
        .single();

      if (error) {
        console.error("Database query error:", error);
        throw new Error(`書類の取得に失敗しました: ${error.message}`);
      }

      if (!data) {
        throw new Error("書類が見つかりません");
      }

      const totalAmount = data.sales_prices?.[0]?.payment_total || 0;
      
      // 配列の最初の要素にアクセス
      const companyName = (data.companies?.[0]?.name) || (data.users?.[0]?.company_name) || "";

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
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        deliveryDate: "",
        validUntil: "",
        notes: "",
        taxRate: 10,
        totalAmount,
        createdAt: data.created_at,
        status: "completed" as const,
      };
    } catch (error) {
      console.error("Error in getDocument:", error);
      throw error;
    }
  }

  /**
   * 書類の詳細データを取得（全関連テーブル含む）
   */
  async getDocumentDetails(documentId: string) {
    try {
      // メインの見積書情報を取得
      const { data: estimateData, error: estimateError } = await supabase
        .from("estimate_vehicles")
        .select(`
          id,
          user_id,
          vehicle_id,
          maker,
          name,
          year,
          mileage,
          price,
          document_type,
          created_at,
          company_id,
          area_code
        `)
        .eq("id", documentId)
        .single();

      if (estimateError) {
        throw new Error(`見積書データの取得に失敗: ${estimateError.message}`);
      }

      // 下取り車両情報を取得
      const { data: tradeInData, error: tradeInError } = await supabase
        .from("trade_in_vehicles")
        .select("*")
        .eq("estimate_id", documentId)
        .maybeSingle();

      if (tradeInError) {
        console.warn("下取り車両データの取得に失敗:", tradeInError);
      }

      // ローン計算情報を取得
      const { data: loanData, error: loanError } = await supabase
        .from("loan_calculations")
        .select("*")
        .eq("estimate_id", documentId)
        .maybeSingle();

      if (loanError) {
        console.warn("ローン計算データの取得に失敗:", loanError);
      }

      // 付属品情報を取得
      const { data: accessoriesData, error: accessoriesError } = await supabase
        .from("accessories")
        .select("*")
        .eq("estimate_id", documentId);

      if (accessoriesError) {
        console.warn("付属品データの取得に失敗:", accessoriesError);
      }

      // 税金・保険料情報を取得
      const { data: taxInsuranceData, error: taxInsuranceError } = await supabase
        .from("tax_insurance_fees")
        .select("*")
        .eq("estimate_id", documentId)
        .maybeSingle();

      if (taxInsuranceError) {
        console.warn("税金・保険料データの取得に失敗:", taxInsuranceError);
      }

      // 法定費用情報を取得
      const { data: legalFeesData, error: legalFeesError } = await supabase
        .from("legal_fees")
        .select("*")
        .eq("estimate_id", documentId)
        .maybeSingle();

      if (legalFeesError) {
        console.warn("法定費用データの取得に失敗:", legalFeesError);
      }

      // 手続代行費用情報を取得
      const { data: processingFeesData, error: processingFeesError } = await supabase
        .from("processing_fees")
        .select("*")
        .eq("estimate_id", documentId)
        .maybeSingle();

      if (processingFeesError) {
        console.warn("手続代行費用データの取得に失敗:", processingFeesError);
      }

      // 販売価格情報を取得
      const { data: salesPriceData, error: salesPriceError } = await supabase
        .from("sales_prices")
        .select("*")
        .eq("estimate_id", documentId)
        .maybeSingle();

      if (salesPriceError) {
        console.warn("販売価格データの取得に失敗:", salesPriceError);
      }

      // 配送費用情報を取得
      let shippingData = null;
      if (estimateData.area_code) {
        const { data: shippingCostData, error: shippingError } = await supabase
          .from("shipping_costs")
          .select("*")
          .eq("area_code", estimateData.area_code)
          .maybeSingle();

        if (shippingError) {
          console.warn("配送費用データの取得に失敗:", shippingError);
        } else {
          shippingData = shippingCostData;
        }
      }

      return {
        estimate: estimateData,
        tradeIn: tradeInData,
        loan: loanData,
        accessories: accessoriesData || [],
        taxInsurance: taxInsuranceData,
        legalFees: legalFeesData,
        processingFees: processingFeesData,
        salesPrice: salesPriceData,
        shipping: shippingData,
      };
    } catch (error) {
      console.error("Error in getDocumentDetails:", error);
      throw error;
    }
  }
}

export const documentEditService = new DocumentEditService();