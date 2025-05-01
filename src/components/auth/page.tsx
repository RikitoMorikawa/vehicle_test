// src/components/AuthPage.tsx
import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { AuthMode } from "../../types/enum";
import { useLoginForm, useRegisterForm } from "../../hooks/useAuthForms";

const LoginForm: React.FC = () => {
  const { formData, errors, isLoading, handleChange, handleSubmit } = useLoginForm();

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

const RegisterForm: React.FC = () => {
  const { formData, errors, isLoading, companies, registrationComplete, handleChange, handleSubmit, resetRegistration } = useRegisterForm();

  // 登録完了時の表示
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
            アカウントは現在承認待ちです。
            <br />
            管理者による承認をお待ちください。
            <br />
            承認後、ログインが可能になります。
          </p>
        </div>
        <Button type="button" variant="outline" onClick={resetRegistration} className="mt-4">
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

export default AuthContainer;
