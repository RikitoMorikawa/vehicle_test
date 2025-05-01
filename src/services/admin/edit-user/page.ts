import { useQuery } from "@tanstack/react-query";
import { editUserHandler } from "../../../server/admin/edit-user/handler";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import type { User } from "../../../types/auth";

interface UserQueryResult {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

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

export const editUserService = {
  useUser,
};
