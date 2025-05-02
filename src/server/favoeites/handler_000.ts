import { supabase } from "../../lib/supabase";
import { FavoriteVehicle } from "../../types/favorites/page";

export const favoritesHandler = {
  async fetchFavorites(userId: string): Promise<FavoriteVehicle[]> {
    const { data, error } = await supabase
      .from("favorites")
      .select(
        `
        id,
        vehicle:vehicles(*)
      `
      )
      .eq("user_id", userId);

    if (error) throw error;
    if (!data) return [];

    // デバッグ用
    console.log("Supabase response:", JSON.stringify(data, null, 2));

    return data
      .map((item) => {
        // vehicleが配列の場合は最初の要素を取得
        const vehicleData = Array.isArray(item.vehicle) ? item.vehicle[0] : item.vehicle;

        // 必要なプロパティの存在確認
        if (!vehicleData || !vehicleData.id || !vehicleData.image_path) {
          console.error("Invalid vehicle data:", vehicleData);
          return null;
        }

        return {
          ...vehicleData,
          favorite_id: item.id,
          imageUrl: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/vehicle-images/${vehicleData.image_path}`,
        } as FavoriteVehicle;
      })
      .filter(Boolean) as FavoriteVehicle[]; // nullを除外
  },

  // 他のメソッドは変更なし
  async addFavorite(userId: string, vehicleId: string): Promise<void> {
    const { error } = await supabase.from("favorites").insert([{ user_id: userId, vehicle_id: vehicleId }]);
    if (error) throw error;
  },

  async removeFavorite(favoriteId: string): Promise<void> {
    const { error } = await supabase.from("favorites").delete().eq("id", favoriteId);
    if (error) throw error;
  },
};
