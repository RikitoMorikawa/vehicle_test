import React from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Heart } from 'lucide-react';

const FavoritesPage: React.FC = () => {
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
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>お気に入りに登録された車両はありません</p>
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

export default FavoritesPage;