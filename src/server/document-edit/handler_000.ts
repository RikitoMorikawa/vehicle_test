// src/server/document-edit/handler_000.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { EstimateError, EstimateFormData } from "../../validations/estimate/page";
import { Vehicle } from "../estimate/handler_000";
import { z } from "zod";

// Supabase クライアントの初期化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// リクエストボディのバリデーションスキーマ
const updateDocumentSchema = z.object({
  documentId: z.string().uuid(),
  formData: z.object({
    document_type: z.enum(["estimate", "invoice", "order"]),
    // 他のフィールドのバリデーションは省略（実際の実装では必要）
  }),
  updatedAt: z.string().datetime(),
});

// 既存書類データの取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const documentId = params.id;

  try {
    // パラメータの検証
    if (!documentId || typeof documentId !== "string") {
      return NextResponse.json(
        { success: false, error: "無効なドキュメントIDです" },
        { status: 400 }
      );
    }

    // UUID形式の検証
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(documentId)) {
      return NextResponse.json(
        { success: false, error: "無効なドキュメントID形式です" },
        { status: 400 }
      );
    }

    // メイン書類データの取得
    const { data: estimateData, error: estimateError } = await supabase
      .from("estimate_vehicles")
      .select("*")
      .eq("id", documentId)
      .single();

    if (estimateError || !estimateData) {
      return NextResponse.json(
        { success: false, error: "書類が見つかりません" },
        { status: 404 }
      );
    }

    // 車両データの取得
    let vehicleData: Vehicle | undefined;
    if (estimateData.vehicle_id) {
      const { data: vehicle, error: vehicleError } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", estimateData.vehicle_id)
        .single();

      if (!vehicleError && vehicle) {
        vehicleData = vehicle as Vehicle;
      }
    }

    // 関連データの並列取得
    const [
      tradeInResult,
      loanResult,
      accessoriesResult,
      taxInsuranceResult,
      legalFeesResult,
      processingFeesResult,
      salesPriceResult,
    ] = await Promise.all([
      supabase.from("trade_in_vehicles").select("*").eq("estimate_id", documentId).single(),
      supabase.from("loan_calculations").select("*").eq("estimate_id", documentId).single(),
      supabase.from("accessories").select("*").eq("estimate_id", documentId),
      supabase.from("tax_insurance_fees").select("*").eq("estimate_id", documentId).single(),
      supabase.from("legal_fees").select("*").eq("estimate_id", documentId).single(),
      supabase.from("processing_fees").select("*").eq("estimate_id", documentId).single(),
      supabase.from("sales_prices").select("*").eq("estimate_id", documentId).single(),
    ]);

    // 配送情報の取得
    let shippingInfo = {
      area_code: null,
      prefecture: "",
      city: "",
      cost: 0,
    };

    if (estimateData.area_code) {
      const { data: shipping } = await supabase
        .from("shipping_costs")
        .select("*")
        .eq("area_code", estimateData.area_code)
        .single();

      if (shipping) {
        shippingInfo = {
          area_code: shipping.area_code,
          prefecture: shipping.prefecture,
          city: shipping.city,
          cost: shipping.cost,
        };
      }
    }

    // フォームデータの構築
    const formData: EstimateFormData = {
      document_type: estimateData.document_type || "estimate",
      tradeIn: {
        trade_in_available: tradeInResult.data?.trade_in_available || false,
        vehicle_name: tradeInResult.data?.vehicle_name || "",
        registration_number: tradeInResult.data?.registration_number || "",
        mileage: tradeInResult.data?.mileage || 0,
        first_registration_date: tradeInResult.data?.first_registration_date || "",
        inspection_expiry_date: tradeInResult.data?.inspection_expiry_date || "",
        chassis_number: tradeInResult.data?.chassis_number || "",
        exterior_color: tradeInResult.data?.exterior_color || "",
      },
      loanCalculation: {
        down_payment: loanResult.data?.down_payment || 0,
        principal: loanResult.data?.principal || 0,
        annual_rate: loanResult.data?.annual_rate || 0,
        payment_count: loanResult.data?.payment_count || 0,
        payment_period: loanResult.data?.payment_period || 0,
        interest_fee: loanResult.data?.interest_fee || 0,
        total_payment: loanResult.data?.total_payment || 0,
        first_payment: loanResult.data?.first_payment || 0,
        monthly_payment: loanResult.data?.monthly_payment || 0,
        bonus_months: loanResult.data?.bonus_months || [],
        bonus_amount: loanResult.data?.bonus_amount || 0,
      },
      accessories: accessoriesResult.data || [],
      taxInsuranceFees: {
        automobile_tax: taxInsuranceResult.data?.automobile_tax || 0,
        environmental_performance_tax: taxInsuranceResult.data?.environmental_performance_tax || 0,
        weight_tax: taxInsuranceResult.data?.weight_tax || 0,
        liability_insurance_fee: taxInsuranceResult.data?.liability_insurance_fee || 0,
      },
      legalFees: {
        inspection_registration_stamp: legalFeesResult.data?.inspection_registration_stamp || 0,
        parking_certificate_stamp: legalFeesResult.data?.parking_certificate_stamp || 0,
        trade_in_stamp: legalFeesResult.data?.trade_in_stamp || 0,
        recycling_deposit: legalFeesResult.data?.recycling_deposit || 0,
        other_nontaxable: legalFeesResult.data?.other_nontaxable || 0,
      },
      processingFees: {
        inspection_registration_fee: processingFeesResult.data?.inspection_registration_fee || 0,
        parking_certificate_fee: processingFeesResult.data?.parking_certificate_fee || 0,
        recycling_management_fee: processingFeesResult.data?.recycling_management_fee || 0,
        delivery_fee: processingFeesResult.data?.delivery_fee || 0,
        other_fees: processingFeesResult.data?.other_fees || 0,
      },
      salesPrice: {
        base_price: salesPriceResult.data?.base_price || 0,
        discount: salesPriceResult.data?.discount || 0,
        inspection_fee: salesPriceResult.data?.inspection_fee || 0,
        accessories_fee: salesPriceResult.data?.accessories_fee || 0,
        vehicle_price: salesPriceResult.data?.vehicle_price || 0,
        tax_insurance: salesPriceResult.data?.tax_insurance || 0,
        legal_fee: salesPriceResult.data?.legal_fee || 0,
        processing_fee: salesPriceResult.data?.processing_fee || 0,
        misc_fee: salesPriceResult.data?.misc_fee || 0,
        consumption_tax: salesPriceResult.data?.consumption_tax || 0,
        total_price: salesPriceResult.data?.total_price || 0,
        trade_in_price: salesPriceResult.data?.trade_in_price || 0,
        trade_in_debt: salesPriceResult.data?.trade_in_debt || 0,
        payment_total: salesPriceResult.data?.payment_total || 0,
      },
      shippingInfo,
    };

    return NextResponse.json({
      success: true,
      data: {
        formData,
        vehicle: vehicleData,
        documentId,
      },
    });
  } catch (error) {
    console.error("Document fetch error:", error);
    return NextResponse.json(
      { success: false, error: "書類データの取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

// 書類データの更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const documentId = params.id;

  try {
    const body = await request.json();
    
    // リクエストボディの検証
    const validationResult = updateDocumentSchema.safeParse(body);
    if (!validationResult.success) {
      const errors: EstimateError = {};
      validationResult.error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    const { formData } = validationResult.data;

    // トランザクション処理
    const { error: updateError } = await supabase.rpc("update_document_with_relations", {
      p_document_id: documentId,
      p_document_type: formData.document_type,
      p_trade_in_data: formData.tradeIn,
      p_loan_data: formData.loanCalculation,
      p_accessories_data: formData.accessories,
      p_tax_insurance_data: formData.taxInsuranceFees,
      p_legal_fees_data: formData.legalFees,
      p_processing_fees_data: formData.processingFees,
      p_sales_price_data: formData.salesPrice,
      p_shipping_data: formData.shippingInfo,
      p_updated_at: new Date().toISOString(),
    });

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { success: false, error: "書類の更新に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        documentId,
        message: "書類が正常に更新されました",
      },
    });
  } catch (error) {
    console.error("Document update error:", error);
    return NextResponse.json(
      { success: false, error: "書類の更新中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

// 書類の削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const documentId = params.id;

  try {
    // パラメータの検証
    if (!documentId || typeof documentId !== "string") {
      return NextResponse.json(
        { success: false, error: "無効なドキュメントIDです" },
        { status: 400 }
      );
    }

    // 書類の存在確認
    const { data: estimateData, error: checkError } = await supabase
      .from("estimate_vehicles")
      .select("id")
      .eq("id", documentId)
      .single();

    if (checkError || !estimateData) {
      return NextResponse.json(
        { success: false, error: "削除対象の書類が見つかりません" },
        { status: 404 }
      );
    }

    // カスケード削除（外部キー制約により自動削除される）
    const { error: deleteError } = await supabase
      .from("estimate_vehicles")
      .delete()
      .eq("id", documentId);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return NextResponse.json(
        { success: false, error: "書類の削除に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        documentId,
        message: "書類が正常に削除されました",
      },
    });
  } catch (error) {
    console.error("Document delete error:", error);
    return NextResponse.json(
      { success: false, error: "書類の削除中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

// 書類の複製
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const sourceDocumentId = params.id;

  try {
    // 元書類の取得
    const getResponse = await GET(request, { params });
    const getData = await getResponse.json();

    if (!getData.success || !getData.data) {
      return NextResponse.json(
        { success: false, error: "複製元の書類が見つかりません" },
        { status: 404 }
      );
    }

    // 新しいIDで書類を作成
    const newDocumentId = crypto.randomUUID();
    const formData = getData.data.formData;

    // 書類タイトルに「コピー」を追加
    const updatedFormData = {
      ...formData,
      document_type: formData.document_type, // 同じ種別で複製
    };

    // 新規作成処理（既存の作成ロジックを再利用）
    const { error: createError } = await supabase.rpc("create_document_with_relations", {
      p_document_id: newDocumentId,
      p_user_id: request.headers.get("user-id"), // 認証情報から取得
      p_vehicle_id: getData.data.vehicle?.id,
      p_document_type: updatedFormData.document_type,
      p_trade_in_data: updatedFormData.tradeIn,
      p_loan_data: updatedFormData.loanCalculation,
      p_accessories_data: updatedFormData.accessories,
      p_tax_insurance_data: updatedFormData.taxInsuranceFees,
      p_legal_fees_data: updatedFormData.legalFees,
      p_processing_fees_data: updatedFormData.processingFees,
      p_sales_price_data: updatedFormData.salesPrice,
      p_shipping_data: updatedFormData.shippingInfo,
    });

    if (createError) {
      console.error("Duplicate error:", createError);
      return NextResponse.json(
        { success: false, error: "書類の複製に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        documentId: newDocumentId,
        message: "書類が正常に複製されました",
      },
    });
  } catch (error) {
    console.error("Document duplicate error:", error);
    return NextResponse.json(
      { success: false, error: "書類の複製中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

// エラーハンドリングユーティリティ
export function handleDatabaseError(error: any): string {
  if (error?.code === "23503") {
    return "関連するデータが存在しないため、操作を完了できません";
  }
  
  if (error?.code === "23505") {
    return "データの重複により、操作を完了できません";
  }
  
  if (error?.code === "42501") {
    return "この操作を実行する権限がありません";
  }
  
  return "データベースエラーが発生しました";
}

// バリデーションヘルパー
export function validateDocumentAccess(userId: string, documentUserId: string): boolean {
  // ユーザーが自分の書類にのみアクセスできるかチェック
  // 管理者権限の場合は全てアクセス可能（実装による）
  return userId === documentUserId;
}

// ログ記録ユーティリティ
export function logDocumentAction(
  action: "read" | "update" | "delete" | "duplicate",
  documentId: string,
  userId: string,
  additionalInfo?: any
) {
  console.log(`Document ${action}:`, {
    documentId,
    userId,
    timestamp: new Date().toISOString(),
    additionalInfo,
  });
}