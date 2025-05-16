import { useQuery } from "@tanstack/react-query";
import { adminDashboardHandler } from "../../../server/admin/dashboard/handler_000";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { UsersQueryResult } from "../../../types/admin/dashboard/page";

function useUsers(): UsersQueryResult {
  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.USERS,
    queryFn: () => adminDashboardHandler.fetchUsers(),
  });

  return {
    users: data || [],
    isLoading,
    error: error as Error | null,
  };
}

export const adminDashboardService = {
  useUsers,
};
