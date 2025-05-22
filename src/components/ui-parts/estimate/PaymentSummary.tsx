// import React from "react";
// import { Vehicle } from "../../../types/db/vehicle";

// interface PaymentSummaryProps {
//   vehicle: Vehicle;
// }

// const PaymentSummary: React.FC<PaymentSummaryProps> = ({ vehicle }) => {
//   return (
//     <div className="mb-6">
//       <h2 className="text-lg font-bold text-gray-900 mb-4">お支払い内訳</h2>
//       <div className="space-y-4">
//         <div className="flex justify-between items-center py-2 border-b">
//           <span className="text-gray-600">車両本体価格</span>
//           <span className="text-lg font-medium">¥{vehicle.price.toLocaleString()}</span>
//         </div>
//         <div className="flex justify-between items-center py-2 border-b">
//           <span className="text-gray-600">諸費用</span>
//           <span className="text-lg font-medium">¥{(vehicle.price * 0.1).toLocaleString()}</span>
//         </div>
//         <div className="flex justify-between items-center py-2 border-b">
//           <span className="text-gray-600">消費税</span>
//           <span className="text-lg font-medium">¥{(vehicle.price * 0.1).toLocaleString()}</span>
//         </div>
//         <div className="flex justify-between items-center py-4">
//           <span className="text-lg font-bold">お支払い総額</span>
//           <span className="text-xl font-bold text-red-600">¥{(vehicle.price * 1.2).toLocaleString()}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSummary;
