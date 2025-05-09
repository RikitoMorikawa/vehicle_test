import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

function useUpdateUserApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, approve }: { userId: string; approve: boolean }) => adminDashboardHandler.updateUserApproval(userId, approve),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
}

export const adminDashboardService = {
  useUsers,
  useUpdateUserApproval,
};
