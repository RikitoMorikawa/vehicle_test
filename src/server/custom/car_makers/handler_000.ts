// src / server / custom / car_makers / handler_000.ts;
import { supabase } from "../../../lib/supabase";
import type { CarMaker } from "../../../types/db/car_makers";

/**
 * メーカー一覧を取得するハンドラー
 * @returns メーカー情報の配列
 */
export async function fetchCarMakers(): Promise<CarMaker[]> {
  try {
    const { data, error } = await supabase.from("car_makers").select("*").order("name");

    if (error) {
      console.error("Error fetching car makers:", error);
      throw error;
    }

    // データが存在しない場合は空配列を返す
    if (!data || data.length === 0) {
      console.warn("No car makers found in the database");
      return [];
    }

    return data;
  } catch (err) {
    console.error("Failed to fetch car makers:", err);
    throw err;
  }
}
