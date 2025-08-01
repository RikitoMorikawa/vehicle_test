// src/containers/admin/dashboard/page.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminDashboardService } from "../../../services/admin/dashboard/page";
import AdminDashboardComponent from "../../../components/admin/dashboard/page";

const AdminDashboardContainer: React.FC = () => {
  const navigate = useNavigate();

  // ページネーション状態管理
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { users, totalPages, totalItems, isLoading, error } = adminDashboardService.useUsers(currentPage, itemsPerPage);

  const handleEditUser = (userId: string) => {
    navigate(`/admin/users/${userId}/edit`);
  };

  // ページ変更ハンドラー
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <AdminDashboardComponent
      users={users}
      loading={isLoading}
      error={error ? "ユーザー情報の取得に失敗しました" : null}
      onEditUser={handleEditUser}
      // ページネーション関連のpropsを追加
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      onPageChange={handlePageChange}
    />
  );
};

export default AdminDashboardContainer;
