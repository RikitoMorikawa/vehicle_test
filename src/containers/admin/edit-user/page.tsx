import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { editUserService } from "../../../services/admin/edit-user/page";
import EditUserComponent from "../../../components/admin/edit-user/page";
import { validateEditUserForm, validatePasswordUpdate } from "../../../validations/admin/edit-user/page";
import type { UserFormData } from "../../../types/admin/edit-user/page";

const EditUserContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    message: "",
    action: () => {},
  });

  const [formData, setFormData] = useState<UserFormData>({
    company_name: "",
    user_name: "",
    phone: "",
    email: "",
    password: undefined,
    currentPassword: undefined,
    is_approved: false,
  });

  const { user, isLoading } = editUserService.useUser(id!);
  const updateUserMutation = editUserService.useUpdateUser();
  const updateApprovalMutation = editUserService.useUpdateUserApproval();

  useEffect(() => {
    if (user) {
      setFormData({
        company_name: user.company_name || "",
        user_name: user.user_name || "",
        phone: user.phone || "",
        email: user.email || "",
        password: undefined,
        currentPassword: user.password || "",
        is_approved: user.is_approved || false,
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    // フォームのバリデーション
    const validation = validateEditUserForm(formData);
    if (!validation.success) {
      setError(Object.values(validation.errors)[0]);
      return false;
    }

    // パスワードが入力されている場合は追加のバリデーション
    if (formData.password) {
      const passwordValidation = validatePasswordUpdate({
        currentPassword: formData.currentPassword || "",
        password: formData.password,
      });
      if (!passwordValidation.success) {
        setError(Object.values(passwordValidation.errors)[0]);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // バリデーションを実行
    if (!validateForm()) {
      return;
    }

    // ダイアログを表示
    setDialogConfig({
      title: "ユーザー情報の更新",
      message: "ユーザー情報を更新してもよろしいですか？",
      action: async () => {
        try {
          await updateUserMutation.mutateAsync({
            userId: id!,
            data: {
              company_name: formData.company_name,
              user_name: formData.user_name,
              phone: formData.phone,
              email: formData.email,
              password: formData.password,
              is_approved: formData.is_approved,
            },
          });
          setSuccess("ユーザー情報を更新しました");
          setTimeout(() => {
            navigate("/admin");
          }, 2000);
        } catch (err) {
          console.error("更新エラー:", err);
          setError(`ユーザー情報の更新に失敗しました: ${err instanceof Error ? err.message : "不明なエラー"}`);
        }
        setShowDialog(false);
      },
    });
    setShowDialog(true);
  };

  const handleApproval = async (approve: boolean) => {
    if (!id) return;

    setDialogConfig({
      title: approve ? "ユーザー承認" : "承認取消",
      message: approve ? "このユーザーを承認してもよろしいですか？" : "このユーザーの承認を取り消してもよろしいですか？",
      action: async () => {
        try {
          await updateApprovalMutation.mutateAsync({ userId: id, approve });
          setSuccess(approve ? "ユーザーを承認しました" : "ユーザーの承認を取り消しました");
          setFormData((prev) => ({ ...prev, is_approved: approve }));
        } catch (err) {
          console.error("承認状態の更新エラー:", err);
          setError(`承認状態の更新に失敗しました: ${err instanceof Error ? err.message : "不明なエラー"}`);
        }
        setShowDialog(false);
      },
    });
    setShowDialog(true);
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  return (
    <>
      <EditUserComponent
        loading={isLoading}
        saving={updateUserMutation.isPending}
        error={error}
        success={success}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onApproval={handleApproval}
        isApprovingUser={updateApprovalMutation.isPending}
        showDialog={showDialog}
        dialogConfig={dialogConfig}
        onCloseDialog={() => setShowDialog(false)}
      />
    </>
  );
};

export default EditUserContainer;
