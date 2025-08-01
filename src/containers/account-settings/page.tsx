import React, { useState } from "react";
import { accountService } from "../../services/account-settings/page";
import AccountSettingsComponent from "../../components/account-settings/page";
import { useAuth } from "../../hooks/useAuth";
import { validatePasswordForm, validateProfileForm } from "../../validations/account-settings/page";

const AccountSettingsContainer: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company_name: user?.company_name || "",
    user_name: user?.user_name || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { isLoading: isProfileLoading } = accountService.useAccount(user?.id ? user.id : "");
  const updateProfile = accountService.useUpdateProfile();
  const updatePassword = accountService.useUpdatePassword();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // バリデーション
    const validation = validateProfileForm(formData);
    if (!validation.success) {
      // エラーがある場合
      return;
    }

    if (!user?.id) {
      setError("ユーザーIDが見つかりません");
      return;
    }

    try {
      await updateProfile.mutateAsync({
        ...formData,
        id: user.id,
      });
      setSuccess("プロフィール情報を更新しました");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError("プロフィール情報の更新に失敗しました");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // バリデーション
    const validation = validatePasswordForm(passwordForm);
    if (!validation.success) {
      setPasswordErrors(validation.errors);
      return;
    }

    if (!user?.id) {
      setError("ユーザーIDが見つかりません");
      return;
    }

    try {
      await updatePassword.mutateAsync({
        id: user.id,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setSuccess("パスワードを更新しました");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "パスワードの更新に失敗しました");
    }
  };

  return (
    <AccountSettingsComponent
      user={user}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      isLoading={updatePassword.isPending}
      isProfileLoading={updateProfile.isPending || isProfileLoading}
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
