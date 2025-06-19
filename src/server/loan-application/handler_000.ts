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
  async uploadFile(loanId: string, file: File, fileType: string): Promise<string> {
    const fileExt = file.name.split(".").pop() || "";
    const fileName = `${Date.now()}_${fileType}.${fileExt}`;
    const filePath = `${loanId}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from("loan-documents").upload(filePath, file);

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
          customer_name: formData.customer_name,
          customer_name_kana: formData.customer_name_kana,
          customer_birth_date: formData.customer_birth_date,
          customer_postal_code: formData.customer_postal_code,
          customer_address: formData.customer_address,
          customer_phone: formData.customer_phone,
          customer_mobile_phone: formData.customer_mobile_phone,
          employer_name: formData.employer_name,
          employer_postal_code: formData.employer_postal_code,
          employer_address: formData.employer_address,
          employer_phone: formData.employer_phone,
          employment_type: formData.employment_type,
          years_employed: parseInt(formData.years_employed),
          annual_income: parseInt(formData.annual_income),
          vehicle_price: parseInt(formData.vehicle_price),
          down_payment: parseInt(formData.down_payment),
          payment_months: parseInt(formData.payment_months),
          bonus_months: formData.bonus_months,
          bonus_amount: formData.bonus_amount ? parseInt(formData.bonus_amount) : null,
          guarantor_name: formData.guarantor_name,
          guarantor_name_kana: formData.guarantor_name_kana,
          guarantor_relationship: formData.guarantor_relationship,
          guarantor_phone: formData.guarantor_phone,
          guarantor_postal_code: formData.guarantor_postal_code,
          guarantor_address: formData.guarantor_address,
          notes: formData.notes,
          status: LOAN_STATUS.PENDING, // 文字列ではなく数値を使用
        })
        .select()
        .single();

      if (insertError) {
        console.error("Database insert error:", insertError);
        throw new Error(`データベース挿入エラー: ${insertError.message}`);
      }

      // ファイルがある場合はアップロード処理
      let identificationDocUrl = null;
      let incomeDocUrl = null;

      if (formData.identification_doc) {
        try {
          identificationDocUrl = await this.uploadFile(loanApplication.id, formData.identification_doc, "identification");
        } catch (uploadError) {
          console.error("Identification document upload failed:", uploadError);
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
      if (identificationDocUrl || incomeDocUrl) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: any = {};
        if (identificationDocUrl) updateData.identification_doc_url = identificationDocUrl;
        if (incomeDocUrl) updateData.income_doc_url = incomeDocUrl;

        const { error: updateError } = await supabase.from("loan_applications").update(updateData).eq("id", loanApplication.id);

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
};
