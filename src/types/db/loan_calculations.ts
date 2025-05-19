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
