import React from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { User } from '../../types/auth';

interface AccountSettingsComponentProps {
  user: User | null;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  isLoading: boolean;
  isProfileLoading: boolean;
  formData: {
    company_name: string;
    user_name: string;
    phone: string;
    email: string;
  };
  passwordForm: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  passwordErrors: Record<string, string>;
  error: string | null;
  success: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProfileSubmit: (e: React.FormEvent) => void;
  onPasswordSubmit: (e: React.FormEvent) => void;
}

const AccountSettingsComponent: React.FC<AccountSettingsComponentProps> = ({
  user,
  isEditing,
  setIsEditing,
  isLoading,
  isProfileLoading,
  formData,
  passwordForm,
  passwordErrors,
  error,
  success,
  onInputChange,
  onPasswordChange,
  onProfileSubmit,
  onPasswordSubmit
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl font-semibold text-gray-900">アカウント設定</h1>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'キャンセル' : 'アカウント管理'}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="px-6 py-4 bg-green-50 border-b border-green-200">
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">プロフィール情報</h2>
                <form onSubmit={onProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <Input
                      label="会社名"
                      name="company_name"
                      value={formData.company_name}
                      onChange={onInputChange}
                      disabled={!isEditing || isProfileLoading}
                    />
                    <Input
                      label="担当者名"
                      name="user_name"
                      value={formData.user_name}
                      onChange={onInputChange}
                      disabled={!isEditing || isProfileLoading}
                    />
                    <Input
                      label="電話番号"
                      name="phone"
                      value={formData.phone}
                      onChange={onInputChange}
                      disabled={!isEditing || isProfileLoading}
                    />
                    <Input
                      label="メールアドレス"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={onInputChange}
                      disabled={!isEditing || isProfileLoading}
                    />
                  </div>
                  {isEditing && (
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        isLoading={isProfileLoading}
                      >
                        保存
                      </Button>
                    </div>
                  )}
                </form>

                <div className="mt-10 pt-10 border-t border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">パスワード変更</h2>
                  <form onSubmit={onPasswordSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <Input
                        label="現在のパスワード"
                        name="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={onPasswordChange}
                        error={passwordErrors.currentPassword}
                        disabled={isLoading}
                      />
                      <Input
                        label="新しいパスワード"
                        name="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={onPasswordChange}
                        error={passwordErrors.newPassword}
                        disabled={isLoading}
                      />
                      <Input
                        label="新しいパスワード（確認）"
                        name="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={onPasswordChange}
                        error={passwordErrors.confirmPassword}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        type="submit"
                        isLoading={isLoading}
                      >
                        パスワードを変更
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AccountSettingsComponent;