// src/server/common/pdf/handler_000.ts
import { supabase } from "../../../lib/supabase";
import type { EstimatePDFData } from "../../../types/common/pdf/page";

export const pdfHandler = {
  async fetchEstimateData(estimateId: string): Promise<EstimatePDFData> {
    try {
      // 見積書の基本情報を取得
      const { data: estimateVehicle, error: estimateError } = await supabase
        .from("estimate_vehicles")
        .select(`
          *,
          users:user_id(company_name, user_name, phone, email),
          companies:company_id(name, address, bank_account)
        `)
        .eq("id", estimateId)
        .single();

      if (estimateError) throw estimateError;

      // 関連データを並行取得
      const [
        { data: salesPrices },
        { data: tradeInVehicle },
        { data: loanCalculation },
        { data: accessories },
        { data: taxInsuranceFees },
        { data: legalFees },
        { data: processingFees }
      ] = await Promise.all([
        supabase.from("sales_prices").select("*").eq("estimate_id", estimateId).single(),
        supabase.from("trade_in_vehicles").select("*").eq("estimate_id", estimateId).single(),
        supabase.from("loan_calculations").select("*").eq("estimate_id", estimateId).single(),
        supabase.from("accessories").select("*").eq("estimate_id", estimateId),
        supabase.from("tax_insurance_fees").select("*").eq("estimate_id", estimateId).single(),
        supabase.from("legal_fees").select("*").eq("estimate_id", estimateId).single(),
        supabase.from("processing_fees").select("*").eq("estimate_id", estimateId).single()
      ]);

      // データを整形
      const pdfData: EstimatePDFData = {
        estimateNumber: `EST-${estimateVehicle.id.slice(0, 8).toUpperCase()}`,
        estimateDate: estimateVehicle.created_at,
        document_type: estimateVehicle.document_type || 'estimate',

        dealerInfo: {
          name: estimateVehicle.companies?.name || "販売店名",
          address: estimateVehicle.companies?.address || "住所未設定",
          phone: estimateVehicle.users?.phone || "電話番号未設定",
          representative: estimateVehicle.users?.user_name || "担当者名未設定",
          email: estimateVehicle.users?.email || "メール未設定"
        },

        customerInfo: {
          name: estimateVehicle.users?.company_name || "顧客名",
          address: "住所未設定",
          phone: estimateVehicle.users?.phone || "電話番号未設定"
        },

        estimateVehicle: {
          id: estimateVehicle.vehicle_id || estimateVehicle.id,
          maker: estimateVehicle.maker,
          name: estimateVehicle.name,
          grade: "",
          model: "",
          year: estimateVehicle.year,
          mileage: estimateVehicle.mileage,
          repairHistory: false,
          exteriorColor: "",
          price: estimateVehicle.price,
          created_at: estimateVehicle.created_at
        },

        tradeInVehicle: tradeInVehicle || undefined,

        loanCalculation: loanCalculation ? {
          ...loanCalculation,
          bonus_months: Array.isArray(loanCalculation.bonus_months) ? 
            loanCalculation.bonus_months.map(Number) : []
        } : undefined,

        accessories: accessories || [],

        taxInsuranceFees: taxInsuranceFees || {
          automobile_tax: 0,
          environmental_performance_tax: 0,
          weight_tax: 0,
          liability_insurance_fee: 0,
          voluntary_insurance_fee: 0
        },

        legalFees: legalFees || {
          inspection_registration_stamp: 0,
          parking_certificate_stamp: 0,
          trade_in_stamp: 0,
          recycling_deposit: 0,
          other_nontaxable: 0
        },

        processingFees: processingFees || {
          inspection_registration_fee: 0,
          parking_certificate_fee: 0,
          trade_in_processing_fee: 0,
          trade_in_assessment_fee: 0,
          recycling_management_fee: 0,
          delivery_fee: 0,
          other_fees: 0
        },

        salesPrices: salesPrices || {
          base_price: 0,
          discount: 0,
          inspection_fee: 0,
          accessories_fee: 0,
          vehicle_price: 0,
          tax_insurance: 0,
          legal_fee: 0,
          processing_fee: 0,
          misc_fee: 0,
          consumption_tax: 0,
          total_price: 0,
          trade_in_price: 0,
          trade_in_debt: 0,
          payment_total: 0
        }
      };

      return pdfData;
    } catch (error) {
      console.error("Error fetching estimate data:", error);
      throw new Error("見積書データの取得に失敗しました");
    }
  }
};