// src/types/admin/loan-review/page.ts
export interface LoanApplication {
    id: string;
    user_id: string;
    vehicle_id: string;
    vehicle_name?: string;
    customer_name: string;
    customer_name_kana: string;
    vehicle_price: number;
    status: number;
    created_at: string;
  }
  
  export interface LoanApplicationsQueryResult {
    applications: LoanApplication[];
    isLoading: boolean;
    error: Error | null;
  }
