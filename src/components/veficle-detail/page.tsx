import React from "react";
import { ArrowLeft, Heart } from "lucide-react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import View360Viewer from "../ui-parts/vehicle-detail/View360Viewer";
import VehicleInfo from "../ui-parts/vehicle-detail/VehicleInfo";
import { Vehicle } from "../../types/db/vehicle";
import { useAuth } from "../../hooks/useAuth";
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
}) => {
  const { user } = useAuth();

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
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-red-600">¥{vehicle.price.toLocaleString()}</span>
                    <button
                      onClick={onInquiry}
                      className="flex items-center gap-1 px-6 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      今すぐ注文
                    </button>
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

                {activeTab === "見積書作成" && (
                  <div className="p-6">
                    <div className="max-w-2xl mx-auto">
                      <h2 className="text-xl font-semibold mb-4">見積書作成</h2>
                      <p className="mb-4 text-gray-500">この機能は現在実装中です</p>
                    </div>
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
