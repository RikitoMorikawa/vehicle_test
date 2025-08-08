// src/server/common/pdf/handler_000.ts
import { supabase } from "../../../lib/supabase";
import { EstimatePDFData } from "../../../types/common/pdf/page";

export const pdfHandler = {
  // 書類データを取得（全ての関連テーブルから）
  async fetchEstimateData(estimateId: string): Promise<EstimatePDFData> {
    try {
      console.log("Fetching estimate data for PDF generation:", estimateId);

      // 1. estimate_vehiclesテーブルから基本情報を取得（会社名のみ）
      const { data: estimateVehicle, error: vehicleError } = await supabase
        .from("estimate_vehicles")
        .select(
          `
          *,
          companies!estimate_vehicles_company_id_fkey (
            name
          ),
          vehicles!estimate_vehicles_vehicle_id_fkey (
            vehicle_id,
            grade,
            full_model_code,
            color,
            engine_size,
            inspection_date,
            transmission,
            accident_history,
            chassis_number
          )
        `
        )
        .eq("id", estimateId)
        .single();

      if (vehicleError) {
        console.error("Error fetching estimate vehicle:", vehicleError);
        throw vehicleError;
      }

      console.log("Found estimate vehicle:", estimateVehicle.id);

      // 2. 関連テーブルから詳細データを並行取得（デバッグログ追加）
      console.log("Fetching related data for estimateId:", estimateId);

      // ★修正: user_idから販売店情報を取得し、company_idも解決
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("company_name, user_name, phone, email")
        .eq("id", estimateVehicle.user_id)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
        // エラーでも続行（デフォルト値を使用）
      }

      // ★追加: usersのcompany_nameからcompaniesテーブルを検索して完全な会社情報を取得
      let companyData = null;
      if (userData?.company_name) {
        console.log("Searching for company:", userData.company_name);

        const { data: companyResult, error: companyError } = await supabase
          .from("companies")
          .select("name, address, bank_account") // ← bank_account を追加
          .eq("name", userData.company_name)
          .maybeSingle(); // ← .single() から .maybeSingle() に変更（0行でもエラーにならない）

        if (companyError) {
          console.error("Error fetching company data:", companyError);
        } else if (companyResult) {
          companyData = companyResult;
        } else {
          console.log("No company found with name:", userData.company_name);
        }

        // 会社データ取得後にログ追加
        if (companyResult) {
          console.log("Bank account data:", companyResult.bank_account);
          companyData = companyResult;
        } else {
          console.log("No company found with name:", userData.company_name);
        }

      }

      const [tradeInResult, loanResult, accessoriesResult, taxInsuranceResult, legalFeesResult, processingFeesResult, salesPricesResult] = await Promise.all([
        // trade_in_vehiclesテーブル（デバッグ強化）
        supabase
          .from("trade_in_vehicles")
          .select("*")
          .eq("estimate_id", estimateId)
          .maybeSingle()
          .then((result) => {
            console.log("Trade-in query result:", {
              data: result.data,
              error: result.error,
              estimateId: estimateId,
            });
            return result;
          }),

        // loan_calculationsテーブル
        supabase.from("loan_calculations").select("*").eq("estimate_id", estimateId).maybeSingle(),

        // accessoriesテーブル
        supabase.from("accessories").select("*").eq("estimate_id", estimateId),

        // tax_insurance_feesテーブル
        supabase.from("tax_insurance_fees").select("*").eq("estimate_id", estimateId).maybeSingle(),

        // legal_feesテーブル
        supabase.from("legal_fees").select("*").eq("estimate_id", estimateId).maybeSingle(),

        // processing_feesテーブル
        supabase.from("processing_fees").select("*").eq("estimate_id", estimateId).maybeSingle(),

        // sales_pricesテーブル
        supabase.from("sales_prices").select("*").eq("estimate_id", estimateId).maybeSingle(),
      ]);


      // エラーチェック
      const errors = [
        { name: "trade-in", error: tradeInResult.error },
        { name: "loan", error: loanResult.error },
        { name: "accessories", error: accessoriesResult.error },
        { name: "tax insurance", error: taxInsuranceResult.error },
        { name: "legal fees", error: legalFeesResult.error },
        { name: "processing fees", error: processingFeesResult.error },
        { name: "sales prices", error: salesPricesResult.error },
      ];

      for (const { name, error } of errors) {
        if (error) {
          console.error(`Error fetching ${name} data:`, error);
          throw error;
        }
      }

      // 下取り車両データの詳細ログ
      console.log("Trade-in vehicle data:", {
        found: !!tradeInResult.data,
        data: tradeInResult.data,
        estimateId: estimateId,
      });

      // 書類番号を生成
      const estimateNumber = `EST-${estimateVehicle.id.slice(0, 8).toUpperCase()}`;

      // 作成日をフォーマット
      const estimateDate = new Date(estimateVehicle.created_at).toISOString().split("T")[0];

      // 顧客情報（現在は仮データ、将来的にはcustomersテーブルから取得）
      const customerInfo = {
        name: estimateVehicle.customer_name || "",
        address: estimateVehicle.customer_address || "",
        phone: estimateVehicle.customer_phone || "",
      };

      // vehiclesテーブルから取得したデータを使用
      const vehicleData = estimateVehicle.vehicles || {};

      // データを統合してEstimatePDFData形式に変換
      const estimateData: EstimatePDFData = {
        // 基本情報
        estimateNumber,
        estimateDate,
        document_type: estimateVehicle.document_type,

        // 販売店情報（companiesテーブルの情報を優先的に使用）
        dealerInfo: {
          name: companyData?.name || userData?.company_name || "販売店名未設定",
          address: companyData?.address || "住所未設定",
          phone: userData?.phone || "電話番号未設定",
          representative: userData?.user_name || "担当者未設定",
          email: userData?.email || "メールアドレス未設定",
          bankAccount: companyData?.bank_account
            ? {
                bankName: companyData.bank_account.bank_name || "",
                branchName: companyData.bank_account.branch_name || "",
                accountType: companyData.bank_account.account_type || "",
                accountNumber: companyData.bank_account.account_number || "",
                accountHolder: companyData.bank_account.account_holder || "",
              }
            : undefined,
        },

        // 顧客情報
        customerInfo,

        // 見積車両情報（vehiclesテーブルのデータを使用）
        estimateVehicle: {
          id: estimateVehicle.id,
          vehicle_id: vehicleData.vehicle_id,
          maker: estimateVehicle.maker,
          name: estimateVehicle.name,
          grade: vehicleData.grade || "グレード未設定", // vehiclesテーブルから取得
          model: vehicleData.full_model_code || "型式未設定", // vehiclesテーブルのfull_model_codeを使用
          year: estimateVehicle.year,
          mileage: estimateVehicle.mileage,
          repairHistory: vehicleData.accident_history || false, // accident_historyを使用
          carHistory: "", // 存在しないため空文字
          chassisNumber: vehicleData.chassis_number || "",
          exteriorColor: vehicleData.color || "色未設定", // vehiclesテーブルのcolorを使用
          displacement: vehicleData.engine_size ? vehicleData.engine_size.toString() : "", // engine_sizeを使用
          inspectionExpiry: vehicleData.inspection_date || "", // inspection_dateを使用
          transmission: vehicleData.transmission || "",
          price: estimateVehicle.price,
          created_at: estimateVehicle.created_at,
        },

        // 下取り車両情報（デバッグログ追加）
        tradeInVehicle: tradeInResult.data
          ? {
              trade_in_available: tradeInResult.data.trade_in_available,
              vehicle_name: tradeInResult.data.vehicle_name,
              registration_number: tradeInResult.data.registration_number,
              mileage: tradeInResult.data.mileage,
              first_registration_date: tradeInResult.data.first_registration_date,
              inspection_expiry_date: tradeInResult.data.inspection_expiry_date,
              chassis_number: tradeInResult.data.chassis_number,
              exterior_color: tradeInResult.data.exterior_color,
            }
          : (() => {
              console.log("No trade-in vehicle data found for estimateId:", estimateId);
              return undefined;
            })(),

        // ローン計算情報
        loanCalculation: loanResult.data
          ? {
              down_payment: loanResult.data.down_payment || 0,
              principal: loanResult.data.principal || 0,
              interest_fee: loanResult.data.interest_fee || 0,
              total_payment: loanResult.data.total_payment || 0,
              payment_count: loanResult.data.payment_count || 0,
              payment_period: loanResult.data.payment_period || 0,
              first_payment: loanResult.data.first_payment || 0,
              monthly_payment: loanResult.data.monthly_payment || 0,
              bonus_amount: loanResult.data.bonus_amount || 0,
              bonus_months: loanResult.data.bonus_months || [],
            }
          : undefined,

        // 付属品・特別仕様
        accessories: (accessoriesResult.data || []).map((item) => ({
          name: item.name,
          price: item.price,
        })),

        // 税金・保険料
        taxInsuranceFees: {
          automobile_tax: taxInsuranceResult.data?.automobile_tax || 0,
          environmental_performance_tax: taxInsuranceResult.data?.environmental_performance_tax || 0,
          weight_tax: taxInsuranceResult.data?.weight_tax || 0,
          liability_insurance_fee: taxInsuranceResult.data?.liability_insurance_fee || 0,
          voluntary_insurance_fee: taxInsuranceResult.data?.voluntary_insurance_fee || 0,
        },

        // 預り法定費用
        legalFees: {
          inspection_registration_stamp: legalFeesResult.data?.inspection_registration_stamp || 0,
          parking_certificate_stamp: legalFeesResult.data?.parking_certificate_stamp || 0,
          trade_in_stamp: legalFeesResult.data?.trade_in_stamp || 0,
          recycling_deposit: legalFeesResult.data?.recycling_deposit || 0,
          other_nontaxable: legalFeesResult.data?.other_nontaxable || 0,
        },

        // 手続代行費用
        processingFees: {
          inspection_registration_fee: processingFeesResult.data?.inspection_registration_fee || 0,
          parking_certificate_fee: processingFeesResult.data?.parking_certificate_fee || 0,
          trade_in_processing_fee: processingFeesResult.data?.trade_in_processing_fee || 0,
          trade_in_assessment_fee: processingFeesResult.data?.trade_in_assessment_fee || 0,
          recycling_management_fee: processingFeesResult.data?.recycling_management_fee || 0,
          delivery_fee: processingFeesResult.data?.delivery_fee || 0,
          other_fees: processingFeesResult.data?.other_fees || 0,
        },

        // 販売価格
        salesPrices: {
          base_price: salesPricesResult.data?.base_price || 0,
          discount: salesPricesResult.data?.discount || 0,
          inspection_fee: salesPricesResult.data?.inspection_fee || 0,
          accessories_fee: salesPricesResult.data?.accessories_fee || 0,
          vehicle_price: salesPricesResult.data?.vehicle_price || 0,
          tax_insurance: salesPricesResult.data?.tax_insurance || 0,
          legal_fee: salesPricesResult.data?.legal_fee || 0,
          processing_fee: salesPricesResult.data?.processing_fee || 0,
          misc_fee: salesPricesResult.data?.misc_fee || 0,
          consumption_tax: salesPricesResult.data?.consumption_tax || 0,
          total_price: salesPricesResult.data?.total_price || 0,
          trade_in_price: salesPricesResult.data?.trade_in_price || 0,
          trade_in_debt: salesPricesResult.data?.trade_in_debt || 0,
          payment_total: salesPricesResult.data?.payment_total || 0,
        },
      };

      return estimateData;
    } catch (error) {
      console.error("Failed to fetch estimate data:", error);
      throw error;
    }
  },

  // 書類番号を生成するヘルパー関数
  generateEstimateNumber(vehicleId: string): string {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const idSuffix = vehicleId.slice(-4).toUpperCase();
    return `EST-${timestamp}-${idSuffix}`;
  },
};
