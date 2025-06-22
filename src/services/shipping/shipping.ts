// src/services/shipping/shipping.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import type { ShippingCost } from "../../types/db/shipping_costs";

// 配送料マスタテーブルから全データを取得
const fetchAllShippingCosts = async (): Promise<ShippingCost[]> => {
  const { data, error } = await supabase.from("shipping_costs").select("*").order("prefecture", { ascending: true }).order("city", { ascending: true });

  if (error) {
    console.error("Error fetching shipping costs:", error);
    throw error;
  }

  return data || [];
};

// 都道府県一覧を取得（重複除去）
const fetchPrefectures = async (): Promise<string[]> => {
  const { data, error } = await supabase.from("shipping_costs").select("prefecture").order("prefecture", { ascending: true });

  if (error) {
    console.error("Error fetching prefectures:", error);
    throw error;
  }

  // 重複を除去してユニークな都道府県リストを作成
  const uniquePrefectures = [...new Set(data?.map((item) => item.prefecture) || [])];
  return uniquePrefectures;
};

// 指定された都道府県の市区町村一覧を取得
const fetchCitiesByPrefecture = async (prefecture: string): Promise<ShippingCost[]> => {
  const { data, error } = await supabase.from("shipping_costs").select("*").eq("prefecture", prefecture).order("city", { ascending: true });

  if (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }

  return data || [];
};

// 特定のarea_codeの配送情報を取得
const fetchShippingByAreaCode = async (areaCode: number): Promise<ShippingCost | null> => {
  const { data, error } = await supabase.from("shipping_costs").select("*").eq("area_code", areaCode).single();

  if (error) {
    console.error("Error fetching shipping by area code:", error);
    return null;
  }

  return data;
};

// カスタムフック
export const shippingService = {
  // 全配送料データを取得
  useAllShippingCosts: () => {
    return useQuery({
      queryKey: ["shipping-costs"],
      queryFn: fetchAllShippingCosts,
      staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    });
  },

  // 都道府県一覧を取得
  usePrefectures: () => {
    return useQuery({
      queryKey: ["shipping-prefectures"],
      queryFn: fetchPrefectures,
      staleTime: 10 * 60 * 1000, // 10分間キャッシュ
    });
  },

  // 特定の都道府県の市区町村一覧を取得
  useCitiesByPrefecture: (prefecture: string | null) => {
    return useQuery({
      queryKey: ["shipping-cities", prefecture],
      queryFn: () => (prefecture ? fetchCitiesByPrefecture(prefecture) : Promise.resolve([])),
      enabled: !!prefecture, // 都道府県が選択されている場合のみ実行
      staleTime: 10 * 60 * 1000, // 10分間キャッシュ
    });
  },

  // 特定のarea_codeの配送情報を取得
  useShippingByAreaCode: (areaCode: number | null) => {
    return useQuery({
      queryKey: ["shipping-by-area-code", areaCode],
      queryFn: () => (areaCode ? fetchShippingByAreaCode(areaCode) : Promise.resolve(null)),
      enabled: !!areaCode, // area_codeが指定されている場合のみ実行
      staleTime: 10 * 60 * 1000, // 10分間キャッシュ
    });
  },
};
