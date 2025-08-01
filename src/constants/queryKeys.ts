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
  ORDERS: ["orders"] as const,
  VEHICLE_ORDER_STATUS: ["order", "detail"] as const,
  LOAN_APPLICATION_STATUS: ["loanApplicationStatus"] as const,
    LOAN_APPLICATIONS: ["loanApplications"] as const,
  LOAN_APPLICATION_DETAIL: ["loanApplication"] as const,
} as const;

export type QueryKeys = typeof QUERY_KEYS;
