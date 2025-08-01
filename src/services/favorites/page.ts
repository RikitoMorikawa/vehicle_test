// src / services / favorites / page.ts;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { favoritesHandler } from "../../server/favoeites/handler_000";
import { FavoritesQueryResult } from "../../types/favorites/page";

// お気に入りの車両データを取得するカスタムフック
function useFavorites(userId: string): FavoritesQueryResult {
  const { data, isLoading, error } = useQuery({
    queryKey: [...QUERY_KEYS.FAVORITES, userId],
    queryFn: () => favoritesHandler.fetchFavorites(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュを有効に
  });

  return {
    favorites: data || [],
    isLoading,
    error: error as Error | null,
  };
}

// お気に入りの車両を追加するカスタムフック
function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, vehicleId }: { userId: string; vehicleId: string }) => favoritesHandler.addFavorite(userId, vehicleId),
    onSuccess: (_, variables) => {
      // 特定のユーザーのお気に入りデータを無効化
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.FAVORITES, variables.userId],
      });
      // 車両一覧も更新（オプション）
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.VEHICLES,
      });
    },
    onError: (error) => {
      console.error("Error adding favorite:", error);
    },
  });
}

// お気に入りの車両を削除するカスタムフック
// src/services/favorites/page.ts
function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    // ここを修正: 単一のstringパラメータを受け取るように
    mutationFn: (favoriteId: string) => favoritesHandler.removeFavorite(favoriteId),
    onSuccess: () => {
      // すべてのお気に入りクエリを無効化（ユーザーIDに関係なく）
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FAVORITES,
      });
    },
    onError: (error) => {
      console.error("Error removing favorite:", error);
    },
  });
}

export const favoritesService = {
  useFavorites,
  useAddFavorite,
  useRemoveFavorite,
};
