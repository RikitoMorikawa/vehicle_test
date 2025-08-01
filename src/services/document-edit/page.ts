import { supabase } from "../../lib/supabase";
import type { EstimateReport } from "../../types/report/page";
import type { DocumentEditFormData } from "../../validations/document-edit/page";

class DocumentEditService {
  /**
   * 書類の詳細を取得
   */
  async getDocument(documentId: string): Promise<EstimateReport> {
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
        estimate_number,
        company_name,
        customer_name,
        customer_email,
        customer_phone,
        delivery_date,
        valid_until,
        notes,
        tax_rate,
        sales_prices!inner(payment_total),
        users:user_id(company_name)
      `)
      .eq("id", documentId)
      .single();

    if (error) {
      throw new Error(`書類の取得に失敗しました: ${error.message}`);
    }

    if (!data) {
      throw new Error("書類が見つかりません");
    }

    // データを EstimateReport 形式に変換
    const totalAmount = data.sales_prices?.[0]?.payment_total || 0;
    const companyName = data.users?.[0]?.company_name || data.company_name || "";

    return {
      id: data.id,
      estimateNumber: data.estimate_number || `EST-${data.id.slice(0, 8).toUpperCase()}`,
      user_id: data.user_id,
      vehicle_id: data.vehicle_id,
      vehicleInfo: {
        maker: data.maker,
        name: data.name,
        year: data.year,
      },
      document_type: data.document_type,
      companyName,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      deliveryDate: data.delivery_date,
      validUntil: data.valid_until,
      notes: data.notes,
      taxRate: data.tax_rate,
      totalAmount,
      createdAt: data.created_at,
      status: "completed" as const,
    };
  }

  /**
   * 書類の更新
   */
  async updateDocument(
    documentId: string, 
    formData: DocumentEditFormData
  ): Promise<EstimateReport> {
    const updateData = {
      estimate_number: formData.estimateNumber,
      company_name: formData.companyName,
      customer_name: formData.customerName,
      customer_email: formData.customerEmail,
      customer_phone: formData.customerPhone,
      delivery_date: formData.deliveryDate || null,
      valid_until: formData.validUntil || null,
      notes: formData.notes,
      tax_rate: formData.taxRate,
      document_type: formData.documentType,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("estimate_vehicles")
      .update(updateData)
      .eq("id", documentId)
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
        estimate_number,
        company_name,
        customer_name,
        customer_email,
        customer_phone,
        delivery_date,
        valid_until,
        notes,
        tax_rate,
        sales_prices!inner(payment_total),
        users:user_id(company_name)
      `)
      .single();

    if (error) {
      throw new Error(`書類の更新に失敗しました: ${error.message}`);
    }

    // データを EstimateReport 形式に変換
    const totalAmount = data.sales_prices?.[0]?.payment_total || 0;
    const companyName = data.users?.[0]?.company_name || data.company_name || "";

    return {
      id: data.id,
      estimateNumber: data.estimate_number || `EST-${data.id.slice(0, 8).toUpperCase()}`,
      user_id: data.user_id,
      vehicle_id: data.vehicle_id,
      vehicleInfo: {
        maker: data.maker,
        name: data.name,
        year: data.year,
      },
      document_type: data.document_type,
      companyName,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      deliveryDate: data.delivery_date,
      validUntil: data.valid_until,
      notes: data.notes,
      taxRate: data.tax_rate,
      totalAmount,
      createdAt: data.created_at,
      status: "completed" as const,
    };
  }
}

export const documentEditService = new DocumentEditService();
