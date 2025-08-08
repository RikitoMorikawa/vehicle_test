// src/components/estimate/ShippingAreaSelector.tsx
import React, { useState } from "react";
import Select from "../ui/Select";
import { shippingService } from "../../services/shipping/shipping";
import type { ShippingInfo, EstimateError } from "../../validations/estimate/page";

interface ShippingAreaSelectorProps {
  shippingInfo: ShippingInfo;
  onShippingChange: (shippingInfo: ShippingInfo) => void;
  errors?: EstimateError | null;
}

const ShippingAreaSelector: React.FC<ShippingAreaSelectorProps> = ({ shippingInfo, onShippingChange, errors }) => {
  // 現在選択されている都道府県
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>(shippingInfo.prefecture || "");

  // データ取得用のフック
  const { data: prefectures = [], isLoading: prefecturesLoading } = shippingService.usePrefectures();
  const { data: cities = [], isLoading: citiesLoading } = shippingService.useCitiesByPrefecture(selectedPrefecture);

  // 都道府県変更時の処理
  const handlePrefectureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prefecture = e.target.value;
    setSelectedPrefecture(prefecture);

    // 都道府県が空の場合は全てリセット
    if (!prefecture) {
      onShippingChange({
        area_code: null,
        prefecture: "",
        city: "",
        shipping_cost: 0,
      });
    } else {
      // 都道府県が選択されたら市区町村と送料をリセット
      onShippingChange({
        area_code: null,
        prefecture: prefecture,
        city: "",
        shipping_cost: 0,
      });
    }
  };

  // 市区町村変更時の処理
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAreaCode = parseInt(e.target.value, 10);
    const selectedCity = cities.find((city) => city.area_code === selectedAreaCode);

    if (selectedCity) {
      onShippingChange({
        area_code: selectedCity.area_code,
        prefecture: selectedCity.prefecture,
        city: selectedCity.city,
        shipping_cost: selectedCity.cost, // ★修正: costをshipping_costにマッピング
      });
    }
  };

  // エラー取得用のヘルパー関数
  const getFieldError = (fieldName: string): string | undefined => {
    if (!errors || !errors.shippingInfo) return undefined;
    return typeof errors.shippingInfo === "string" ? errors.shippingInfo : errors.shippingInfo[fieldName];
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">配送エリア・送料</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 都道府県選択 */}
        <Select
          label="都道府県"
          name="prefecture"
          value={selectedPrefecture}
          onChange={handlePrefectureChange}
          error={getFieldError("prefecture")}
          disabled={prefecturesLoading}
        >
          <option value="">都道府県を選択してください</option>
          {prefectures.map((prefecture) => (
            <option key={prefecture} value={prefecture}>
              {prefecture}
            </option>
          ))}
        </Select>

        {/* 市区町村選択 */}
        <Select
          label="市区町村"
          name="city"
          value={shippingInfo.area_code?.toString() || ""}
          onChange={handleCityChange}
          error={getFieldError("city")}
          disabled={!selectedPrefecture || citiesLoading}
          required={!!selectedPrefecture}
        >
          <option value="">市区町村を選択してください</option>
          {cities.map((city) => (
            <option key={city.area_code} value={city.area_code.toString()}>
              {city.city}
            </option>
          ))}
        </Select>
      </div>

      {/* 送料表示 */}
      {shippingInfo.shipping_cost > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-900">
              選択エリア: {shippingInfo.prefecture} {shippingInfo.city}
            </span>
            <span className="text-lg font-bold text-blue-900">送料: ¥{shippingInfo.shipping_cost.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* ローディング表示 */}
      {(prefecturesLoading || citiesLoading) && <div className="mt-4 text-sm text-gray-500">データを読み込んでいます...</div>}

      {/* 全体のバリデーションエラー表示 */}
      {errors?.shippingInfo && typeof errors.shippingInfo === "string" && <div className="mt-4 text-sm text-red-600">{errors.shippingInfo}</div>}
    </div>
  );
};

export default ShippingAreaSelector;
