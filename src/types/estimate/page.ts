import { Accessory } from "../db/accessories";
import { LegalFees } from "../db/legal_fees";
import { LoanCalculation } from "../db/loan_calculations";
import { ProcessingFees } from "../db/processing_fees";
import { SalesPrice } from "../db/sales_prices";
import { TaxInsuranceFees } from "../db/tax_insurance_fees";
import { TradeIn } from "../db/trade_in_vehicles";
import { Vehicle } from "../db/vehicle";

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
