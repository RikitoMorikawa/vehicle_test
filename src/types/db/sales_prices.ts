// 販売価格テーブル
export interface SalesPrice {
  base_price: number;        // 車両本体価格
  discount: number;          // 値引き
  inspection_fee: number;    // 車検整備費用
  accessories_fee: number;   // 付属品・特別仕様
  vehicle_price: number;     // 車両販売価格(1)
  tax_insurance: number;     // 税金・保険料
  legal_fee: number;         // 預り法定費用
  processing_fee: number;    // 手続代行費用
  misc_fee: number;          // 販売諸費用(2)
  consumption_tax: number;   // 内消費税
  total_price: number;       // 現金販売価格(1)+(2)
  trade_in_price: number;    // 下取車価格
  trade_in_debt: number;     // 下取車残債
  payment_total: number;     // お支払総額
}