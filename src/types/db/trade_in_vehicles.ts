// 下取車両テーブル（trade_in_vehicles）
export interface TradeIn {
  // 車名;
  vehicle_name: string;
  // 登録番号;
  registration_number: string;
  // 走行距離;
  mileage: number;
  // 初度登録年月;
  first_registration_date: string;
  // 車検満了日;
  inspection_expiry_date: string;
  // 車台番号;
  chassis_number: string;
  // 外装色;
  exterior_color: string;
}
