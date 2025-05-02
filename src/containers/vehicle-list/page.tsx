import React, { useState } from "react";
import { vehicleService } from "../../services/vehicle/page";
import { favoritesService } from "../../services/favorites/page";
import VehicleListComponent from "../../components/vehicle-list/page";
import { useAuth } from "../../hooks/useAuth";

const VehicleListContainer: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    maker: "",
    year: "",
    mileage: "",
    sort: "newest",
  });

  const { vehicles, totalPages, isLoading, error } = vehicleService.useVehicles(currentPage, searchParams);
  const { favorites } = favoritesService.useFavorites(user?.id || "");
  const addFavorite = favoritesService.useAddFavorite();
  const removeFavorite = favoritesService.useRemoveFavorite();

  // お気に入りマップを作成
  const favoriteMap = new Map(favorites.map((fav) => [fav.id, fav.favorite_id]));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleFavorite = async (vehicleId: string) => {
    if (!user) return;

    // すでにお気に入りに追加されている場合は削除
    if (favoriteMap.has(vehicleId)) {
      const favoriteId = favoriteMap.get(vehicleId);
      if (favoriteId) {
        try {
          // ここを修正: favoriteIdのみを渡す
          await removeFavorite.mutateAsync(favoriteId);
        } catch (err) {
          console.error("Error removing favorite:", err);
        }
      }
    }
    // まだお気に入りに追加されていない場合は追加
    else {
      try {
        await addFavorite.mutateAsync({
          userId: user.id,
          vehicleId,
        });
      } catch (err) {
        console.error("Error adding favorite:", err);
      }
    }
  };

  return (
    <VehicleListComponent
      vehicles={vehicles}
      loading={isLoading} // お気に入り処理中のローディング表示は不要
      error={error ? "データの取得に失敗しました" : null}
      currentPage={currentPage}
      totalPages={totalPages}
      searchParams={searchParams}
      onSearch={handleSearch}
      onInputChange={handleInputChange}
      onPageChange={setCurrentPage}
      onToggleFavorite={handleToggleFavorite}
      favoriteVehicleIds={Array.from(favoriteMap.keys())}
    />
  );
};

export default VehicleListContainer;
