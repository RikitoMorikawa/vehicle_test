// src/types/report/page.ts

// 見積書レポートの基本型
export interface EstimateReport {
  id: string;
  estimateNumber: string;
  vehicleInfo: {
    maker: string;
    name: string;
    year: number;
  };
  customerName?: string;
  companyName?: string;
  totalAmount: number;
  createdAt: string;
  status: "draft" | "completed" | "sent";
}

// データベースから取得される生データの型定義
export interface EstimateVehicleRawData {
  id: string;
  maker: string;
  name: string;
  year: number;
  created_at: string;
  company_id: string;
  sales_prices: Array<{
    payment_total: number;
  }> | null;
  companies: Array<{
    name: string;
  }> | null;
}

// 検索パラメータの型
export interface EstimateSearchParams {
  companyId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  searchText?: string;
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
