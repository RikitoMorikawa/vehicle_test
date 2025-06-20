// src/containers/vehicle-detail/page.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { vehicleDetailService } from "../../services/vehicle-detail/page";
import { favoritesService } from "../../services/favorites/page";
import { orderService } from "../../services/orders/page";
import { useAuth } from "../../hooks/useAuth";
import { QUERY_KEYS } from "../../constants/queryKeys";
import VehicleDetailComponent from "../../components/veficle-detail/page";

const VehicleDetailContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "admin";

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

  // 車両詳細データの取得
  const { data: vehicle, isLoading: isVehicleLoading, error: vehicleError } = vehicleDetailService.useVehicleDetail(id);

  // 注文状況の取得
  const { data: orderStatus, isLoading: orderStatusLoading } = orderService.useVehicleOrderStatus(id, user?.id);

  // 注文作成mutation
  const createOrderMutation = orderService.useCreateOrder();

  // 注文キャンセルmutation
  const cancelOrderMutation = orderService.useCancelOrder();

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

  // 注文ボタンのクリックハンドラー（修正版）
  const handleInquiry = async () => {
    if (!user) {
      alert("ログインが必要です");
      return;
    }

    if (!vehicle || !id) return;

    try {
      // ユーザーの注文状況に応じて処理を分岐
      if (orderStatus?.userOrderStatus === 0) {
        // pending中 → キャンセル
        if (orderStatus.userOrderId) {
          if (confirm("注文依頼をキャンセルしますか？")) {
            await cancelOrderMutation.mutateAsync({
              orderId: orderStatus.userOrderId,
              userId: user.id,
            });

            // 注文状況を再取得
            queryClient.invalidateQueries({
              queryKey: [...QUERY_KEYS.VEHICLE_ORDER_STATUS, id],
            });

            alert("注文をキャンセルしました");
          }
        }
      } else {
        // 新規注文 or 再注文
        if (confirm("この車両を注文しますか？")) {
          await createOrderMutation.mutateAsync({
            userId: user.id,
            vehicleId: id,
          });

          // 注文状況を再取得
          queryClient.invalidateQueries({
            queryKey: [...QUERY_KEYS.VEHICLE_ORDER_STATUS, id],
          });

          alert("注文依頼を送信しました。管理者の承認をお待ちください。");
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message || "処理に失敗しました");
    }
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
      isAdmin={isAdmin}
      // 注文状況の情報をコンポーネントに渡す
      orderStatus={orderStatus}
      orderStatusLoading={orderStatusLoading}
      isCreatingOrder={createOrderMutation.isPending}
      isCancellingOrder={cancelOrderMutation.isPending}
    />
  );
};

export default VehicleDetailContainer;
