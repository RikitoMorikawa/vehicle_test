import React, { useState } from "react";
import { ArrowLeft, Heart } from "lucide-react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import { VehicleDetailComponentProps } from "../../types/vehicle-detail/page";
import View360Viewer from "../ui-parts/View360Viewer";

const VehicleDetailComponent: React.FC<VehicleDetailComponentProps> = ({ vehicle, loading, error, isFavorite, onToggleFavorite, onBack }) => {
  // 表示する画像を管理するステート
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // 選択中のタブを管理するステート
  const [activeTab, setActiveTab] = useState<string>("車両情報");

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

  // メイン画像のURLを生成
  const mainImageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/vehicle-images/${vehicle.image_path}`;

  // その他の画像URLを生成
  const otherImagesUrls = vehicle.other_images_path
    ? vehicle.other_images_path.map((path) => `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/vehicle-images/${path}`)
    : [];

  // 表示する画像（選択されていなければメイン画像）
  const displayImageUrl = selectedImage || mainImageUrl;

  // 360度ビュー用の画像ファイル名を取得
  const view360Images = vehicle.view360_images || [];

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
                    <button className="flex items-center gap-1 px-6 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                      今すぐ注文
                    </button>
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

              {/* タブナビゲーション - 添付画像のように実装 */}
              <div className="border-b border-gray-200">
                <nav className="flex" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("車両情報")}
                    className={`px-6 py-4 text-center text-sm font-medium ${
                      activeTab === "車両情報" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    車両情報
                  </button>
                  <button
                    onClick={() => setActiveTab("360°ビュー")}
                    className={`px-6 py-4 text-center text-sm font-medium ${
                      activeTab === "360°ビュー" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    360°ビュー
                  </button>
                  <button
                    onClick={() => setActiveTab("車体画像ギャラリー")}
                    className={`px-6 py-4 text-center text-sm font-medium ${
                      activeTab === "車体画像ギャラリー" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    車体画像ギャラリー
                  </button>
                  <button
                    onClick={() => setActiveTab("見積書作成")}
                    className={`px-6 py-4 text-center text-sm font-medium ${
                      activeTab === "見積書作成" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    見積書作成
                  </button>
                  <button
                    onClick={() => setActiveTab("ローン審査申込")}
                    className={`px-6 py-4 text-center text-sm font-medium ${
                      activeTab === "ローン審査申込" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    ローン審査申込
                  </button>
                </nav>
              </div>

              {/* タブコンテンツ */}
              <div>
                {activeTab === "車両情報" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                    <div>
                      <div className="aspect-w-16 aspect-h-9 mb-4 h-64 md:h-80">
                        <img src={displayImageUrl} alt={`${vehicle.maker} ${vehicle.name}`} className="rounded-lg object-cover w-full h-full" />
                      </div>

                      {/* サムネイル画像の表示（メイン画像とその他の画像） */}
                      {(otherImagesUrls.length > 0 || vehicle.image_path) && (
                        <div className="grid grid-cols-5 gap-2">
                          {/* メイン画像のサムネイル */}
                          <div
                            className={`aspect-square cursor-pointer ${selectedImage === null ? "ring-2 ring-red-500" : ""}`}
                            onClick={() => setSelectedImage(null)}
                          >
                            <img
                              src={mainImageUrl}
                              alt={`${vehicle.maker} ${vehicle.name} - メイン`}
                              className="rounded-lg object-cover w-full h-full hover:opacity-80 transition-opacity"
                            />
                          </div>

                          {/* その他の画像のサムネイル */}
                          {otherImagesUrls.map((url, index) => (
                            <div
                              key={index}
                              className={`aspect-square cursor-pointer ${selectedImage === url ? "ring-2 ring-red-500" : ""}`}
                              onClick={() => setSelectedImage(url)}
                            >
                              <img
                                src={url}
                                alt={`${vehicle.maker} ${vehicle.name} - ${index + 1}`}
                                className="rounded-lg object-cover w-full h-full hover:opacity-80 transition-opacity"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">車両スペック</h2>
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
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div></div>
                            <div className="flex space-x-4">
                              <button className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                見積書作成
                              </button>
                              <button className="px-6 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                                ローン審査申込
                              </button>
                            </div>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "360°ビュー" && (
                  <div className="p-6">
                    {view360Images.length > 0 ? (
                      <View360Viewer vehicleId={vehicle.id} images={view360Images} className="max-w-3xl mx-auto" />
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
                      <h2 className="text-xl font-semibold mb-4">ローン審査申込</h2>
                      <p className="mb-4 text-gray-500">この機能は現在実装中です</p>
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
