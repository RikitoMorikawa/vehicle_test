import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { accountService } from "../../services/account/page";
import AccountSettingsComponent from "../../components/account-settings/page";

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

  // Only fetch account data if we have a valid UUID
  const { isLoading: isProfileLoading } = accountService.useAccount(
    user?.id ? user.id : "" // Pass the UUID instead of email
  );

  const updateProfile = accountService.useUpdateProfile();
  const updatePassword = accountService.useUpdatePassword();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validatePasswordForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!passwordForm.currentPassword.trim()) {
      errors.currentPassword = "現在のパスワードを入力してください";
      isValid = false;
    }

    if (!passwordForm.newPassword.trim()) {
      errors.newPassword = "新しいパスワードを入力してください";
      isValid = false;
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "パスワードは8文字以上で入力してください";
      isValid = false;
    }

    if (!passwordForm.confirmPassword.trim()) {
      errors.confirmPassword = "確認用パスワードを入力してください";
      isValid = false;
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "新しいパスワードと確認用パスワードが一致しません";
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await updateProfile.mutateAsync({
        ...formData,
        id: user?.id, // Include the user's UUID in the update
      });
      setSuccess("プロフィール情報を更新しました");
      setIsEditing(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("プロフィール情報の更新に失敗しました");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validatePasswordForm()) return;

    try {
      await updatePassword.mutateAsync({
        id: user?.id, // Include the user's UUID in the password update
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
