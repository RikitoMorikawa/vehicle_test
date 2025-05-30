// src/constants/queryKeys.ts
export const QUERY_KEYS = {
  VEHICLES: ["vehicles"] as const,
  VEHICLE_DETAIL: ["vehicleDetail"] as const,
  VEHICLE_EDIT: ["vehicleEdit"] as const,
  VEHICLE_IMAGES: ["vehicleImages"] as const,
  FAVORITES: ["favorites"] as const,
  ACCOUNT: ["account"] as const,
  USERS: ["users"] as const,
  Car_MAKERS: ["carMakers"] as const,
} as const;

export type QueryKeys = typeof QUERY_KEYS;
