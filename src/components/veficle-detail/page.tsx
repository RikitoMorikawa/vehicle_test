// src/components/veficle-detail/page.tsx - 管理者用注文管理統合版
import { ArrowLeft, Heart } from "lucide-react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import View360Viewer from "../ui-parts/vehicle-detail/View360Viewer";
import VehicleInfo from "../ui-parts/vehicle-detail/VehicleInfo";
import VehicleDocuments from "../ui-parts/vehicle-detail/VehicleDocuments";
import AdminOrderManagement from "../ui-parts/vehicle-detail/AdminOrderManagement";
import { Vehicle } from "../../types/db/vehicle";
import { useAuth } from "../../hooks/useAuth";
import { VehicleOrderStatus, OrderData } from "../../server/orders/handler_000";
import LoanApplicationStatusView from "../ui-parts/vehicle-detail/LoanApplicationStatus";

interface VehicleDetailComponentProps {
  vehicle: Vehicle | null | undefined;
  loading: boolean;
  error: string | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  onInquiry: () => void;
  selectedImage: string | null;
  setSelectedImage: (url: string | null) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  mainImageUrl: string;
  otherImagesUrls: string[];
  view360Images: string[];
  onCreateEstimate: () => void;
  onApplyLoan: () => void;
  isAdmin?: boolean;
  // 注文状況関連のprops
  orderStatus?: VehicleOrderStatus;
  orderStatusLoading?: boolean;
  isCreatingOrder?: boolean;
  isCancellingOrder?: boolean;
  // 管理者用注文管理のprops
  vehicleOrders?: OrderData[];
  vehicleOrdersLoading?: boolean;
  onApproveOrder?: (orderId: string, adminUserId: string) => void;
  onRejectOrder?: (orderId: string, adminUserId: string, rejectReason?: string) => void;
  isProcessingOrder?: boolean;
}

const VehicleDetailComponent: React.FC<VehicleDetailComponentProps> = ({
  vehicle,
  loading,
  error,
  isFavorite,
  onToggleFavorite,
  onBack,
  onInquiry,
  selectedImage,
  setSelectedImage,
  activeTab,
  onTabChange,
  mainImageUrl,
  otherImagesUrls,
  view360Images,
  onCreateEstimate,
  onApplyLoan,
  isAdmin,
  orderStatus,
  orderStatusLoading,
  isCreatingOrder,
  isCancellingOrder,
  vehicleOrders,
  onApproveOrder,
  onRejectOrder,
  isProcessingOrder,
}) => {
  const { user } = useAuth();

  // 注文ボタンの表示内容を決定
  const getOrderButtonConfig = () => {
    if (!user) {
      return {
        text: "ログインして注文",
        disabled: true,
        bgColor: "bg-gray-400",
        hoverColor: "hover:bg-gray-500",
      };
    }

    if (orderStatusLoading) {
      return {
        text: "読み込み中...",
        disabled: true,
        bgColor: "bg-gray-400",
        hoverColor: "hover:bg-gray-500",
      };
    }

    if (!orderStatus?.isAvailable) {
      return {
        text: "注文不可",
        disabled: true,
        bgColor: "bg-gray-400",
        hoverColor: "hover:bg-gray-500",
      };
    }

    switch (orderStatus?.userOrderStatus) {
      case 0: // pending
        return {
          text: "注文依頼中（キャンセル）",
          disabled: false,
          bgColor: "bg-orange-600",
          hoverColor: "hover:bg-orange-700",
        };
      case 1: // approved
        return {
          text: "購入済み",
          disabled: true,
          bgColor: "bg-gray-400",
          hoverColor: "hover:bg-gray-500",
        };
      case 2: // rejected
        return {
          text: "再注文する",
          disabled: false,
          bgColor: "bg-blue-600",
          hoverColor: "hover:bg-blue-700",
        };
      case 3: // cancelled
        return {
          text: "再注文する",
          disabled: false,
          bgColor: "bg-blue-600",
          hoverColor: "hover:bg-blue-700",
        };
      default: // 注文なし
        return {
          text: "今すぐ注文",
          disabled: false,
          bgColor: "bg-red-600",
          hoverColor: "hover:bg-red-700",
        };
    }
  };

  const buttonConfig = getOrderButtonConfig();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-red-600">{error || "車両情報が見つかりません"}</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </button>

              <nav className="text-sm mt-4" aria-label="Breadcrumb">
                <ol className="list-none p-0 inline-flex">
                  <li className="flex items-center">
                    <a href="/vehicles" className="text-gray-500 hover:text-gray-700">
                      車両一覧
                    </a>
                    <span className="mx-2 text-gray-400">/</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-gray-900">
                      {vehicle.maker} {vehicle.name}
                    </span>
                  </li>
                </ol>
              </nav>
            </div>

            {/* 管理者用注文管理セクション */}
            {isAdmin && vehicleOrders && (
              <div className="mb-6">
                <AdminOrderManagement
                  vehicleId={vehicle.id}
                  orders={vehicleOrders}
                  onApproveOrder={onApproveOrder!}
                  onRejectOrder={onRejectOrder!}
                  isProcessing={isProcessingOrder || false}
                  currentAdminId={user?.id || ""}
                />
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {vehicle.maker} {vehicle.name}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                      {vehicle.year}年モデル｜走行距離：{vehicle.mileage.toLocaleString()}km｜車両ID: {vehicle.vehicle_id || vehicle.id}
                    </p>
                    {/* 注文状況表示（一般ユーザー用） */}
                    {!isAdmin && orderStatus?.userOrderStatus !== undefined && (
                      <div className="mt-2">
                        {orderStatus.userOrderStatus === 0 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">注文依頼中</span>
                        )}
                        {orderStatus.userOrderStatus === 1 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">注文承認済み</span>
                        )}
                        {orderStatus.userOrderStatus === 2 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            注文拒否済み
                            {orderStatus.rejectReason && <span className="ml-2 text-xs">({orderStatus.rejectReason})</span>}
                          </span>
                        )}
                        {orderStatus.userOrderStatus === 3 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            注文キャンセル済み
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-red-600">¥{vehicle.price.toLocaleString()}</span>

                    {/* 注文ボタン（一般ユーザー用） */}
                    {!isAdmin && (
                      <button
                        onClick={onInquiry}
                        disabled={buttonConfig.disabled || isCreatingOrder || isCancellingOrder}
                        className={`flex items-center gap-1 px-6 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          buttonConfig.disabled || isCreatingOrder || isCancellingOrder
                            ? "bg-gray-400 cursor-not-allowed"
                            : `${buttonConfig.bgColor} ${buttonConfig.hoverColor} focus:ring-red-500`
                        }`}
                      >
                        {isCreatingOrder || isCancellingOrder ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                            処理中...
                          </>
                        ) : (
                          buttonConfig.text
                        )}
                      </button>
                    )}

                    {!isAdmin && (
                      <button
                        onClick={onToggleFavorite}
                        className={`flex items-center gap-1 px-4 py-2 rounded-md border ${
                          isFavorite ? "bg-red-50 text-red-600 border-red-300" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
                        {isFavorite ? "お気に入り" : "お気に入り"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* タブナビゲーション */}
              <div className="border-b border-gray-200">
                <nav className="flex" aria-label="Tabs">
                  <button
                    onClick={() => onTabChange("車両情報")}
                    className={`px-6 py-4 text-center text-sm font-medium ${
                      activeTab === "車両情報" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    車両情報
                  </button>
                  <button
                    onClick={() => onTabChange("360°ビュー")}
                    className={`px-6 py-4 text-center text-sm font-medium ${
                      activeTab === "360°ビュー" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    360°ビュー
                  </button>
                  <button
                    onClick={() => onTabChange("車体画像ギャラリー")}
                    className={`px-6 py-4 text-center text-sm font-medium ${
                      activeTab === "車体画像ギャラリー" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    車体画像ギャラリー
                  </button>
                  {!isAdmin && (
                    <button
                      onClick={() => onTabChange("各種資料")}
                      className={`px-6 py-4 text-center text-sm font-medium ${
                        activeTab === "各種資料" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      各種資料
                    </button>
                  )}
                  {!isAdmin && (
                    <button
                      onClick={() => onTabChange("ローン審査申込")}
                      className={`px-6 py-4 text-center text-sm font-medium ${
                        activeTab === "ローン審査申込" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      ローン審査申込
                    </button>
                  )}
                </nav>
              </div>

              {/* タブコンテンツ */}
              <div>
                {activeTab === "車両情報" && (
                  <VehicleInfo
                    vehicle={vehicle}
                    mainImageUrl={mainImageUrl}
                    otherImagesUrls={otherImagesUrls}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    onCreateEstimate={onCreateEstimate}
                    onApplyLoan={onApplyLoan}
                  />
                )}

                {activeTab === "360°ビュー" && (
                  <div className="p-6">
                    {view360Images.length > 0 ? (
                      <View360Viewer vehicleId={vehicle.id} images={view360Images} className="max-w-3xl mx-auto" isActive={activeTab === "360°ビュー"} />
                    ) : (
                      <div className="p-12 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-gray-500">この車両の360度ビュー画像はありません</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "車体画像ギャラリー" && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <img src={mainImageUrl} alt={`${vehicle.maker} ${vehicle.name}`} className="w-full h-64 object-cover rounded-lg" />
                      {otherImagesUrls.map((url, index) => (
                        <img key={index} src={url} alt={`${vehicle.maker} ${vehicle.name} - ${index + 1}`} className="w-full h-64 object-cover rounded-lg" />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "各種資料" && user && (
                  <div className="p-6">
                    <VehicleDocuments vehicleId={vehicle.id} userId={user.id} />
                  </div>
                )}

                {activeTab === "ローン審査申込" && (
                  <div className="p-6">
                    <div className="max-w-2xl mx-auto">
                      {user ? (
                        <LoanApplicationStatusView userId={user.id} vehicleId={vehicle.id} />
                      ) : (
                        <div className="p-6 bg-gray-50 rounded-lg">
                          <p className="text-gray-600">ローン審査状況を確認するにはログインが必要です</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default VehicleDetailComponent;
