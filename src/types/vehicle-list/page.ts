// src / types / vehicle / page.ts;

import { Vehicle } from "../db/vehicle";

export interface SearchParams {
  keyword: string;
  maker: string;
  year: string;
  mileage: string;
  sort: string;
}

export interface VehicleQueryResult {
  vehicles: Vehicle[];
  totalPages: number;
  isLoading: boolean;
  error: Error | null;
}

export interface FetchVehiclesResult {
  vehicles: Vehicle[];
  totalPages: number;
}