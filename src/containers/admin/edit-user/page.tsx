import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editUserHandler } from "../../../server/admin/edit-user/handler";
import { editUserService } from "../../../services/admin/edit-user/page";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import EditUserComponent from "../../../components/admin/edit-user/page";

interface UserFormData {
  company_name: string;
  user_name: string;
  phone: string;
  email: string;
  password: string;
  currentPassword: string;
}

const EditUserContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  const updateUser = useMutation({
    mutationFn: (data: UserFormData) => editUserHandler.updateUser(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.USERS, id] });
    },
  });

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
      await updateUser.mutateAsync(formData);
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
      saving={updateUser.isPending}
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
