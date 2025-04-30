import React, { useState } from 'react';
import AccountSettingsComponent from '../../components/account-settings/page';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const AccountSettingsContainer: React.FC = () => {
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

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordErrors, setPasswordErrors] = useState({});
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
    const errors: Record<string, string> = {};
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
    <AccountSettingsComponent
      user={user}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      isLoading={isLoading}
      isProfileLoading={isProfileLoading}
      formData={formData}
      passwordForm={passwordForm}
      passwordErrors={passwordErrors}
      error={error}
      success={success}
      onInputChange={handleInputChange}
      onPasswordChange={handlePasswordChange}
      onProfileSubmit={handleProfileSubmit}
      onPasswordSubmit={handlePasswordSubmit}
    />
  );
};

export default AccountSettingsContainer;