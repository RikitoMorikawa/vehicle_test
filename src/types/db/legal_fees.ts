// (C)預り法定費用内訳テーブル
export interface LegalFees {
  // 検査登録(印紙代);
  inspection_registration_stamp: number;
  // 車庫証明(印紙代);
  parking_certificate_stamp: number;
  // 下取車手続・処分(印紙代)
  trade_in_stamp: number;
  // リサイクル預託金;
  recycling_deposit: number;
  // その他非課税費用;
  other_nontaxable: number;
}
