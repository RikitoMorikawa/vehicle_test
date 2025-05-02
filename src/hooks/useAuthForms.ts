// src/hooks/useAuthForms.ts
import { useState, useEffect } from "react";
import { AuthFormData, FormError, Company } from "../types/auth/page";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";
import { validateLoginForm, validateRegisterForm } from "../validations/auth/page";

// ログインフォーム用フック
export const useLoginForm = () => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormError>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormError]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const result = validateLoginForm(formData);
    if (!result.success) {
      setErrors(result.errors);
    }
    return result.success;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const { error, needsApproval } = await signIn(formData.email, formData.password);
      if (error) {
        setErrors({ general: error.message });
      } else if (needsApproval) {
        setErrors({ general: "アカウントは現在承認待ちです。管理者による承認をお待ちください。" });
      }
    } catch (err) {
      console.error("ログイン中にエラーが発生しました:", err);
      setErrors({ general: "予期せぬエラーが発生しました" });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
  };
};

// 登録フォーム用フック
export const useRegisterForm = () => {
  const { signUp } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    company_name: "",
    user_name: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormError>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase.from("companies").select("id, name").order("name");
        if (error) throw error;
        setCompanies(data || []);
      } catch (err) {
        console.error("会社データの取得に失敗しました:", err);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormError]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const result = validateRegisterForm(formData);
    if (!result.success) {
      setErrors(result.errors);
    }
    return result.success;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const result = await signUp(formData.email, formData.password, {
        email: formData.email,
        company_name: formData.company_name!,
        user_name: formData.user_name!,
        phone: formData.phone!,
      });
      // エラーメッセージが含まれている場合のみエラー処理
      if (result && result.error && result.error.message) {
        setErrors({ general: result.error.message });
      } else {
        // 登録完了フラグを立てる
        setRegistrationComplete(true);
        // フォームリセット
        setFormData({
          email: "",
          password: "",
          company_name: "",
          user_name: "",
          phone: "",
        });
      }
    } catch (err) {
      console.error("登録中にエラーが発生しました:", err);
      setErrors({ general: "予期せぬエラーが発生しました" });
    } finally {
      setIsLoading(false);
    }
  };

  const resetRegistration = () => {
    setRegistrationComplete(false);
  };

  return {
    formData,
    errors,
    isLoading,
    companies,
    registrationComplete,
    handleChange,
    handleSubmit,
    resetRegistration,
  };
};
