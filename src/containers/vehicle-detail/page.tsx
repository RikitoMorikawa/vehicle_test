// src/containers/vehicle-detail/page.tsx - 管理者用注文管理統合版
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

  // 注文状況の取得（一般ユーザー用）
  const { data: orderStatus, isLoading: orderStatusLoading } = orderService.useVehicleOrderStatus(id, user?.id);

  // この直後に以下のログを追加
  console.log("🔍 FRONTEND DEBUG: orderStatus data:", orderStatus);
  console.log("🔍 FRONTEND DEBUG: user?.id:", user?.id);
  console.log("🔍 FRONTEND DEBUG: vehicle id:", id);
  console.log("🔍 FRONTEND DEBUG: orderStatusLoading:", orderStatusLoading);
  
  // 管理者用：この車両の全注文データを取得
  const { data: allOrders } = orderService.useAllOrders();
  const vehicleOrders = allOrders?.filter((order) => order.vehicle_id === id) || [];

  // 注文作成mutation
  const createOrderMutation = orderService.useCreateOrder();

  // 注文キャンセルmutation
  const cancelOrderMutation = orderService.useCancelOrder();

  // 管理者用：注文承認mutation
  const approveOrderMutation = orderService.useApproveOrder();

  // 管理者用：注文拒否mutation
  const rejectOrderMutation = orderService.useRejectOrder();

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

  // 注文ボタンのクリックハンドラー（一般ユーザー用）
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

  // 管理者用：注文承認処理
  const handleApproveOrder = async (orderId: string, adminUserId: string) => {
    try {
      await approveOrderMutation.mutateAsync({ orderId, adminUserId });

      // 関連データを再取得
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.ORDERS],
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.VEHICLE_ORDER_STATUS, id],
      });

      alert("注文を承認しました");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message || "承認処理に失敗しました");
    }
  };

  // 管理者用：注文拒否処理
  const handleRejectOrder = async (orderId: string, adminUserId: string, rejectReason?: string) => {
    try {
      await rejectOrderMutation.mutateAsync({ orderId, adminUserId, rejectReason });

      // 関連データを再取得
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.ORDERS],
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.VEHICLE_ORDER_STATUS, id],
      });

      alert("注文を拒否しました");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message || "拒否処理に失敗しました");
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
      // 注文状況の情報をコンポーネントに渡す（一般ユーザー用）
      orderStatus={orderStatus}
      orderStatusLoading={orderStatusLoading}
      isCreatingOrder={createOrderMutation.isPending}
      isCancellingOrder={cancelOrderMutation.isPending}
      // 管理者用注文管理の情報を渡す
      vehicleOrders={vehicleOrders}
      vehicleOrdersLoading={false}
      onApproveOrder={handleApproveOrder}
      onRejectOrder={handleRejectOrder}
      isProcessingOrder={approveOrderMutation.isPending || rejectOrderMutation.isPending}
    />
  );
};

export default VehicleDetailContainer;
