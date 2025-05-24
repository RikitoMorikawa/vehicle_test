// (B) 税金・保険料内訳テーブル
export interface TaxInsuranceFees {
  // 自動車税;
  automobile_tax: number;
  // 環境性能割;
  environmental_performance_tax: number;
  // 重量税;
  weight_tax: number;
  // 自賠責保険料;
  liability_insurance_fee: number;
  // 任意保険料;
  voluntary_insurance_fee: number;
}
