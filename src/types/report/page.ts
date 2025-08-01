// src/types/report/page.ts

// 見積書レポートの基本型（修正版）
export interface EstimateReport {
  document_type?: string;
  id: string;
  estimateNumber: string;
  user_id: string;
  vehicle_id: string;
  vehicleInfo: {
    maker: string;
    name: string;
    year: number;
  };
  customerPhone?: string;
  customerEmail?: string;
  deliveryDate?: string;
  validUntil?: string;
  notes?: string;
  taxRate: number;
  customerName?: string;
  companyName?: string;
  totalAmount: number;
  createdAt: string;
  status: "draft" | "completed" | "sent";
}

// データベースから取得される生データの型定義（修正版）
export interface EstimateVehicleRawData {
  id: string;
  user_id: string;
  vehicle_id: string;
  maker: string;
  name: string;
  year: number;
  document_type?: string;
  created_at: string;
  company_id: string;
  sales_prices: Array<{
    payment_total: number;
  }> | null;
  // Supabaseのリレーション構文による取得データの型
  users: Array<{
    company_name: string;
  }> | null;
}

// 検索パラメータの型
export interface EstimateSearchParams {
  companyId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  searchText?: string;
  userId?: string;
  vehicleId?: string;
}

// レポート関連のエラー型
export interface ReportError {
  general?: string;
  fetch?: string;
  search?: string;
  pdf?: string;
}

// レポート一覧のフィルタ状態
export interface ReportFilters {
  companyId: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  searchText: string;
  userId?: string;
  vehicleId?: string;
}

// レポート表示用のソート設定
export interface ReportSortConfig {
  field: "createdAt" | "totalAmount" | "companyName" | "vehicleInfo";
  direction: "asc" | "desc";
}

// PDFエクスポート設定
export interface PDFExportOptions {
  includeDetails: boolean;
  includeCustomerInfo: boolean;
  format: "A4" | "Letter";
  orientation: "portrait" | "landscape";
}

// 見積書統計情報
export interface EstimateStatistics {
  totalEstimates: number;
  totalAmount: number;
  averageAmount: number;
  statusBreakdown: {
    draft: number;
    completed: number;
    sent: number;
  };
  companyBreakdown: Array<{
    companyName: string;
    count: number;
    totalAmount: number;
  }>;
}
