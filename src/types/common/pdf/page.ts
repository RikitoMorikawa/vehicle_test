// src/types/common/pdf/page.ts

// 見積書PDF用のデータ型定義
export interface EstimatePDFData {
  // 基本情報
  estimateNumber: string;
  estimateDate: string;
  document_type?: string;

  // 販売店情報
  dealerInfo: {
    name: string;
    address: string;
    phone: string;
    representative: string;
    taxNumber: string;
  };

  // 顧客情報
  customerInfo: {
    name: string;
    address: string;
    phone: string;
  };

  // 見積車両情報
  estimateVehicle: {
    id: string;
    maker: string;
    name: string;
    grade?: string;
    model?: string;
    year: number;
    mileage: number;
    repairHistory?: boolean;
    carHistory?: string;
    chassisNumber?: string;
    exteriorColor: string;
    displacement?: string;
    inspectionExpiry?: string;
    transmission?: string;
    equipment?: string;
    price: number;
    created_at: string;
  };

  // 下取り車両情報
  tradeInVehicle?: {
    trade_in_available: boolean;
    vehicle_name: string;
    registration_number: string;
    mileage: number;
    first_registration_date?: string;
    inspection_expiry_date?: string;
    chassis_number?: string;
    exterior_color: string;
  };

  // ローン計算情報
  loanCalculation?: {
    down_payment: number;
    principal: number;
    interest_fee: number;
    total_payment: number;
    payment_count: number;
    payment_period: number;
    first_payment: number;
    monthly_payment: number;
    bonus_amount: number;
    bonus_months: number[];
  };

  // 付属品・特別仕様
  accessories: Array<{
    name: string;
    price: number;
  }>;

  // 税金・保険料
  taxInsuranceFees: {
    automobile_tax: number;
    environmental_performance_tax: number;
    weight_tax: number;
    liability_insurance_fee: number;
    voluntary_insurance_fee: number;
  };

  // 預り法定費用
  legalFees: {
    inspection_registration_stamp: number;
    parking_certificate_stamp: number;
    trade_in_stamp: number;
    recycling_deposit: number;
    other_nontaxable: number;
  };

  // 手続代行費用
  processingFees: {
    inspection_registration_fee: number;
    parking_certificate_fee: number;
    trade_in_processing_fee: number;
    trade_in_assessment_fee: number;
    recycling_management_fee: number;
    delivery_fee: number;
    other_fees: number;
  };

  // 販売価格
  salesPrices: {
    base_price: number;
    discount: number;
    inspection_fee: number;
    accessories_fee: number;
    vehicle_price: number;
    tax_insurance: number;
    legal_fee: number;
    processing_fee: number;
    misc_fee: number;
    consumption_tax: number;
    total_price: number;
    trade_in_price: number;
    trade_in_debt: number;
    payment_total: number;
  };
}

// PDF生成用のオプション設定
export interface PDFGenerationOptions {
  format?: "A4" | "Letter";
  orientation?: "portrait" | "landscape";
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  includeWatermark?: boolean;
  fontSize?: "small" | "medium" | "large";
}

// PDF生成結果
export interface PDFGenerationResult {
  success: boolean;
  url?: string;
  error?: string;
  estimateId: string;
  generatedAt: string;
}
