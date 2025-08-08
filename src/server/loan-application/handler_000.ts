// src/server/loan-application/handler_000.ts
import { supabase } from "../../lib/supabase";
import type { LoanApplicationFormData } from "../../types/loan-application/page";

// ステータス定数を追加
const LOAN_STATUS = {
  PENDING: 0,
  REVIEWING: 1,
  APPROVED: 2,
  REJECTED: 3,
} as const;

export const loanApplicationHandler = {
  // 複数ファイルアップロード用の関数を追加
  async uploadMultipleFiles(loanId: string, files: File[], fileType: string): Promise<string[]> {
    const uploadPromises = files.map(async (file, index) => {
      const fileExt = file.name.split(".").pop() || "";
      const fileName = `${Date.now()}_${fileType}_${index + 1}.${fileExt}`;
      const filePath = `${loanId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("loan-documents")
        .upload(filePath, file);

      if (uploadError) {
        console.error("File upload error:", uploadError);
        throw new Error(`ファイルアップロードエラー: ${uploadError.message}`);
      }

      return filePath;
    });

    return Promise.all(uploadPromises);
  },

  async uploadFile(loanId: string, file: File, fileType: string): Promise<string> {
    const fileExt = file.name.split(".").pop() || "";
    const fileName = `${Date.now()}_${fileType}.${fileExt}`;
    const filePath = `${loanId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("loan-documents")
      .upload(filePath, file);

    if (uploadError) {
      console.error("File upload error:", uploadError);
      throw new Error(`ファイルアップロードエラー: ${uploadError.message}`);
    }

    return filePath;
  },

  async submitApplication(userId: string, vehicleId: string, formData: LoanApplicationFormData) {
    try {
      // 先にローン申請レコードを作成して ID を取得
      const { data: loanApplication, error: insertError } = await supabase
        .from("loan_applications")
        .insert({
          user_id: userId,
          vehicle_id: vehicleId,
          // 基本情報
          customer_name: formData.customer_name,
          customer_name_kana: formData.customer_name_kana,
          customer_birth_date: formData.customer_birth_date,
          customer_postal_code: formData.customer_postal_code,
          customer_address: formData.customer_address,
          customer_phone: formData.customer_phone,
          customer_mobile_phone: formData.customer_mobile_phone,

          // 居住情報
          residence_type: formData.residence_type,
          residence_years: parseInt(formData.residence_years) || 0,
          marital_status: formData.marital_status,
          family_composition: formData.family_composition || null,
          dependents_count: parseInt(formData.dependents_count) || 0,

          // 勤務先情報
          employer_name: formData.employer_name,
          employer_postal_code: formData.employer_postal_code,
          employer_address: formData.employer_address,
          employer_phone: formData.employer_phone,
          employment_type: formData.employment_type,
          years_employed: parseInt(formData.years_employed) || 0,
          annual_income: parseInt(formData.annual_income) || 0,

          // ローン情報
          vehicle_price: parseInt(formData.vehicle_price) || 0,
          down_payment: parseInt(formData.down_payment) || 0,
          payment_months: parseInt(formData.payment_months) || 0,
          bonus_months: formData.bonus_months || null,
          bonus_amount: formData.bonus_amount ? parseInt(formData.bonus_amount) : null,

          // 連帯保証人情報
          guarantor_name: formData.guarantor_name || null,
          guarantor_name_kana: formData.guarantor_name_kana || null,
          guarantor_relationship: formData.guarantor_relationship || null,
          guarantor_phone: formData.guarantor_phone || null,
          guarantor_postal_code: formData.guarantor_postal_code || null,
          guarantor_address: formData.guarantor_address || null,

          // その他
          notes: formData.notes || null,
          status: LOAN_STATUS.PENDING,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Database insert error:", insertError);
        throw new Error(`データベース挿入エラー: ${insertError.message}`);
      }

      // ファイルがある場合はアップロード処理
      let identificationDocUrls: string[] = [];
      let incomeDocUrl = null;

      // 複数の本人確認書類をアップロード
      if (formData.identification_docs && formData.identification_docs.length > 0) {
        try {
          identificationDocUrls = await this.uploadMultipleFiles(
            loanApplication.id, 
            formData.identification_docs, 
            "identification"
          );
        } catch (uploadError) {
          console.error("Identification documents upload failed:", uploadError);
          // ファイルアップロードエラーの場合はレコードを削除
          await supabase.from("loan_applications").delete().eq("id", loanApplication.id);
          throw uploadError;
        }
      }

      if (formData.income_doc) {
        try {
          incomeDocUrl = await this.uploadFile(loanApplication.id, formData.income_doc, "income");
        } catch (uploadError) {
          console.error("Income document upload failed:", uploadError);
          // ファイルアップロードエラーの場合はレコードを削除
          await supabase.from("loan_applications").delete().eq("id", loanApplication.id);
          throw uploadError;
        }
      }

      // ファイルURLを更新
      if (identificationDocUrls.length > 0 || incomeDocUrl) {
        const updateData: any = {};
        if (identificationDocUrls.length > 0) {
          // 複数URLをJSON文字列として保存
          updateData.identification_doc_url = JSON.stringify(identificationDocUrls);
        }
        if (incomeDocUrl) updateData.income_doc_url = incomeDocUrl;

        const { error: updateError } = await supabase
          .from("loan_applications")
          .update(updateData)
          .eq("id", loanApplication.id);

        if (updateError) {
          console.error("File URL update error:", updateError);
          throw new Error(`ファイルURL更新エラー: ${updateError.message}`);
        }
      }

      return { success: true, applicationId: loanApplication.id };
    } catch (error) {
      console.error("Application submission error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "申込の送信に失敗しました",
      };
    }
  },

  // 最新のローン申請ステータスを取得する関数
  async getLoanApplicationStatus(vehicleId: string, userId?: string) {
    const { data, error } = await supabase
      .from("loan_applications")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;
    return data?.[0] || null;
  },
};
