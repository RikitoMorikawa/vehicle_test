// (D) 手続代行費用内訳テーブル
export interface ProcessingFees {
  // 検査登録手続代行;
  inspection_registration_fee: number;
  // 車庫証明手続代行;
  parking_certificate_fee: number;
  // 下取車手続・処分手続代行
  trade_in_processing_fee: number;
  // 下取車査定料;
  trade_in_assessment_fee: number;
  // リサイクル管理費用;
  recycling_management_fee: number;
  // 納車費用;
  delivery_fee: number;
  // その他費用;
  other_fees: number;
}
