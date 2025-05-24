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
