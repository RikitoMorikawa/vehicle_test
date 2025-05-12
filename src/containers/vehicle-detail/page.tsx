// src/containers/vehicle-detail/page.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { vehicleDetailService } from "../../services/vehicle-detail/page";
import { favoritesService } from "../../services/favorites/page";
import { useAuth } from "../../hooks/useAuth";
import VehicleDetailComponent from "../../components/veficle-detail/page";

const VehicleDetailContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // 表示する画像を管理するステート
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // 選択中のタブを管理するステート
  const [activeTab, setActiveTab] = useState<string>("車両情報");

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

  // 画像URLs生成
  const mainImageUrl = vehicle ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/vehicle-images/${vehicle.image_path}` : "";
  const otherImagesUrls =
    vehicle && vehicle.other_images_path
      ? vehicle.other_images_path.map((path) => `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/vehicle-images/${path}`)
      : [];
  const view360Images = vehicle?.view360_images || [];

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

  // タブ切り替え処理
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // 見積書作成ボタンのハンドラ
  const handleCreateEstimate = () => {
    setActiveTab("見積書作成");
  };

  // ローン審査申込ボタンのハンドラ
  const handleApplyLoan = () => {
    navigate(`/loan-application/${id}`);
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
      selectedImage={selectedImage}
      setSelectedImage={setSelectedImage}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      mainImageUrl={mainImageUrl}
      otherImagesUrls={otherImagesUrls}
      view360Images={view360Images}
      onCreateEstimate={handleCreateEstimate}
      onApplyLoan={handleApplyLoan}
    />
  );
};

export default VehicleDetailContainer;
