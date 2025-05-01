import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountHandler } from "../../server/account/handler";
import { QUERY_KEYS } from "../../constants/queryKeys";
import type { User } from "../../types/auth";

interface AccountQueryResult {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

interface UpdateProfileData {
  id: string; // Add UUID field
  company_name: string;
  user_name: string;
  phone: string;
  email: string;
}

interface UpdatePasswordData {
  id: string; // Add UUID field
  currentPassword: string;
  newPassword: string;
}

function useAccount(userId: string): AccountQueryResult {
  const { data, isLoading, error } = useQuery({
    queryKey: [...QUERY_KEYS.ACCOUNT, userId],
    queryFn: () => accountHandler.fetchAccount(userId),
    enabled: !!userId && userId.length > 0, // Only run query if we have a valid UUID
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
