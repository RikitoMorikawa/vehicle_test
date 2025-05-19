import { Vehicle } from "../db/vehicle";

export interface TradeIn {
  vehicle_name: string;
  registration_number: string;
  mileage: number;
  first_registration_date: string;
  inspection_expiry_date: string;
  chassis_number: string;
  exterior_color: string;
}

export interface SalesPrice {
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
}

export interface LoanCalculation {
  down_payment: number;
  principal: number;
  interest_fee: number;
  total_payment: number;
  payment_count: number;
  payment_period: number;
  first_payment: number;
  monthly_payment: number;
  bonus_months: string[];
  bonus_amount: number;
}

export interface ProcessingFees {
  inspection_registration_fee: number;
  parking_certificate_fee: number;
  trade_in_processing_fee: number;
  trade_in_assessment_fee: number;
  recycling_management_fee: number;
  delivery_fee: number;
  other_fees: number;
}

export interface LegalFees {
  inspection_registration_stamp: number;
  parking_certificate_stamp: number;
  trade_in_stamp: number;
  recycling_deposit: number;
  other_nontaxable: number;
}

export interface TaxInsuranceFees {
  automobile_tax: number;
  environmental_performance_tax: number;
  weight_tax: number;
  liability_insurance_fee: number;
  voluntary_insurance_fee: number;
}

export interface Accessory {
  name: string;
  price: number;
}

export interface EstimateFormData {
  tradeIn: TradeIn;
  salesPrice: SalesPrice;
  loanCalculation: LoanCalculation;
  processingFees: ProcessingFees;
  legalFees: LegalFees;
  taxInsuranceFees: TaxInsuranceFees;
  accessories: Accessory[];
}

export interface VehicleQueryResult {
  vehicle: Vehicle | null;
  isLoading: boolean;
  error: Error | null;
}

// シンプルなエラー型定義
export interface EstimateError {
  // 下取り車両情報のエラー
  vehicle_name?: string;
  registration_number?: string;
  mileage?: string;
  first_registration_date?: string;
  inspection_expiry_date?: string;
  chassis_number?: string;
  exterior_color?: string;

  // 販売価格情報のエラー
  base_price?: string;
  discount?: string;
  inspection_fee?: string;
  accessories_fee?: string;
  vehicle_price?: string;
  tax_insurance?: string;
  legal_fee?: string;
  processing_fee?: string;
  misc_fee?: string;

  // ローン計算情報のエラー
  down_payment?: string;
  principal?: string;
  interest_fee?: string;
  total_payment?: string;
  payment_count?: string;
  payment_period?: string;
  first_payment?: string;
  monthly_payment?: string;
  bonus_months?: string;
  bonus_amount?: string;

  // 手続代行費用内訳のエラー
  inspection_registration_fee?: string;
  parking_certificate_fee?: string;
  trade_in_processing_fee?: string;
  trade_in_assessment_fee?: string;
  recycling_management_fee?: string;
  delivery_fee?: string;
  other_fees?: string;

  // 預り法定費用内訳のエラー
  inspection_registration_stamp?: string;
  parking_certificate_stamp?: string;
  trade_in_stamp?: string;
  recycling_deposit?: string;
  other_nontaxable?: string;

  // 税金・保険料内訳のエラー
  automobile_tax?: string;
  environmental_performance_tax?: string;
  weight_tax?: string;
  liability_insurance_fee?: string;
  voluntary_insurance_fee?: string;

  // 付属品のエラー
  accessories_name?: string;
  accessories_price?: string;

  // 一般エラー
  general?: string;

  // その他のフィールド用
  [key: string]: string | undefined;
}
