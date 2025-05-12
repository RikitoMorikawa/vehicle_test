// src/server/loan-application/handler_000.ts

import { supabase } from "../../lib/supabase";
import { User } from "../../types/auth/page";
import type { LoanApplicationFormData } from "../../types/loan-application/page";
import { validateLoanApplication } from "../../validations/loan-application/page";

// ファイルアップロード関数（車両登録と同様のパターン）
const uploadFile = async (fileType: string, file: File | null): Promise<string | null> => {
  if (!file) return null;
  
  try {
    console.log(`Uploading ${fileType} file...`);
    
    // ファイル名をサニタイズ - 車両登録と同じ方法
    const timestamp = Date.now();
    const sanitizedFileName = `${timestamp}_${fileType}.${file.name.split('.').pop()}`;
    
    // ここでサブフォルダを使用せず、直接バケットのルートにアップロード
    console.log(`Using simplified path: ${sanitizedFileName}`);
    
    const { error } = await supabase.storage
      .from("loan-documents")
      .upload(sanitizedFileName, file, {
        cacheControl: "3600",
        upsert: true
      });
    
    if (error) {
      console.error(`File upload error (${fileType}):`, error);
      throw error;
    }
    
    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from("loan-documents")
      .getPublicUrl(sanitizedFileName);
    
    console.log(`File uploaded successfully: ${urlData.publicUrl}`);
    return urlData.publicUrl;
  } catch (err) {
    console.error(`File upload error (${fileType}):`, err);
    throw err;
  }
};

// ユーザー情報を取得する関数
const getUserInfo = async (userId: string): Promise<User | null> => {
  try {
    const { data: user, error } = await supabase.from("users").select("*").eq("id", userId).single();

    if (error || !user) {
      console.error("Error fetching user info:", error);
      return null;
    }

    return user as User;
  } catch (err) {
    console.error("Unexpected error while fetching user info:", err);
    return null;
  }
};

/**
 * ローン申請を処理するハンドラー関数
 */
const submitApplication = async (
  userId: string,
  vehicleId: string,
  formData: LoanApplicationFormData
): Promise<{ success: boolean; applicationId?: string; error?: string }> => {
  try {
    // 1. ユーザー情報の取得
    const userInfo = await getUserInfo(userId);

    if (!userInfo) {
      return {
        success: false,
        error: "ユーザー情報の取得に失敗しました。再度ログインしてください。",
      };
    }

    // 2. フォームデータのバリデーション
    const validationResult = validateLoanApplication(formData);
    if (!validationResult.success) {
      return {
        success: false,
        error: "入力内容に問題があります: " + Object.values(validationResult.errors).join(", "),
      };
    }

    // 3. ファイルのアップロード
    console.log("ファイルをアップロード中...");
    let identificationDocUrl = null;
    let incomeDocUrl = null;

    try {
      if (formData.identification_doc) {
        identificationDocUrl = await uploadFile("identification", formData.identification_doc);
      }

      if (formData.income_doc) {
        incomeDocUrl = await uploadFile("income", formData.income_doc);
      }
    } catch (uploadError) {
      console.error("ファイルアップロードエラー:", uploadError);
      // あえてエラーをスローせず、ファイルURLなしで続行することもできる
      console.log("ファイルアップロードに失敗しましたが、処理を続行します。");
    }

    // 4. 既存の申請がないか確認
    const { data: existingApplication } = await supabase
      .from("loan_applications")
      .select("id")
      .eq("user_id", userId)
      .eq("vehicle_id", vehicleId)
      .not("status", "eq", "cancelled")
      .maybeSingle();

    if (existingApplication) {
      return {
        success: false,
        error: "この車両に対するローン申請が既に存在します。",
      };
    }

    // 5. ローン申請データの保存
    console.log("ローン申請データを保存中...");

    // データベース登録用のオブジェクトを準備
    const loanApplicationData = {
      user_id: userId,
      vehicle_id: vehicleId,

      // 会社情報
      company_name: userInfo.company_name,

      // 顧客情報
      customer_name: formData.customer_name || userInfo.user_name,
      customer_name_kana: formData.customer_name_kana,
      customer_birth_date: formData.customer_birth_date,
      customer_postal_code: formData.customer_postal_code,
      customer_address: formData.customer_address,
      customer_phone: formData.customer_phone || null,
      customer_mobile_phone: formData.customer_mobile_phone || userInfo.phone,

      // 勤務先情報
      employer_name: formData.employer_name,
      employer_postal_code: formData.employer_postal_code,
      employer_address: formData.employer_address,
      employer_phone: formData.employer_phone,
      employment_type: formData.employment_type,
      years_employed: Number(formData.years_employed),
      annual_income: Number(formData.annual_income),

      // 書類URL
      identification_doc_url: identificationDocUrl,
      income_doc_url: incomeDocUrl,

      // ローン情報
      vehicle_price: Number(formData.vehicle_price),
      down_payment: Number(formData.down_payment),
      payment_months: Number(formData.payment_months),
      bonus_months: formData.bonus_months || null,
      bonus_amount: formData.bonus_amount ? Number(formData.bonus_amount) : null,

      // 連帯保証人情報
      guarantor_name: formData.guarantor_name || null,
      guarantor_name_kana: formData.guarantor_name_kana || null,
      guarantor_relationship: formData.guarantor_relationship || null,
      guarantor_phone: formData.guarantor_phone || null,
      guarantor_postal_code: formData.guarantor_postal_code || null,
      guarantor_address: formData.guarantor_address || null,

      // その他
      notes: formData.notes || null,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),

      // 申請者のメール
      contact_email: userInfo.email,
    };

    // データベースに挿入
    const { data: application, error: insertError } = await supabase.from("loan_applications").insert([loanApplicationData]).select().single();

    if (insertError) {
      console.error("データベース挿入エラー:", insertError);
      return {
        success: false,
        error: "ローン申請の保存中にエラーが発生しました。" + insertError.message,
      };
    }

    // 6. 成功レスポンス
    console.log("ローン申請が正常に送信されました:", application.id);
    return {
      success: true,
      applicationId: application.id,
    };
  } catch (error) {
    console.error("予期せぬエラー:", error);
    return {
      success: false,
      error: "サーバーエラーが発生しました。しばらく経ってからもう一度お試しください。",
    };
  }
};

export const loanApplicationHandler = {
  submitApplication,
  getUserInfo,
};
