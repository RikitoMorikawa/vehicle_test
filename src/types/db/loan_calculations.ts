// ローン計算テーブル
export interface LoanCalculation {
  // 頭金;
  down_payment: number;
  // 現金・割賦元金
  principal: number;
  // 分割払手数料;
  interest_fee: number;
  // 分割支払金合計;
  total_payment: number;
  // 支払回数;
  payment_count: number;
  // 支払期間;
  payment_period: number;
  // 初回支払額;
  first_payment: number;
  // 2回目以降支払額;
  monthly_payment: number;
  // ボーナス加算月;
  bonus_months: string[];
  // ボーナス加算額;
  bonus_amount: number;
}
