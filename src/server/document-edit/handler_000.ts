import { supabase } from "../../lib/supabase";
import type { DocumentEditFormData } from "../../validations/document-edit/page";
import type { EstimateReport } from "../../types/report/page";

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
        console.error("Database query error:", error);
        throw new Error(`書類の取得に失敗しました: ${error.message}`);
      }

      if (!data) {
        throw new Error("書類が見つかりません");
      }

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
    } catch (error) {
      console.error("Error in fetchDocumentById:", error);
      throw error;
    }
  },

  /**
   * 書類の更新
   */
  async updateDocument(
    documentId: string,
    formData: DocumentEditFormData
  ): Promise<EstimateReport> {
    try {
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
        console.error("Database update error:", error);
        throw new Error(`書類の更新に失敗しました: ${error.message}`);
      }

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
    } catch (error) {
      console.error("Error in updateDocument:", error);
      throw error;
    }
  },

  /**
   * フォームデータの前処理
   */
  preprocessFormData(data: DocumentEditFormData): DocumentEditFormData {
    return {
      ...data,
      estimateNumber: data.estimateNumber.trim(),
      companyName: data.companyName?.trim() || "",
      customerName: data.customerName?.trim() || "",
      customerEmail: data.customerEmail?.trim() || "",
      customerPhone: data.customerPhone?.trim() || "",
      notes: data.notes?.trim() || ""
    };
  }
};
