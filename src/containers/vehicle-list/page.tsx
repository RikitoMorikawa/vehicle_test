// src/containers/vehicle-list/page.tsx
import React, { useState } from "react";
import { vehicleService } from "../../services/vehicle-list/page";
import { favoritesService } from "../../services/favorites/page";
import VehicleListComponent from "../../components/vehicle-list/page";
import { useAuth } from "../../hooks/useAuth";

const VehicleListContainer: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const isAdmin = user?.role === "admin";

  // キーワード入力用の状態
  const [keyword, setKeyword] = useState("");

  // 実際の検索に使用する状態
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    maker: "",
    year: "",
    mileage: "",
    sort: "newest",
  });

  const { vehicles, totalPages, totalCount, isLoading, error } = vehicleService.useVehicles(currentPage, searchParams);
  const { favorites } = favoritesService.useFavorites(user?.id || "");
  const addFavorite = favoritesService.useAddFavorite();
  const removeFavorite = favoritesService.useRemoveFavorite();

  // お気に入りマップを作成
  const favoriteMap = new Map(favorites.map((fav) => [fav.id, fav.favorite_id]));

  // 検索ボタン押下時の処理
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // キーワードを検索パラメータに反映
    setSearchParams((prev) => ({ ...prev, keyword }));
    // ページを1に戻す
    setCurrentPage(1);
  };

  // 入力値の変更処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // キーワード入力は状態のみ更新（検索は実行しない）
    if (name === "keyword") {
      setKeyword(value);
      return;
    }

    // キーワード以外の変更は即時検索実行
    setSearchParams((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // ページを1に戻す
  };

  const handleToggleFavorite = async (vehicleId: string) => {
    if (!user) return;

    if (favoriteMap.has(vehicleId)) {
      const favoriteId = favoriteMap.get(vehicleId);
      if (favoriteId) {
        try {
          await removeFavorite.mutateAsync(favoriteId);
        } catch (err) {
          console.error("Error removing favorite:", err);
        }
      }
    } else {
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

  // 表示用のパラメータ（キーワードは入力中の値を表示、他は検索パラメータを表示）
  const displayParams = {
    ...searchParams,
    keyword,
  };

  return (
    <VehicleListComponent
      vehicles={vehicles}
      loading={isLoading}
      error={error ? "データの取得に失敗しました" : null}
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={totalCount}
      searchParams={displayParams}
      isAdmin={isAdmin}
      onSearch={handleSearch}
      onInputChange={handleInputChange}
      onPageChange={setCurrentPage}
      onToggleFavorite={handleToggleFavorite}
      favoriteVehicleIds={Array.from(favoriteMap.keys())}
    />
  );
};

export default VehicleListContainer;
