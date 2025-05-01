import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthMode, AuthFormData, FormError, Company } from "../types/auth";
import { supabase } from "../lib/supabase";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { Layers } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const AuthLayout: React.FC<{
  children: React.ReactNode;
  title: string;
  description?: string;
}> = ({ children, title, description }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 mb-4">
                <Layers className="h-6 w-6 text-teal-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
              {description && <p className="text-slate-500">{description}</p>}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
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
    const newErrors: FormError = {};
    if (!formData.email) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }
    if (!formData.password) {
      newErrors.password = "パスワードを入力してください";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setErrors({ general: "予期せぬエラーが発生しました" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{errors.general}</div>}
      <Input
        label="メールアドレス"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="例: example@example.com"
        error={errors.email}
        autoComplete="email"
        disabled={isLoading}
      />
      <Input
        label="パスワード"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        error={errors.password}
        autoComplete="current-password"
        disabled={isLoading}
      />
      <Button type="submit" fullWidth isLoading={isLoading} className="bg-red-600 hover:bg-red-700">
        ログイン
      </Button>
    </form>
  );
};

const RegisterForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
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

  React.useEffect(() => {
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
    const newErrors: FormError = {};
    if (!formData.email) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }
    if (!formData.password) {
      newErrors.password = "パスワードを入力してください";
    } else if (formData.password.length < 6) {
      newErrors.password = "パスワードは6文字以上で入力してください";
    }
    if (!formData.company_name) {
      newErrors.company_name = "会社名を選択してください";
    }
    if (!formData.user_name) {
      newErrors.user_name = "担当者名を入力してください";
    }
    if (!formData.phone) {
      newErrors.phone = "電話番号を入力してください";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const { error } = await signUp(formData.email, formData.password, {
        email: formData.email,
        company_name: formData.company_name!,
        user_name: formData.user_name!,
        phone: formData.phone!,
      });
      if (error) {
        setErrors({ general: error.message });
      } else {
        setRegistrationComplete(true);
        setFormData({
          email: "",
          password: "",
          company_name: "",
          user_name: "",
          phone: "",
        });
      }
    } catch (err) {
      setErrors({ general: "予期せぬエラーが発生しました" });
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationComplete) {
    return (
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">登録が完了しました</h3>
          <p className="text-sm text-gray-600">
            管理者による承認をお待ちください。
            <br />
            承認後、ログインが可能になります。
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => window.location.reload()} className="mt-4">
          ログイン画面に戻る
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{errors.general}</div>}
      <Input
        label="メールアドレス"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="例: example@example.com"
        error={errors.email}
        autoComplete="email"
        disabled={isLoading}
      />
      <Input
        label="パスワード"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        error={errors.password}
        autoComplete="new-password"
        disabled={isLoading}
      />
      <div className="space-y-1">
        <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
          会社名
        </label>
        <select
          id="company_name"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md ${
            errors.company_name ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isLoading}
        >
          <option value="">選択してください</option>
          {companies.map((company) => (
            <option key={company.id} value={company.name}>
              {company.name}
            </option>
          ))}
        </select>
        {errors.company_name && <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>}
      </div>
      <Input
        label="担当者名"
        type="text"
        name="user_name"
        value={formData.user_name}
        onChange={handleChange}
        placeholder="山田太郎"
        error={errors.user_name}
        disabled={isLoading}
      />
      <Input
        label="電話番号"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="03-1234-5678"
        error={errors.phone}
        disabled={isLoading}
      />
      <Button type="submit" fullWidth isLoading={isLoading} className="bg-red-600 hover:bg-red-700">
        アカウント作成
      </Button>
    </form>
  );
};

const AuthContainer: React.FC<{
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}> = ({ mode, onModeChange }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">車両販売プラットフォーム</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h1 className="text-center text-2xl font-bold text-gray-900 mb-8">{mode === AuthMode.LOGIN ? "ログイン" : "新規加盟店登録"}</h1>

          {mode === AuthMode.LOGIN ? (
            <>
              <LoginForm />
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">新規加盟店登録は</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button type="button" onClick={() => onModeChange(AuthMode.REGISTER)} className="text-red-600 hover:text-red-500 font-medium">
                    こちら
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <RegisterForm />
              <div className="mt-6 text-center text-sm">
                <span className="text-gray-500">既にアカウントをお持ちの方は</span>{" "}
                <button type="button" onClick={() => onModeChange(AuthMode.LOGIN)} className="text-red-600 hover:text-red-500 font-medium">
                  ログイン
                </button>
              </div>
            </>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">車両販売サイト会員専用ログインページ</p>
      </div>
    </div>
  );
};

const AuthPage: React.FC = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthContainer mode={mode} onModeChange={setMode} />;
};

export default AuthPage;
