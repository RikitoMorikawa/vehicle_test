/**
 * 車両基本情報の型定義
 */
export interface Vehicle {
  id: string;
  name: string;
  maker: string;
  year: number;
  mileage: number;
  price: number;
  images: string;
  created_at?: string;
  updated_at?: string;
  imageUrl?: string;
}

/**
 * お気に入り車両の拡張型
 */
export interface FavoriteVehicle extends Vehicle {
  favorite_id: string;
}

/**
 * Supabaseからの生データの型定義
 * JOINクエリの結果構造に合わせています
 */
export interface FavoriteRawData {
  id: string;
  vehicle: Vehicle;
}

/**
 * お気に入り操作のレスポンス型
 */
export interface FavoritesResponse {
  success: boolean;
  message?: string;
  data?: FavoriteVehicle[];
  error?: string;
}

/**
 * お気に入りページの状態管理用インターフェース
 */
export interface FavoritesPageState {
  isLoading: boolean;
  favorites: FavoriteVehicle[];
  error: Error | null;
}

export interface FavoritesPageProps {
  favorites: FavoriteVehicle[];
  loading: boolean;
  error: string | null;
  onRemoveFavorite: (favoriteId: string) => void;
}

/**
 * お気に入り車両のクエリ結果型
 */
export interface FavoritesQueryResult {
  favorites: FavoriteVehicle[];
  isLoading: boolean;
  error: Error | null;
}
