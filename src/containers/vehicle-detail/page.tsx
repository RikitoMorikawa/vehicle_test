// src/containers/vehicle-detail/page.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { vehicleDetailService } from "../../services/vehicle-detail/page";
import { favoritesService } from "../../services/favorites/page";
import { useAuth } from "../../hooks/useAuth";
import VehicleDetailComponent from "../../components/veficle-detail/page";

const VehicleDetailContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // すべてのHooksは条件分岐の前に配置
  useEffect(() => {
    if (!id) {
      navigate("/vehicles");
      return;
    }
  }, [id, user?.id, navigate]);

  // IDがない場合は早期リターン
  if (!id) {
    return null;
  }

  // 車両詳細データの取得 - vehicle_imagesテーブルがないのでuseVehicleImagesは使用しない
  const { data: vehicle, isLoading: isVehicleLoading, error: vehicleError } = vehicleDetailService.useVehicleDetail(id);

  // お気に入り情報の取得
  const { favorites } = favoritesService.useFavorites(user?.id || "");
  const addFavorite = favoritesService.useAddFavorite();
  const removeFavorite = favoritesService.useRemoveFavorite();

  // お気に入り状態を確認
  const favoriteEntry = favorites.find((fav) => fav.id === id);
  const isFavorite = !!favoriteEntry;

  // お気に入り切り替え処理
  const handleToggleFavorite = async () => {
    if (!user || !id) return;

    try {
      if (isFavorite && favoriteEntry) {
        await removeFavorite.mutateAsync(favoriteEntry.favorite_id);
      } else {
        await addFavorite.mutateAsync({
          userId: user.id,
          vehicleId: id,
        });
      }
    } catch (err) {
      console.error("お気に入り処理中にエラーが発生しました:", err);
    }
  };

  // 戻るボタン処理
  const handleBack = () => {
    navigate(-1);
  };

  // 問い合わせボタン処理
  const handleInquiry = () => {
    // 問い合わせフォームへのリダイレクトや問い合わせモーダルの表示など
    navigate(`/inquiry?vehicleId=${id}`);
  };

  return (
    <VehicleDetailComponent
      vehicle={vehicle}
      loading={isVehicleLoading}
      error={vehicleError ? "車両情報の取得に失敗しました" : null}
      isFavorite={isFavorite}
      onToggleFavorite={handleToggleFavorite}
      onBack={handleBack}
      onInquiry={handleInquiry}
    />
  );
};

export default VehicleDetailContainer;
