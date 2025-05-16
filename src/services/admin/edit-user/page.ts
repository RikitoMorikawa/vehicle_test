// src/services/admin/edit-user/page.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { editUserHandler } from "../../../server/admin/edit-user/handler_000";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { UserQueryResult, UserFormData } from "../../../types/admin/edit-user/page";

function useUser(userId: string): UserQueryResult {
  const { data, isLoading, error } = useQuery({
    queryKey: [...QUERY_KEYS.USERS, userId],
    queryFn: () => editUserHandler.fetchUser(userId),
    enabled: !!userId,
  });

  return {
    user: data || null,
    isLoading,
    error: error as Error | null,
  };
}

function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UserFormData }) => editUserHandler.updateUser(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.USERS, variables.userId] });
    },
  });
}

function useUpdateUserApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, approve }: { userId: string; approve: boolean }) => editUserHandler.updateUserApproval(userId, approve),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.USERS, variables.userId] });
    },
  });
}

export const editUserService = {
  useUser,
  useUpdateUser,
  useUpdateUserApproval,
};