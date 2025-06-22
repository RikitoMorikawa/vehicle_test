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
  grade?: string;
  model_code?: string;
  color?: string;
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

  // 見積もりを作成する関数（user_id対応版）
  async createEstimate(data: { vehicleId: string; userId: string } & EstimateFormData): Promise<void> {
    const { vehicleId, userId, tradeIn, loanCalculation, accessories, taxInsuranceFees, legalFees, processingFees, salesPrice, shippingInfo } = data;

    console.log("Creating estimate with data:", {
      vehicleId,
      userId, // ★追加
      tradeIn,
      loanCalculation,
      accessories,
      shippingInfo,
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

      // ステップ1: 見積もりテーブルに車両情報をコピーして基本情報を作成（user_id追加）
      const { data: estimateData, error: estimateError } = await supabase
        .from("estimate_vehicles")
        .insert([
          {
            user_id: userId, // ★追加：ログインユーザーIDを設定
            vehicle_id: vehicleId,
            maker: vehicleData.maker,
            name: vehicleData.name,
            year: vehicleData.year,
            mileage: vehicleData.mileage,
            price: vehicleData.price,
            document_type: data.document_type || "estimate",
            area_code: shippingInfo.area_code,
          },
        ])
        .select();

      if (estimateError) {
        console.error("Estimate vehicle insert error:", estimateError);
        throw estimateError;
      }

      // 作成された見積もりID
      const estimateId = estimateData[0].id;
      console.log("Created estimate with ID:", estimateId, "for user:", userId);

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
        estimate_id: estimateId,
        bonus_months: Array.isArray(loanCalculation.bonus_months) ? loanCalculation.bonus_months : [],
      };

      const { error: loanCalcError } = await supabase.from("loan_calculations").insert([processedLoanCalculation]);

      if (loanCalcError) {
        console.error("Loan calculation insert error:", loanCalcError);
        throw loanCalcError;
      }

      // ステップ4: 付属品情報の登録
      if (accessories && accessories.length > 0) {
        const accessoriesWithEstimateId = accessories.map((accessory) => ({
          ...accessory,
          estimate_id: estimateId,
        }));

        const { error: accessoriesError } = await supabase.from("accessories").insert(accessoriesWithEstimateId);

        if (accessoriesError) {
          console.error("Accessories insert error:", accessoriesError);
          throw accessoriesError;
        }
      }

      // 税金・保険料情報の登録
      const { error: taxInsuranceError } = await supabase.from("tax_insurance_fees").insert([
        {
          ...taxInsuranceFees,
          estimate_id: estimateId,
        },
      ]);

      if (taxInsuranceError) {
        console.error("Tax insurance fees insert error:", taxInsuranceError);
        throw taxInsuranceError;
      }

      // 法定費用情報の登録
      const { error: legalFeesError } = await supabase.from("legal_fees").insert([
        {
          ...legalFees,
          estimate_id: estimateId,
        },
      ]);

      if (legalFeesError) {
        console.error("Legal fees insert error:", legalFeesError);
        throw legalFeesError;
      }

      // 処理費用情報の登録
      const { error: processingFeesError } = await supabase.from("processing_fees").insert([
        {
          ...processingFees,
          estimate_id: estimateId,
        },
      ]);

      if (processingFeesError) {
        console.error("Processing fees insert error:", processingFeesError);
        throw processingFeesError;
      }

      // 販売価格情報の登録
      const { error: salesPriceError } = await supabase.from("sales_prices").insert([
        {
          ...salesPrice,
          estimate_id: estimateId,
        },
      ]);

      if (salesPriceError) {
        console.error("Sales price insert error:", salesPriceError);
        throw salesPriceError;
      }

      console.log("Estimate created successfully for user:", userId);
    } catch (error) {
      console.error("Failed to create estimate:", error);
      throw error;
    }
  },
};
