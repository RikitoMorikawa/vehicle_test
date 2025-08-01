// src / components / ui - parts / VehicleInfo.tsx;
import React from "react";
import { Vehicle } from "../../../types/db/vehicle";
import { useNavigate } from "react-router-dom";

interface VehicleInfoProps {
  isAdmin?: boolean;
  vehicle: Vehicle;
  mainImageUrl: string;
  otherImagesUrls: string[];
  selectedImage: string | null;
  setSelectedImage: (url: string | null) => void;
  onCreateEstimate: () => void;
  onApplyLoan: () => void;
}

const VehicleInfo: React.FC<VehicleInfoProps> = ({ vehicle, mainImageUrl, otherImagesUrls, selectedImage, setSelectedImage, onApplyLoan, isAdmin }) => {
  const navigate = useNavigate();
  // 表示する画像（選択されていなければメイン画像）
  const displayImageUrl = selectedImage || mainImageUrl;

  const onCreateEstimate = () => {
    navigate(`/estimate/${vehicle.id}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <div>
        <div className="aspect-w-16 aspect-h-9 mb-4 h-64 md:h-80">
          <img src={displayImageUrl} alt={`${vehicle.maker} ${vehicle.name}`} className="rounded-lg object-cover w-full h-full" />
        </div>

        {/* サムネイル画像の表示（メイン画像とその他の画像） */}
        {(otherImagesUrls.length > 0 || vehicle.images) && (
          <div className="grid grid-cols-5 gap-2">
            {/* メイン画像のサムネイル */}
            <div className={`aspect-square cursor-pointer ${selectedImage === null ? "ring-2 ring-red-500" : ""}`} onClick={() => setSelectedImage(null)}>
              <img
                src={mainImageUrl}
                alt={`${vehicle.maker} ${vehicle.name} - メイン`}
                className="rounded-lg object-cover w-full h-full hover:opacity-80 transition-opacity"
              />
            </div>

            {/* その他の画像のサムネイル */}
            {otherImagesUrls.map((url, index) => (
              <div
                key={index}
                className={`aspect-square cursor-pointer ${selectedImage === url ? "ring-2 ring-red-500" : ""}`}
                onClick={() => setSelectedImage(url)}
              >
                <img
                  src={url}
                  alt={`${vehicle.maker} ${vehicle.name} - ${index + 1}`}
                  className="rounded-lg object-cover w-full h-full hover:opacity-80 transition-opacity"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">車両スペック</h2>
          <dl className="grid grid-cols-1 gap-4">
            <div className="flex items-center py-3 border-b border-gray-200">
              <dt className="flex items-center text-sm text-gray-500 w-32">メーカー</dt>
              <dd className="text-sm text-gray-900">{vehicle.maker || "不明"}</dd>
            </div>
            <div className="flex items-center py-3 border-b border-gray-200">
              <dt className="flex items-center text-sm text-gray-500 w-32">車名</dt>
              <dd className="text-sm text-gray-900">{vehicle.name || "不明"}</dd>
            </div>
            <div className="flex items-center py-3 border-b border-gray-200">
              <dt className="flex items-center text-sm text-gray-500 w-32">年式</dt>
              <dd className="text-sm text-gray-900">{vehicle.year}年</dd>
            </div>
            <div className="flex items-center py-3 border-b border-gray-200">
              <dt className="flex items-center text-sm text-gray-500 w-32">走行距離</dt>
              <dd className="text-sm text-gray-900">{vehicle.mileage.toLocaleString()} km</dd>
            </div>
            <div className="flex items-center py-3 border-b border-gray-200">
              <dt className="flex items-center text-sm text-gray-500 w-32">車検満了日</dt>
              <dd className="text-sm text-gray-900">{vehicle.inspection_date || "不明"}</dd>
            </div>
            <div className="flex items-center py-3 border-b border-gray-200">
              <dt className="flex items-center text-sm text-gray-500 w-32">ボディカラー</dt>
              <dd className="text-sm text-gray-900">{vehicle.color || "不明"}</dd>
            </div>
            <div className="flex items-center py-3 border-b border-gray-200">
              <dt className="flex items-center text-sm text-gray-500 w-32">排気量</dt>
              <dd className="text-sm text-gray-900">{vehicle.engine_size ? `${vehicle.engine_size} cc` : "不明"}</dd>
            </div>
            <div className="flex items-center py-3 border-b border-gray-200">
              <dt className="flex items-center text-sm text-gray-500 w-32">シフト</dt>
              <dd className="text-sm text-gray-900">{vehicle.transmission || "不明"}</dd>
            </div>
            <div className="flex items-center py-3 border-b border-gray-200">
              <dt className="flex items-center text-sm text-gray-500 w-32">駆動方式</dt>
              <dd className="text-sm text-gray-900">{vehicle.drive_system || "不明"}</dd>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div></div>
              {!isAdmin && (
                <div className="flex space-x-4">
                  <button
                    onClick={onCreateEstimate}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    各種書類作成
                  </button>
                  <button
                    onClick={onApplyLoan}
                    className="px-6 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    ローン審査申込
                  </button>
                </div>
              )}
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default VehicleInfo;
