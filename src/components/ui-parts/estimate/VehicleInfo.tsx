// // src / components / ui - parts / estimate / VehicleInfo.tsx;
// import React from "react";
// import { Vehicle } from "../../../types/db/vehicle";

// interface VehicleInfoProps {
//   vehicle: Vehicle;
// }

// const VehicleInfo: React.FC<VehicleInfoProps> = ({ vehicle }) => {
//   return (
//     <div className="mb-6">
//       <h2 className="text-lg font-medium text-gray-900 mb-4">車両情報</h2>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <p className="text-sm text-gray-500">メーカー / 車名</p>
//           <p className="text-base">
//             {vehicle.maker} {vehicle.name}
//           </p>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">年式</p>
//           <p className="text-base">{vehicle.year}年</p>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">走行距離</p>
//           <p className="text-base">{vehicle.mileage.toLocaleString()}km</p>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">車両本体価格</p>
//           <p className="text-base">¥{vehicle.price.toLocaleString()}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VehicleInfo;
