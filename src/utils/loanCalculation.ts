// src/utils/loanCalculation.ts
// ローン計算用ユーティリティ関数

export interface LoanCalculationParams {
  principal: number; // 元金（借入額）
  annualRate: number; // 年利（%）
  paymentCount: number; // 支払回数
  bonusAmount?: number; // ボーナス支払額（オプション）
  bonusMonths?: number[]; // ボーナス支払月（オプション）
}

export interface LoanCalculationResult {
  monthlyPayment: number; // 月々の支払額
  interestFee: number; // 分割手数料（利息総額）
  totalPayment: number; // 分割支払金合計
}

/**
 * PMT関数（月々の支払額計算）
 * Excel のPMT関数と同等の計算を行う
 */
export function calculatePMT(
  rate: number, // 月利（年利÷12÷100）
  nper: number, // 支払回数
  pv: number // 現在価値（借入額）
): number {
  if (rate === 0) {
    // 金利0%の場合は単純な等分割
    return pv / nper;
  }

  // PMT計算式: PV × { r × (1+r)^n } ÷ { (1+r)^n - 1 }
  const factor = Math.pow(1 + rate, nper);
  return (pv * (rate * factor)) / (factor - 1);
}

/**
 * ローン計算メイン関数
 */
export function calculateLoanPayments(params: LoanCalculationParams): LoanCalculationResult {
  const { principal, annualRate, paymentCount, bonusAmount = 0, bonusMonths = [] } = params;

  // 入力値検証
  if (principal <= 0 || annualRate < 0 || paymentCount <= 0) {
    return {
      monthlyPayment: 0,
      interestFee: 0,
      totalPayment: 0,
    };
  }

  // 月利を計算（年利 ÷ 12 ÷ 100）
  const monthlyRate = annualRate / 12 / 100;

  // ボーナス支払いを考慮した計算
  const bonusCount = bonusMonths.length;
  const regularPaymentCount = paymentCount - bonusCount;

  // ボーナス支払い総額
  const totalBonusPayment = bonusAmount * bonusCount;

  // ボーナス支払いを除いた元金
  const adjustedPrincipal = principal - totalBonusPayment;

  // 月々の支払額を計算（ボーナス支払いを除く）
  const monthlyPayment = adjustedPrincipal > 0 ? calculatePMT(monthlyRate, regularPaymentCount, adjustedPrincipal) : 0;

  // 総支払額を計算
  const totalRegularPayments = monthlyPayment * regularPaymentCount;
  const totalPayment = totalRegularPayments + totalBonusPayment;

  // 分割手数料（利息）を計算
  const interestFee = totalPayment - principal;

  return {
    monthlyPayment: Math.round(monthlyPayment),
    interestFee: Math.round(Math.max(0, interestFee)),
    totalPayment: Math.round(totalPayment),
  };
}

/**
 * 年利から月利を計算
 */
export function annualRateToMonthlyRate(annualRate: number): number {
  return annualRate / 12 / 100;
}

/**
 * 支払いスケジュール詳細を計算（オプション）
 */
export function calculatePaymentSchedule(params: LoanCalculationParams): Array<{
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  isBonus: boolean;
}> {
  const { principal, annualRate, paymentCount, bonusAmount = 0, bonusMonths = [] } = params;

  const monthlyRate = annualRate / 12 / 100;
  const { monthlyPayment } = calculateLoanPayments(params);

  const schedule = [];
  let remainingBalance = principal;

  for (let month = 1; month <= paymentCount; month++) {
    const isBonus = bonusMonths.includes(month);
    const payment = isBonus ? bonusAmount : monthlyPayment;

    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = payment - interestPayment;

    remainingBalance = Math.max(0, remainingBalance - principalPayment);

    schedule.push({
      month,
      payment: Math.round(payment),
      principal: Math.round(principalPayment),
      interest: Math.round(interestPayment),
      balance: Math.round(remainingBalance),
      isBonus,
    });
  }

  return schedule;
}

/**
 * 数値フォーマット用ヘルパー関数
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
  }).format(amount);
}
