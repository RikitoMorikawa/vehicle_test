// src/components/vehicle-detail/page.tsx
import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import { Heart, ArrowLeft } from "lucide-react";
import { Vehicle } from "../../types/vehicle";

// src/components/vehicle-detail/page.tsx の修正箇所
interface VehicleDetailComponentProps {
  vehicle?: Vehicle | null; // undefined と null の両方を許容するように修正
  vehicleImages?: Array<{ url: string }>;
  loading: boolean;
  error: string | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  onInquiry?: () => void; // 問い合わせ処理を追加
}

const VehicleDetailComponent: React.FC<VehicleDetailComponentProps> = ({ vehicle, loading, error, isFavorite, onToggleFavorite, onBack }) => {
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
            <div className="text-center text-red-600">{error || "車両が見つかりませんでした"}</div>
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
          <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </button>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative">
                <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-64 md:h-96 object-cover" />
                <button
                  onClick={onToggleFavorite}
                  className={`absolute top-4 right-4 p-3 rounded-full bg-white/80 hover:bg-white transition-colors ${isFavorite ? "text-red-600" : ""}`}
                >
                  <Heart className="h-6 w-6" fill={isFavorite ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {vehicle.maker} {vehicle.name}
                </h1>

                <div className="text-3xl font-bold text-red-600 mb-6">¥{vehicle.price.toLocaleString()}</div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">年式</h3>
                    <p className="text-gray-900">{vehicle.year}年</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">走行距離</h3>
                    <p className="text-gray-900">{vehicle.mileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">カラー</h3>
                    {/* <p className="text-gray-900">{vehicle.color || "不明"}</p> */}
                    <p className="text-gray-900">不明</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">車検</h3>
                    {/* <p className="text-gray-900">{vehicle.inspection || "不明"}</p> */}
                    <p className="text-gray-900">不明</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">車両説明</h2>
                  {/* <p className="text-gray-700 whitespace-pre-line">{vehicle.description || "詳細情報はありません。"}</p> */}
                  <p className="text-gray-700 whitespace-pre-line">詳細情報はありません。</p>
                </div>
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
