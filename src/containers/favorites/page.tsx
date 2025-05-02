import React from "react";
import { favoritesService } from "../../services/favorites/page";
import FavoritesPage from "../../components/favorites/page";
import { useAuth } from "../../hooks/useAuth";

const FavoritesContainer: React.FC = () => {
  const { user } = useAuth();
  const { favorites, isLoading, error } = favoritesService.useFavorites(user?.id || "");
  const removeFavorite = favoritesService.useRemoveFavorite();

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      
      await removeFavorite.mutateAsync(favoriteId);
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  return (
    <FavoritesPage favorites={favorites} loading={isLoading} error={error ? "お気に入りの取得に失敗しました" : null} onRemoveFavorite={handleRemoveFavorite} />
  );
};

export default FavoritesContainer;
