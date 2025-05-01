import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { editUserService } from "../../../services/admin/edit-user/page";
import EditUserComponent from "../../../components/admin/edit-user/page";
import { UserFormData } from "../../../types/admin/edit-user/page";

const EditUserContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    company_name: "",
    user_name: "",
    phone: "",
    email: "",
    password: "",
    currentPassword: "",
  });

  const { user, isLoading } = editUserService.useUser(id!);
  const updateUserMutation = editUserService.useUpdateUser();

  useEffect(() => {
    if (user) {
      setFormData({
        company_name: user.company_name || "",
        user_name: user.user_name || "",
        phone: user.phone || "",
        email: user.email || "",
        password: "",
        currentPassword: user.password || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await updateUserMutation.mutateAsync({ userId: id!, data: formData });
      setSuccess("ユーザー情報を更新しました");
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (err) {
      console.error("更新エラー:", err);
      setError(`ユーザー情報の更新に失敗しました: ${err instanceof Error ? err.message : "不明なエラー"}`);
    }
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  return (
    <EditUserComponent
      loading={isLoading}
      saving={updateUserMutation.isPending}
      error={error}
      success={success}
      formData={formData}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default EditUserContainer;
