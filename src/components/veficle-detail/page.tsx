// src/components/vehicle-detail/page.tsx
import React from "react";
import { ArrowLeft, Heart } from "lucide-react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import { Vehicle } from "../../types/db/vehicle";

interface VehicleDetailComponentProps {
  vehicle?: Vehicle | null;
  loading: boolean;
  error: string | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  onInquiry?: () => void;
}

const VehicleDetailComponent: React.FC<VehicleDetailComponentProps> = ({ vehicle, loading, error, isFavorite, onToggleFavorite, onBack, onInquiry }) => {
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
                      {vehicle.year}年モデル｜走行距離：{vehicle.mileage}km｜車両ID: {vehicle.vehicle_id}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-red-600">¥{vehicle.price.toLocaleString()}</span>
                    <button
                      onClick={onToggleFavorite}
                      className={`flex items-center gap-1 px-4 py-2 rounded-md border ${
                        isFavorite ? "bg-red-50 text-red-600 border-red-300" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
                      {isFavorite ? "お気に入り" : "お気に入り"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                <div>
                  <div className="aspect-w-16 aspect-h-9 mb-4 h-64 md:h-80">
                    <img src={vehicle.imageUrl} alt={`${vehicle.maker} ${vehicle.name}`} className="rounded-lg object-cover w-full h-full" />
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="aspect-square">
                        <img
                          src={vehicle.imageUrl}
                          alt={`${vehicle.maker} ${vehicle.name} - ${index + 1}`}
                          className="rounded-lg object-cover w-full h-full cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h2>
                    <dl className="grid grid-cols-1 gap-4">
                      <div className="flex items-center py-3 border-b border-gray-200">
                        <dt className="flex items-center text-sm text-gray-500 w-32">メーカー</dt>
                        <dd className="text-sm text-gray-900">{vehicle.maker || "不明"}</dd>
                      </div>
                      <div className="flex items-center py-3 border-b border-gray-200">
                        <dt className="flex items-center text-sm text-gray-500 w-32">車名</dt>
                        <dd className="text-sm text-gray-900">{vehicle.name || "不明"}</dd>
                      </div>
                      <div className="flex items-center py-3 border-b border-gray-200">
                        <dt className="flex items-center text-sm text-gray-500 w-32">年式</dt>
                        <dd className="text-sm text-gray-900">{vehicle.year}年</dd>
                      </div>
                      <div className="flex items-center py-3 border-b border-gray-200">
                        <dt className="flex items-center text-sm text-gray-500 w-32">走行距離</dt>
                        <dd className="text-sm text-gray-900">{vehicle.mileage.toLocaleString()} km</dd>
                      </div>
                      <div className="flex items-center py-3 border-b border-gray-200">
                        <dt className="flex items-center text-sm text-gray-500 w-32">車検満了日</dt>
                        <dd className="text-sm text-gray-900">{vehicle.inspection_date || "不明"}</dd>
                      </div>
                      <div className="flex items-center py-3 border-b border-gray-200">
                        <dt className="flex items-center text-sm text-gray-500 w-32">ボディカラー</dt>
                        <dd className="text-sm text-gray-900">{vehicle.color || "不明"}</dd>
                      </div>
                      <div className="flex items-center py-3 border-b border-gray-200">
                        <dt className="flex items-center text-sm text-gray-500 w-32">排気量</dt>
                        <dd className="text-sm text-gray-900">{vehicle.engine_size ? `${vehicle.engine_size} cc` : "不明"}</dd>
                      </div>
                      <div className="flex items-center py-3 border-b border-gray-200">
                        <dt className="flex items-center text-sm text-gray-500 w-32">シフト</dt>
                        <dd className="text-sm text-gray-900">{vehicle.transmission || "不明"}</dd>
                      </div>
                      <div className="flex items-center py-3 border-b border-gray-200">
                        <dt className="flex items-center text-sm text-gray-500 w-32">駆動方式</dt>
                        <dd className="text-sm text-gray-900">{vehicle.drive_system || "不明"}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div></div>
                  <div className="flex space-x-4">
                    <button
                      onClick={onInquiry}
                      className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      見積書作成
                    </button>
                    <button className="px-6 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                      ローン審査申込
                    </button>
                  </div>
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
