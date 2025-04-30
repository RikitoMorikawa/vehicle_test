import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Vehicle } from '../types/vehicle';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { Heart } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

const VehicleList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    maker: '',
    year: '',
    mileage: '',
    sort: 'newest'
  });

  const getImageUrl = (imagePath: string) => {
    const { data } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(imagePath);
    return data.publicUrl;
  };

  const fetchVehicles = async () => {
    try {
      let query = supabase
        .from('vehicles')
        .select('*', { count: 'exact' });

      // Apply search filters
      if (searchParams.keyword) {
        query = query.or(`name.ilike.%${searchParams.keyword}%,maker.ilike.%${searchParams.keyword}%`);
      }
      if (searchParams.maker) {
        query = query.eq('maker', searchParams.maker);
      }
      if (searchParams.year) {
        query = query.eq('year', parseInt(searchParams.year));
      }
      if (searchParams.mileage) {
        const [min, max] = searchParams.mileage.split('-').map(Number);
        query = query.gte('mileage', min).lte('mileage', max);
      }

      // Apply sorting
      switch (searchParams.sort) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
      }

      // Apply pagination
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      query = query.range(start, start + ITEMS_PER_PAGE - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      // 画像のURLを取得
      const vehiclesWithImageUrls = data?.map(vehicle => ({
        ...vehicle,
        imageUrl: getImageUrl(vehicle.image_path)
      })) || [];

      setVehicles(vehiclesWithImageUrls);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('車両データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [currentPage, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchVehicles();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

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
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="keyword"
                    placeholder="キーワード検索..."
                    value={searchParams.keyword}
                    onChange={handleInputChange}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    検索
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <select
                    name="maker"
                    value={searchParams.maker}
                    onChange={handleInputChange}
                    className="rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
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
                    onChange={handleInputChange}
                    className="rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  >
                    <option value="">年式: 指定なし</option>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}年</option>
                    ))}
                  </select>
                  <select
                    name="mileage"
                    value={searchParams.mileage}
                    onChange={handleInputChange}
                    className="rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
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
                    onChange={handleInputChange}
                    className="rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
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
              <div className="text-sm text-gray-700">
                検索結果: {vehicles.length}件
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative">
                    <img
                      src={vehicle.imageUrl}
                      alt={vehicle.name}
                      className="w-full h-48 object-cover"
                    />
                    <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white">
                      <Heart className="h-5 w-5 text-red-600" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {vehicle.maker} {vehicle.name}
                    </h3>
                    <div className="text-sm text-gray-600 mb-2">
                      <span>年式: {vehicle.year}年</span>
                      <span className="mx-2">|</span>
                      <span>走行: {vehicle.mileage.toLocaleString()}km</span>
                    </div>
                    <div className="text-xl font-bold text-red-600">
                      ¥{vehicle.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === page
                          ? 'bg-red-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
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

export default VehicleList;