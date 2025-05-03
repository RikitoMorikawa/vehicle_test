import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import { Heart, Trash2 } from "lucide-react";
import { FavoritesPageProps } from "../../types/favorites/page";
import { Link } from "react-router-dom";

const FavoritesPage: React.FC<FavoritesPageProps> = ({ favorites, loading, error, onRemoveFavorite }) => {
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">お気に入り一覧</h1>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {favorites.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>お気に入りに登録された車両はありません</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((vehicle) => (
                  <div key={vehicle.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="relative">
                      <Link to={`/vehicle/${vehicle.id}`} className="block">
                        <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-48 object-cover" />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onRemoveFavorite(vehicle.favorite_id);
                        }}
                        className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
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
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default FavoritesPage;
