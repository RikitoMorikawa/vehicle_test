// src/types/db/shipping_costs.ts
export interface ShippingCost {
  id: number;
  area_code: number;
  prefecture: string;
  city: string;
  cost: number;
  created_at: string;
  updated_at: string;
}

// 配送エリア選択用の型
export interface ShippingAreaSelection {
  area_code: number | null;
  prefecture: string;
  city: string;
  cost: number;
}

// フォームデータに追加する配送情報セクション
export interface ShippingInfo {
  area_code: number | null;
  prefecture: string;
  city: string;
  shipping_cost: number;
}
