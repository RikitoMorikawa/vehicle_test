import React from "react";
import { useNavigate } from "react-router-dom";
import { adminDashboardService } from "../../../services/admin/dashboard/page";
import AdminDashboardComponent from "../../../components/admin/dashboard/page";

const AdminDashboardContainer: React.FC = () => {
  const navigate = useNavigate();
  const { users, isLoading, error } = adminDashboardService.useUsers();
  const updateApproval = adminDashboardService.useUpdateUserApproval();

  const handleApproval = async (userId: string, approve: boolean) => {
    try {
      await updateApproval.mutateAsync({ userId, approve });
    } catch (err) {
      console.error("Error updating user approval:", err);
    }
  };

  const handleEditUser = (userId: string) => {
    navigate(`/admin/users/${userId}/edit`);
  };

  return (
    <AdminDashboardComponent
      users={users}
      loading={isLoading}
      error={error ? "ユーザー情報の取得に失敗しました" : null}
      onApproval={handleApproval}
      onEditUser={handleEditUser}
    />
  );
};

export default AdminDashboardContainer;
