export const QUERY_KEYS = {
  VEHICLES: ["vehicles"] as const,
  VEHICLE_DETAIL: ["vehicleDetail"] as const,
  VEHICLE_IMAGES: ["vehicleImages"] as const,
  FAVORITES: ["favorites"] as const,
  ACCOUNT: ["account"] as const,
  USERS: ["users"] as const,
} as const;

export type QueryKeys = typeof QUERY_KEYS;
