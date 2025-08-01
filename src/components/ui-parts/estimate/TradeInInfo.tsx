// // src/components/ui-parts/estimate/TradeInInfo.tsx
// import React from "react";
// import Input from "../../ui/Input";
// import { EstimateError } from "../../../types/estimate/page";
// import { TradeIn } from "../../../types/db/trade_in_vehicles";

// interface TradeInInfoProps {
//   tradeIn: TradeIn;
//   onInputChange: (section: "tradeIn", field: string, value: string | number) => void;
//   errors?: EstimateError | null;
// }

// const TradeInInfo: React.FC<TradeInInfoProps> = ({ tradeIn, onInputChange, errors }) => {
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     const numericFields = ["mileage"];
//     const finalValue = numericFields.includes(name) ? parseInt(value) || 0 : value;
//     onInputChange("tradeIn", name, finalValue);
//   };

//   // エラーメッセージを取得する関数
//   const getFieldError = (fieldName: string): string | undefined => {
//     if (!errors) return undefined;

//     // エラーオブジェクトから該当フィールドのエラーを取得
//     if (typeof errors.tradeIn === "string") {
//       // tradeInがstring型の場合（一般的なエラーメッセージ）
//       return errors.tradeIn;
//     } else if (errors.tradeIn && typeof errors.tradeIn === "object") {
//       // tradeInがオブジェクト型の場合（フィールド別のエラー）
//       return errors.tradeIn[fieldName];
//     }
//     return undefined;
//   };

//   return (
//     <div className="border-b border-gray-200 pb-6">
//       <h2 className="text-lg font-medium text-gray-900 mb-4">下取り車両情報</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Input
//           label="車名"
//           name="vehicle_name"
//           value={tradeIn.vehicle_name}
//           onChange={handleChange}
//           error={getFieldError("vehicle_name")}
//           placeholder="例: トヨタ カローラ"
//         />
//         <Input
//           label="登録番号"
//           name="registration_number"
//           value={tradeIn.registration_number}
//           onChange={handleChange}
//           error={getFieldError("registration_number")}
//           placeholder="例: 品川 500 あ 1234"
//         />
//         <Input
//           label="走行距離 (km)"
//           name="mileage"
//           type="number"
//           value={tradeIn.mileage}
//           onChange={handleChange}
//           error={getFieldError("mileage")}
//           min={0}
//           placeholder="0以上の数値"
//         />
//         <Input
//           label="初度登録年月"
//           name="first_registration_date"
//           type="date"
//           value={tradeIn.first_registration_date}
//           onChange={handleChange}
//           error={getFieldError("first_registration_date")}
//         />
//         <Input
//           label="車検満了日"
//           name="inspection_expiry_date"
//           type="date"
//           value={tradeIn.inspection_expiry_date}
//           onChange={handleChange}
//           error={getFieldError("inspection_expiry_date")}
//         />
//         <Input
//           label="車台番号"
//           name="chassis_number"
//           value={tradeIn.chassis_number}
//           onChange={handleChange}
//           error={getFieldError("chassis_number")}
//           placeholder="例: ZVW50-1234567"
//         />
//         <Input
//           label="外装色"
//           name="exterior_color"
//           value={tradeIn.exterior_color}
//           onChange={handleChange}
//           error={getFieldError("exterior_color")}
//           placeholder="例: ホワイトパールクリスタルシャイン"
//         />
//       </div>

//       {/* 全体のエラーメッセージ表示 */}
//       {errors?.tradeIn && typeof errors.tradeIn === "string" && <div className="mt-4 text-sm text-red-600">{errors.tradeIn}</div>}
//     </div>
//   );
// };

// export default TradeInInfo;
