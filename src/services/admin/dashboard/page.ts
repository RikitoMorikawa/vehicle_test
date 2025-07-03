// src/services/admin/dashboard/page.ts
import { useQuery } from "@tanstack/react-query";
import { adminDashboardHandler } from "../../../server/admin/dashboard/handler_000";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { UsersQueryResult } from "../../../types/admin/dashboard/page";

// ページネーション対応のfetchUsersを使用
function useUsers(page: number = 1, itemsPerPage: number = 10): UsersQueryResult {
  const { data, isLoading, error } = useQuery({
    queryKey: [...QUERY_KEYS.USERS, page, itemsPerPage],
    queryFn: () => adminDashboardHandler.fetchUsers(page, itemsPerPage),
  });

  return {
    users: data?.users || [],
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    totalItems: data?.totalItems || 0,
    itemsPerPage: data?.itemsPerPage || 10,
    isLoading,
    error: error as Error | null,
  };
}

export const adminDashboardService = {
  useUsers,
};
