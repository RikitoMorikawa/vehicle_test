import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: user?.company_name || '',
    user_name: user?.user_name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });

  const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    setPasswordErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validatePasswordForm = async (): Promise<boolean> => {
    const errors: PasswordErrors = {};
    let isValid = true;

    try {
      const { data } = await supabase
        .from('users')
        .select('password')
        .eq('id', user?.id)
        .single();

      if (!passwordForm.currentPassword.trim()) {
        errors.currentPassword = '現在のパスワードを入力してください';
        isValid = false;
      } else if (data && passwordForm.currentPassword !== data.password) {
        errors.currentPassword = '現在のパスワードが正しくありません';
        isValid = false;
      }

      if (!passwordForm.newPassword.trim()) {
        errors.newPassword = '新しいパスワードを入力してください';
        isValid = false;
      } else if (passwordForm.newPassword.length < 8) {
        errors.newPassword = 'パスワードは8文字以上で入力してください';
        isValid = false;
      }

      if (!passwordForm.confirmPassword.trim()) {
        errors.confirmPassword = '確認用パスワードを入力してください';
        isValid = false;
      } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        errors.confirmPassword = '新しいパスワードと確認用パスワードが一致しません';
        isValid = false;
      }

      setPasswordErrors(errors);
      return isValid;
    } catch (err) {
      setError('パスワードの検証に失敗しました');
      return false;
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsProfileLoading(true);

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          company_name: formData.company_name,
          user_name: formData.user_name,
          phone: formData.phone,
          email: formData.email
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      setSuccess('プロフィール情報を更新しました');
      setIsEditing(false);
    } catch (err) {
      setError('プロフィール情報の更新に失敗しました');
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const isValid = await validatePasswordForm();
      if (!isValid) {
        setIsLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ password: passwordForm.newPassword })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      setSuccess('パスワードを更新しました');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors({});
    } catch (err) {
      setError('パスワードの更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

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
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <Input
                      label="会社名"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      disabled={!isEditing || isProfileLoading}
                    />
                    <Input
                      label="担当者名"
                      name="user_name"
                      value={formData.user_name}
                      onChange={handleInputChange}
                      disabled={!isEditing || isProfileLoading}
                    />
                    <Input
                      label="電話番号"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing || isProfileLoading}
                    />
                    <Input
                      label="メールアドレス"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
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
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <Input
                        label="現在のパスワード"
                        name="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        error={passwordErrors.currentPassword}
                        disabled={isLoading}
                      />
                      <Input
                        label="新しいパスワード"
                        name="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        error={passwordErrors.newPassword}
                        disabled={isLoading}
                      />
                      <Input
                        label="新しいパスワード（確認）"
                        name="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
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

export default AccountSettings;