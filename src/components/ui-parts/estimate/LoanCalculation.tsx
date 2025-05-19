// import React from "react";
// import Input from "../../ui/Input";
// import { LoanCalculation } from "../../../types/db/loan_calculations";
// import { EstimateError } from "../../../validations/estimate/page";

// interface LoanCalculationProps {
//   loanCalculation: LoanCalculation;
//   onInputChange: (section: "loanCalculation", name: string, value: number | string) => void;
//   errors?: EstimateError | null; // EstimateError型に変更
// }

// const LoanCalculationComponent: React.FC<LoanCalculationProps> = ({ loanCalculation, onInputChange, errors }) => {
//   return (
//     <div className="border-b border-gray-200 pb-6">
//       <h2 className="text-lg font-medium text-gray-900 mb-4">ローン計算情報</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Input
//           label="頭金"
//           type="number"
//           value={loanCalculation.down_payment}
//           onChange={(e) => onInputChange("loanCalculation", "down_payment", parseInt(e.target.value))}
//         />
//         <Input
//           label="元金"
//           type="number"
//           value={loanCalculation.principal}
//           onChange={(e) => onInputChange("loanCalculation", "principal", parseInt(e.target.value))}
//         />
//         <Input
//           label="金利手数料"
//           type="number"
//           value={loanCalculation.interest_fee}
//           onChange={(e) => onInputChange("loanCalculation", "interest_fee", parseInt(e.target.value))}
//         />
//         <Input
//           label="支払総額"
//           type="number"
//           value={loanCalculation.total_payment}
//           onChange={(e) => onInputChange("loanCalculation", "total_payment", parseInt(e.target.value))}
//         />
//         <Input
//           label="支払回数"
//           type="number"
//           value={loanCalculation.payment_count}
//           onChange={(e) => onInputChange("loanCalculation", "payment_count", parseInt(e.target.value))}
//         />
//         <Input
//           label="支払期間"
//           type="number"
//           value={loanCalculation.payment_period}
//           onChange={(e) => onInputChange("loanCalculation", "payment_period", parseInt(e.target.value))}
//         />
//         <Input
//           label="初回支払額"
//           type="number"
//           value={loanCalculation.first_payment}
//           onChange={(e) => onInputChange("loanCalculation", "first_payment", parseInt(e.target.value))}
//         />
//         <Input
//           label="月々支払額"
//           type="number"
//           value={loanCalculation.monthly_payment}
//           onChange={(e) => onInputChange("loanCalculation", "monthly_payment", parseInt(e.target.value))}
//         />
//         <Input
//           label="ボーナス加算額"
//           type="number"
//           value={loanCalculation.bonus_amount}
//           onChange={(e) => onInputChange("loanCalculation", "bonus_amount", parseInt(e.target.value))}
//         />
//       </div>
//     </div>
//   );
// };

// export default LoanCalculationComponent;
