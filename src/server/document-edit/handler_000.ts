// src/server/document-edit/handler_000.ts
import { supabase } from "../../lib/supabase";
import type { EstimateFormData } from "../../validations/document-edit/page";
import type { EstimateReport } from "../../types/report/page";
import type { Vehicle } from "../estimate/handler_000";
import { documentEditService } from "../../services/document-edit/page";

export const documentEditHandler = {
  /**
   * 書類の詳細を取得
   */
  async fetchDocumentById(documentId: string): Promise<EstimateReport> {
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
          document_type,
          created_at,
          company_id,
          sales_prices!inner(payment_total),
          users:user_id(company_name)
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
      console.error("Error in fetchDocumentById:", error);
      throw error;
    }
  },

  /**
   * 車両情報を取得
   */
  async fetchVehicleById(vehicleId: string): Promise<Vehicle> {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", vehicleId)
        .single();

      if (error) {
        console.error("Vehicle fetch error:", error);
        throw new Error(`車両情報の取得に失敗しました: ${error.message}`);
      }

      if (!data) {
        throw new Error("車両が見つかりません");
      }

      return {
        id: data.id,
        maker: data.maker,
        name: data.name,
        year: data.year,
        mileage: data.mileage,
        price: data.price,
        grade: data.grade,
        model_code: data.model_code,
        color: data.color,
      };
    } catch (error) {
      console.error("Error in fetchVehicleById:", error);
      throw error;
    }
  },

  /**
   * データベースの書類データをフォームデータに変換
   */
  async convertToFormData(documentData: EstimateReport): Promise<Partial<EstimateFormData>> {
    try {
      // 詳細データを取得
      const details = await documentEditService.getDocumentDetails(documentData.id);

      const formData: Partial<EstimateFormData> = {
        document_type: documentData.document_type as "estimate" | "invoice" | "order",
        tradeIn: {
          trade_in_available: details.tradeIn?.trade_in_available || false,
          vehicle_name: details.tradeIn?.vehicle_name || "",
          registration_number: details.tradeIn?.registration_number || "",
          mileage: details.tradeIn?.mileage || 0,
          first_registration_date: details.tradeIn?.first_registration_date || "",
          inspection_expiry_date: details.tradeIn?.inspection_expiry_date || "",
          chassis_number: details.tradeIn?.chassis_number || "",
          exterior_color: details.tradeIn?.exterior_color || "",
        },
        loanCalculation: {
          down_payment: details.loan?.down_payment || 0,
          principal: details.loan?.principal || 0,
          annual_rate: Number(details.loan?.annual_rate) || 0,
          payment_count: details.loan?.payment_count || 0,
          payment_period: details.loan?.payment_period || 0,
          interest_fee: details.loan?.interest_fee || 0,
          total_payment: details.loan?.total_payment || 0,
          first_payment: details.loan?.first_payment || 0,
          monthly_payment: details.loan?.monthly_payment || 0,
          bonus_amount: details.loan?.bonus_amount || 0,
          bonus_months: details.loan?.bonus_months || [],
        },
        accessories: details.accessories.map(acc => ({
          name: acc.name,
          price: acc.price,
        })),
        taxInsuranceFees: {
          automobile_tax: details.taxInsurance?.automobile_tax || 0,
          environmental_performance_tax: details.taxInsurance?.environmental_performance_tax || 0,
          weight_tax: details.taxInsurance?.weight_tax || 0,
          liability_insurance_fee: details.taxInsurance?.liability_insurance_fee || 0,
        },
        legalFees: {
          inspection_registration_stamp: details.legalFees?.inspection_registration_stamp || 0,
          parking_certificate_stamp: details.legalFees?.parking_certificate_stamp || 0,
          trade_in_stamp: details.legalFees?.trade_in_stamp || 0,
          recycling_deposit: details.legalFees?.recycling_deposit || 0,
          other_nontaxable: details.legalFees?.other_nontaxable || 0,
        },
        processingFees: {
          inspection_registration_fee: details.processingFees?.inspection_registration_fee || 0,
          parking_certificate_fee: details.processingFees?.parking_certificate_fee || 0,
          recycling_management_fee: details.processingFees?.recycling_management_fee || 0,
          delivery_fee: details.processingFees?.delivery_fee || 0,
          other_fees: details.processingFees?.other_fees || 0,
        },
        salesPrice: {
          base_price: details.salesPrice?.base_price || 0,
          discount: details.salesPrice?.discount || 0,
          inspection_fee: details.salesPrice?.inspection_fee || 0,
          accessories_fee: details.salesPrice?.accessories_fee || 0,
          vehicle_price: details.salesPrice?.vehicle_price || 0,
          tax_insurance: details.salesPrice?.tax_insurance || 0,
          legal_fee: details.salesPrice?.legal_fee || 0,
          processing_fee: details.salesPrice?.processing_fee || 0,
          misc_fee: details.salesPrice?.misc_fee || 0,
          consumption_tax: details.salesPrice?.consumption_tax || 0,
          total_price: details.salesPrice?.total_price || 0,
          trade_in_price: details.salesPrice?.trade_in_price || 0,
          trade_in_debt: details.salesPrice?.trade_in_debt || 0,
          payment_total: details.salesPrice?.payment_total || 0,
        },
        shippingInfo: {
          area_code: details.shipping?.area_code || null,
          shipping_cost: details.shipping?.cost || 0,
          prefecture: details.shipping?.prefecture || "",
          city: details.shipping?.city || "",
        },
      };

      return formData;
    } catch (error) {
      console.error("Error in convertToFormData:", error);
      throw error;
    }
  },

  /**
   * 書類を更新
   */
  async updateDocument(documentId: string, formData: EstimateFormData): Promise<void> {
    try {
      console.log("📝 書類更新開始:", documentId);

      // 1. estimate_vehicles テーブルを更新
      const { error: estimateError } = await supabase
        .from("estimate_vehicles")
        .update({
          document_type: formData.document_type,
          updated_at: new Date().toISOString(),
        })
        .eq("id", documentId);

      if (estimateError) {
        throw new Error(`見積書更新エラー: ${estimateError.message}`);
      }
      console.log("✅ 見積書基本情報更新完了");

      // 2. 下取り車両情報の更新・作成
      if (formData.tradeIn.trade_in_available) {
        // 既存の下取り車両データを削除
        const { error: deleteTradeInError } = await supabase
          .from("trade_in_vehicles")
          .delete()
          .eq("estimate_id", documentId);

        if (deleteTradeInError) {
          console.warn("⚠️ 下取り車両削除警告:", deleteTradeInError);
        }

        // 新規下取り車両データを挿入
        const { error: tradeInError } = await supabase
          .from("trade_in_vehicles")
          .insert({
            estimate_id: documentId,
            trade_in_available: formData.tradeIn.trade_in_available,
            vehicle_name: formData.tradeIn.vehicle_name,
            registration_number: formData.tradeIn.registration_number,
            mileage: formData.tradeIn.mileage,
            first_registration_date: formData.tradeIn.first_registration_date || null,
            inspection_expiry_date: formData.tradeIn.inspection_expiry_date || null,
            chassis_number: formData.tradeIn.chassis_number,
            exterior_color: formData.tradeIn.exterior_color,
            updated_at: new Date().toISOString(),
          });

        if (tradeInError) {
          throw new Error(`下取り車両更新エラー: ${tradeInError.message}`);
        }
        console.log("✅ 下取り車両情報更新完了");
      } else {
        // 下取りなしの場合、既存データを削除
        const { error: deleteTradeInError } = await supabase
          .from("trade_in_vehicles")
          .delete()
          .eq("estimate_id", documentId);

        if (deleteTradeInError) {
          console.warn("⚠️ 下取り車両削除警告:", deleteTradeInError);
        } else {
          console.log("✅ 下取り車両データ削除完了");
        }
      }

      // 3. ローン計算情報の更新（削除→挿入）
      // 既存のローン計算データを削除
      const { error: deleteLoanError } = await supabase
        .from("loan_calculations")
        .delete()
        .eq("estimate_id", documentId);

      if (deleteLoanError) {
        console.warn("⚠️ ローン計算削除警告:", deleteLoanError);
      }

      // 新規ローン計算データを挿入
      const { error: loanError } = await supabase
        .from("loan_calculations")
        .insert({
          estimate_id: documentId,
          down_payment: formData.loanCalculation.down_payment,
          principal: formData.loanCalculation.principal,
          annual_rate: formData.loanCalculation.annual_rate,
          payment_count: formData.loanCalculation.payment_count,
          payment_period: formData.loanCalculation.payment_period,
          interest_fee: formData.loanCalculation.interest_fee,
          total_payment: formData.loanCalculation.total_payment,
          first_payment: formData.loanCalculation.first_payment,
          monthly_payment: formData.loanCalculation.monthly_payment,
          bonus_amount: formData.loanCalculation.bonus_amount,
          bonus_months: formData.loanCalculation.bonus_months,
          updated_at: new Date().toISOString(),
        });

      if (loanError) {
        throw new Error(`ローン計算更新エラー: ${loanError.message}`);
      }
      console.log("✅ ローン計算情報更新完了");

      // 4. 既存の付属品を削除してから新規追加
      const { error: deleteAccessoriesError } = await supabase
        .from("accessories")
        .delete()
        .eq("estimate_id", documentId);

      if (deleteAccessoriesError) {
        throw new Error(`付属品削除エラー: ${deleteAccessoriesError.message}`);
      }

      if (formData.accessories && formData.accessories.length > 0) {
        const accessoriesToInsert = formData.accessories.map(accessory => ({
          estimate_id: documentId,
          name: accessory.name,
          price: accessory.price,
        }));

        const { error: accessoriesError } = await supabase
          .from("accessories")
          .insert(accessoriesToInsert);

        if (accessoriesError) {
          throw new Error(`付属品更新エラー: ${accessoriesError.message}`);
        }
        console.log("✅ 付属品情報更新完了");
      } else {
        console.log("✅ 付属品削除完了（付属品なし）");
      }

      // 5. 税金・保険料情報の更新（削除→挿入）
      // 既存の税金・保険料データを削除
      const { error: deleteTaxInsuranceError } = await supabase
        .from("tax_insurance_fees")
        .delete()
        .eq("estimate_id", documentId);

      if (deleteTaxInsuranceError) {
        console.warn("⚠️ 税金・保険料削除警告:", deleteTaxInsuranceError);
      }

      // 新規税金・保険料データを挿入
      const { error: taxInsuranceError } = await supabase
        .from("tax_insurance_fees")
        .insert({
          estimate_id: documentId,
          automobile_tax: formData.taxInsuranceFees.automobile_tax,
          environmental_performance_tax: formData.taxInsuranceFees.environmental_performance_tax,
          weight_tax: formData.taxInsuranceFees.weight_tax,
          liability_insurance_fee: formData.taxInsuranceFees.liability_insurance_fee,
          updated_at: new Date().toISOString(),
        });

      if (taxInsuranceError) {
        throw new Error(`税金・保険料更新エラー: ${taxInsuranceError.message}`);
      }
      console.log("✅ 税金・保険料情報更新完了");

      // 6. 法定費用情報の更新（削除→挿入）
      // 既存の法定費用データを削除
      const { error: deleteLegalFeesError } = await supabase
        .from("legal_fees")
        .delete()
        .eq("estimate_id", documentId);

      if (deleteLegalFeesError) {
        console.warn("⚠️ 法定費用削除警告:", deleteLegalFeesError);
      }

      // 新規法定費用データを挿入
      const { error: legalFeesError } = await supabase
        .from("legal_fees")
        .insert({
          estimate_id: documentId,
          inspection_registration_stamp: formData.legalFees.inspection_registration_stamp,
          parking_certificate_stamp: formData.legalFees.parking_certificate_stamp,
          trade_in_stamp: formData.legalFees.trade_in_stamp,
          recycling_deposit: formData.legalFees.recycling_deposit,
          other_nontaxable: formData.legalFees.other_nontaxable,
          updated_at: new Date().toISOString(),
        });

      if (legalFeesError) {
        throw new Error(`法定費用更新エラー: ${legalFeesError.message}`);
      }
      console.log("✅ 法定費用情報更新完了");

      // 7. 手続代行費用情報の更新（削除→挿入）
      // 既存の手続代行費用データを削除
      const { error: deleteProcessingFeesError } = await supabase
        .from("processing_fees")
        .delete()
        .eq("estimate_id", documentId);

      if (deleteProcessingFeesError) {
        console.warn("⚠️ 手続代行費用削除警告:", deleteProcessingFeesError);
      }

      // 新規手続代行費用データを挿入
      const { error: processingFeesError } = await supabase
        .from("processing_fees")
        .insert({
          estimate_id: documentId,
          inspection_registration_fee: formData.processingFees.inspection_registration_fee,
          parking_certificate_fee: formData.processingFees.parking_certificate_fee,
          recycling_management_fee: formData.processingFees.recycling_management_fee,
          delivery_fee: formData.processingFees.delivery_fee,
          other_fees: formData.processingFees.other_fees,
          updated_at: new Date().toISOString(),
        });

      if (processingFeesError) {
        throw new Error(`手続代行費用更新エラー: ${processingFeesError.message}`);
      }
      console.log("✅ 手続代行費用情報更新完了");

      // 8. 販売価格情報の更新（削除→挿入）
      // 既存の販売価格データを削除
      const { error: deleteSalesPriceError } = await supabase
        .from("sales_prices")
        .delete()
        .eq("estimate_id", documentId);

      if (deleteSalesPriceError) {
        console.warn("⚠️ 販売価格削除警告:", deleteSalesPriceError);
      }

      // 新規販売価格データを挿入
      const { error: salesPriceError } = await supabase
        .from("sales_prices")
        .insert({
          estimate_id: documentId,
          base_price: formData.salesPrice.base_price,
          discount: formData.salesPrice.discount,
          inspection_fee: formData.salesPrice.inspection_fee,
          accessories_fee: formData.salesPrice.accessories_fee,
          vehicle_price: formData.salesPrice.vehicle_price,
          tax_insurance: formData.salesPrice.tax_insurance,
          legal_fee: formData.salesPrice.legal_fee,
          processing_fee: formData.salesPrice.processing_fee,
          misc_fee: formData.salesPrice.misc_fee,
          consumption_tax: formData.salesPrice.consumption_tax,
          total_price: formData.salesPrice.total_price,
          trade_in_price: formData.salesPrice.trade_in_price,
          trade_in_debt: formData.salesPrice.trade_in_debt,
          payment_total: formData.salesPrice.payment_total,
          updated_at: new Date().toISOString(),
        });

      if (salesPriceError) {
        throw new Error(`販売価格更新エラー: ${salesPriceError.message}`);
      }
      console.log("✅ 販売価格情報更新完了");

      // 9. 配送エリア情報の更新
      if (formData.shippingInfo.area_code && formData.shippingInfo.area_code > 0) {
        const { error: shippingUpdateError } = await supabase
          .from("estimate_vehicles")
          .update({
            area_code: formData.shippingInfo.area_code,
            updated_at: new Date().toISOString(),
          })
          .eq("id", documentId);

        if (shippingUpdateError) {
          throw new Error(`配送エリア更新エラー: ${shippingUpdateError.message}`);
        }
        console.log("✅ 配送エリア情報更新完了");
      }

      console.log("🎉 書類更新完了:", documentId);

    } catch (error) {
      console.error("❌ Error in updateDocument:", error);
      throw error;
    }
  },
};