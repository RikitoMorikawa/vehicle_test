import React from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import { Heart, Pencil } from "lucide-react";
import { Vehicle } from "../../types/db/vehicle";

interface VehicleListComponentProps {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  searchParams: {
    keyword: string;
    maker: string;
    year: string;
    mileage: string;
    sort: string;
  };
  isAdmin: boolean;
  onSearch: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onPageChange: (page: number) => void;
  onToggleFavorite: (vehicleId: string) => void;
  favoriteVehicleIds: string[];
}

const VehicleListComponent: React.FC<VehicleListComponentProps> = ({
  vehicles,
  loading,
  error,
  currentPage,
  totalPages,
  totalCount,
  searchParams,
  isAdmin,
  onSearch,
  onInputChange,
  onPageChange,
  onToggleFavorite,
  favoriteVehicleIds,
}) => {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <div className="flex-1 p-8">
            <div className="text-center text-red-600">{error}</div>
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
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">車両検索</h1>
              <form onSubmit={onSearch} className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="keyword"
                    placeholder="キーワード検索..."
                    value={searchParams.keyword}
                    onChange={onInputChange}
                    className="flex-1 pl-2 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  />
                  <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                    検索
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <select
                    name="maker"
                    value={searchParams.maker}
                    onChange={onInputChange}
                    className="rounded-md py-2 pl-2 border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  >
                    <option value="">メーカー: 全て</option>
                    <option value="トヨタ">トヨタ</option>
                    <option value="日産">日産</option>
                    <option value="ホンダ">ホンダ</option>
                    <option value="スバル">スバル</option>
                  </select>
                  <select
                    name="year"
                    value={searchParams.year}
                    onChange={onInputChange}
                    className="rounded-md pl-2 border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  >
                    <option value="">年式: 指定なし</option>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <option key={year} value={year}>
                        {year}年
                      </option>
                    ))}
                  </select>
                  <select
                    name="mileage"
                    value={searchParams.mileage}
                    onChange={onInputChange}
                    className="rounded-md pl-2 border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  >
                    <option value="">走行距離: 指定なし</option>
                    <option value="0-10000">1万km未満</option>
                    <option value="10000-30000">1万km - 3万km</option>
                    <option value="30000-50000">3万km - 5万km</option>
                    <option value="50000-100000">5万km - 10万km</option>
                  </select>
                  <select
                    name="sort"
                    value={searchParams.sort}
                    onChange={onInputChange}
                    className="rounded-md pl-2 border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  >
                    <option value="newest">登録日: 新しい順</option>
                    <option value="oldest">登録日: 古い順</option>
                    <option value="price_high">価格: 高い順</option>
                    <option value="price_low">価格: 安い順</option>
                  </select>
                </div>
              </form>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-700">検索結果: {totalCount}件</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* カード全体のリンクを除去し、代わりに画像と詳細部分それぞれにリンクを設定 */}
                  <div className="relative">
                    <Link to={`/vehicle/${vehicle.id}`}>
                      <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-48 object-cover" />
                    </Link>
                    <div className="absolute top-2 right-2 flex gap-2">
                      {/* adminでない場合のみお気に入りボタンを表示 */}
                      {!isAdmin && (
                        <button
                          onClick={(e) => {
                            onToggleFavorite(vehicle.id);
                          }}
                          className={`p-2 rounded-full bg-white/80 hover:bg-white transition-colors ${
                            favoriteVehicleIds.includes(vehicle.id) ? "text-red-600" : ""
                          }`}
                        >
                          <Heart className="h-5 w-5" fill={favoriteVehicleIds.includes(vehicle.id) ? "currentColor" : "none"} />
                        </button>
                      )}
                      {isAdmin && (
                        <Link to={`/admin/vehicles/${vehicle.id}/edit`} className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors text-blue-600">
                          <Pencil className="h-5 w-5" />
                        </Link>
                      )}
                    </div>
                  </div>
                  <Link to={`/vehicle/${vehicle.id}`} className="block">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {vehicle.maker} {vehicle.name}
                      </h3>
                      <div className="text-sm text-gray-600 mb-2">
                        <span>年式: {vehicle.year}年</span>
                        <span className="mx-2">|</span>
                        <span>走行: {vehicle.mileage.toLocaleString()}km</span>
                      </div>
                      <div className="text-xl font-bold text-red-600">¥{vehicle.price.toLocaleString()}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`px-3 py-1 rounded-md ${currentPage === page ? "bg-red-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default VehicleListComponent;
