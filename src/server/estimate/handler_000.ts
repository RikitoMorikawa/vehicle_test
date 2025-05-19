// src/server/estimate/handler_000.ts
import { supabase } from "../../lib/supabase";
import { EstimateFormData } from "../../validations/estimate/page";

// 車両情報の型定義
export interface Vehicle {
  id: string;
  maker: string;
  name: string;
  year: number;
  mileage: number;
  price: number;
  user_id?: string;
}

export const estimateHandler = {
  // 車両情報を取得する関数
  async fetchVehicle(id: string): Promise<Vehicle> {
    console.log("Fetching vehicle with ID:", id);
    const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).single();

    if (error) {
      console.error("Error fetching vehicle:", error);
      throw error;
    }

    return data;
  },

  // 見積もりを作成する関数
  async createEstimate(data: { vehicleId: string } & EstimateFormData): Promise<void> {
    const { vehicleId, tradeIn, loanCalculation } = data;

    console.log("Creating estimate with data:", {
      vehicleId,
      tradeIn,
      loanCalculation,
    });

    try {
      // まず車両情報を取得して、estimate_vehicles テーブルに必要なデータをコピー
      const { data: vehicleData, error: vehicleFetchError } = await supabase
        .from("vehicles")
        .select("maker, name, year, mileage, price")
        .eq("id", vehicleId)
        .single();

      if (vehicleFetchError) {
        console.error("Error fetching vehicle data:", vehicleFetchError);
        throw vehicleFetchError;
      }

      // ステップ1: 見積もりテーブルに車両情報をコピーして基本情報を作成
      const { data: estimateData, error: estimateError } = await supabase
        .from("estimate_vehicles")
        .insert([
          {
            vehicle_id: vehicleId,
            maker: vehicleData.maker, // 車両情報から取得したメーカー
            name: vehicleData.name, // 車両情報から取得した車名
            year: vehicleData.year, // 車両情報から取得した年式
            mileage: vehicleData.mileage, // 車両情報から取得した走行距離
            price: vehicleData.price, // 車両情報から取得した価格
            // その他、estimate_vehicles テーブルに必要なフィールドがあれば追加
          },
        ])
        .select();

      if (estimateError) {
        console.error("Estimate vehicle insert error:", estimateError);
        throw estimateError;
      }

      // 作成された見積もりID
      const estimateId = estimateData[0].id;
      console.log("Created estimate with ID:", estimateId);

      const sanitizedTradeIn = {
        ...tradeIn,
        first_registration_date: tradeIn.first_registration_date || null,
        inspection_expiry_date: tradeIn.inspection_expiry_date || null,
        chassis_number: tradeIn.chassis_number || null,
      };

      const { error: tradeInError } = await supabase.from("trade_in_vehicles").insert([
        {
          ...sanitizedTradeIn,
          estimate_id: estimateId,
        },
      ]);

      if (tradeInError) {
        console.error("Trade-in vehicle insert error:", tradeInError);
        throw tradeInError;
      }

      // ステップ3: ローン計算情報の登録
      const processedLoanCalculation = {
        ...loanCalculation,
        vehicle_id: vehicleId,
        estimate_id: estimateId, // 見積もりIDに紐づける（テーブルにこのカラムが存在する場合）
        bonus_months: Array.isArray(loanCalculation.bonus_months) ? loanCalculation.bonus_months : [],
      };

      const { error: loanCalcError } = await supabase.from("loan_calculations").insert([processedLoanCalculation]);

      if (loanCalcError) {
        console.error("Loan calculation insert error:", loanCalcError);
        throw loanCalcError;
      }

      console.log("Estimate created successfully");
    } catch (error) {
      console.error("Failed to create estimate:", error);
      throw error;
    }
  },
};
