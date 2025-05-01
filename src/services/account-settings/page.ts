// src/services/account/page.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountHandler } from "../../server/account-settings/handler";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { AccountQueryResult, UpdatePasswordData, UpdateProfileData } from "../../types/account-settings/page";

function useAccount(userId: string): AccountQueryResult {
  const { data, isLoading, error } = useQuery({
    queryKey: [...QUERY_KEYS.ACCOUNT, userId],
    queryFn: () => accountHandler.fetchAccount(userId),
    enabled: !!userId && userId.length > 0,
  });

  return {
    user: data || null,
    isLoading,
    error: error as Error | null,
  };
}

function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => accountHandler.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNT });
    },
  });
}

function useUpdatePassword() {
  return useMutation({
    mutationFn: (data: UpdatePasswordData) => accountHandler.updatePassword(data),
  });
}

export const accountService = {
  useAccount,
  useUpdateProfile,
  useUpdatePassword,
};
