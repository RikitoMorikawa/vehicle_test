import React from "react";
import { useNavigate } from "react-router-dom";
import { adminDashboardService } from "../../../services/admin/dashboard/page";
import AdminDashboardComponent from "../../../components/admin/dashboard/page";

const AdminDashboardContainer: React.FC = () => {
  const navigate = useNavigate();
  const { users, isLoading, error } = adminDashboardService.useUsers();

  const handleEditUser = (userId: string) => {
    navigate(`/admin/users/${userId}/edit`);
  };

  return (
    <AdminDashboardComponent
      users={users}
      loading={isLoading}
      error={error ? "ユーザー情報の取得に失敗しました" : null}
      onEditUser={handleEditUser}
    />
  );
};

export default AdminDashboardContainer;
