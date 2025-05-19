// src/components/estimate/page.tsx
import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import type { EstimateError, EstimateFormData } from "../../validations/estimate/page";
import { Vehicle } from "../../server/estimate/handler_000";

export interface EstimateComponentProps {
  loading: boolean;
  error: string | null;
  vehicle: Vehicle | undefined; // 車両情報
  formData: EstimateFormData; // 下取り情報とローン情報はformDataに含まれる
  errors: EstimateError | null;
  success: string | null;
  onInputChange: (section: "tradeIn" | "loanCalculation", name: string, value: number | string | number[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

// 車両情報コンポーネント - vehiclesテーブルから取得した情報のみを表示
const VehicleInfo: React.FC<{
  vehicle: Vehicle;
}> = ({ vehicle }) => {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">車両情報</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">メーカー / 車名</p>
          <p className="text-base">
            {vehicle.maker} {vehicle.name}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">年式</p>
          <p className="text-base">{vehicle.year}年</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">走行距離</p>
          <p className="text-base">{vehicle.mileage.toLocaleString()}km</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">車両本体価格</p>
          <p className="text-base">¥{vehicle.price.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

// 下取り車両情報コンポーネント - 空の初期値で表示
const TradeInInfo: React.FC<{
  tradeIn: EstimateFormData["tradeIn"];
  onInputChange: (section: "tradeIn", field: string, value: string | number) => void;
  errors?: EstimateError | null;
}> = ({ tradeIn, onInputChange, errors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    // 数値タイプは数値に変換、それ以外はそのまま
    const finalValue = type === "number" ? Number(value) : value;
    onInputChange("tradeIn", name, finalValue);
  };

  const getFieldError = (fieldName: string): string | undefined => {
    if (!errors || !errors.tradeIn) return undefined;

    return typeof errors.tradeIn === "string" ? errors.tradeIn : errors.tradeIn[fieldName];
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">下取り車両情報</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="車名"
          name="vehicle_name"
          value={tradeIn.vehicle_name}
          onChange={handleChange}
          error={getFieldError("vehicle_name")}
          placeholder="例: トヨタ カローラ"
        />
        <Input
          label="登録番号"
          name="registration_number"
          value={tradeIn.registration_number}
          onChange={handleChange}
          error={getFieldError("registration_number")}
          placeholder="例: 1234-5678"
        />
        <Input
          label="走行距離 (km)"
          name="mileage"
          type="text"
          inputMode="numeric"
          value={tradeIn.mileage || ""}
          onChange={handleChange}
          error={getFieldError("mileage")}
          placeholder="0以上の数値"
        />
        <Input
          label="初度登録年月"
          name="first_registration_date"
          type="date"
          value={tradeIn.first_registration_date}
          onChange={handleChange}
          error={getFieldError("first_registration_date")}
        />
        <Input
          label="車検満了日"
          name="inspection_expiry_date"
          type="date"
          value={tradeIn.inspection_expiry_date}
          onChange={handleChange}
          error={getFieldError("inspection_expiry_date")}
        />
        <Input
          label="車台番号"
          name="chassis_number"
          value={tradeIn.chassis_number}
          onChange={handleChange}
          error={getFieldError("chassis_number")}
          placeholder="例: ZVW50-1234567"
        />
        <Input
          label="外装色"
          name="exterior_color"
          value={tradeIn.exterior_color}
          onChange={handleChange}
          error={getFieldError("exterior_color")}
          placeholder="例: ホワイトパールクリスタルシャイン"
        />
      </div>

      {errors?.tradeIn && typeof errors.tradeIn === "string" && <div className="mt-4 text-sm text-red-600">{errors.tradeIn}</div>}
    </div>
  );
};

// ローン計算情報コンポーネント - 空の初期値で表示
const LoanCalculationComponent: React.FC<{
  loanCalculation: EstimateFormData["loanCalculation"];
  onInputChange: (section: "loanCalculation", name: string, value: number | string | number[]) => void;
  errors?: EstimateError | null;
}> = ({ loanCalculation, onInputChange, errors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // 支払回数が変更された場合、コンテナコンポーネントで自動的に支払期間も更新
    if (name === "payment_count") {
      const numValue = value === "" ? 0 : parseInt(value, 10);
      onInputChange("loanCalculation", name, numValue);
    } else {
      // その他のフィールドの処理
      const numValue = value === "" ? 0 : Number(value);
      onInputChange("loanCalculation", name, numValue);
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    if (!errors || !errors.loanCalculation) return undefined;

    return typeof errors.loanCalculation === "string" ? errors.loanCalculation : errors.loanCalculation[fieldName];
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">ローン計算情報</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="頭金"
          name="down_payment"
          type="text"
          inputMode="numeric"
          value={loanCalculation.down_payment || ""}
          onChange={handleChange}
          error={getFieldError("down_payment")}
          placeholder="0"
        />
        <Input
          label="元金"
          name="principal"
          type="text"
          inputMode="numeric"
          value={loanCalculation.principal || ""}
          onChange={handleChange}
          error={getFieldError("principal")}
          placeholder="0"
        />
        <Input
          label="金利手数料"
          name="interest_fee"
          type="text"
          inputMode="numeric"
          value={loanCalculation.interest_fee || ""}
          onChange={handleChange}
          error={getFieldError("interest_fee")}
          placeholder="0"
        />
        <Input
          label="支払総額"
          name="total_payment"
          type="text"
          inputMode="numeric"
          value={loanCalculation.total_payment || ""}
          onChange={handleChange}
          error={getFieldError("total_payment")}
          placeholder="0"
        />

        {/* 支払回数をプルダウンに変更 */}
        <Select
          label="支払回数"
          name="payment_count"
          value={loanCalculation.payment_count.toString()}
          onChange={handleChange}
          error={getFieldError("payment_count")}
        >
          <option value="">選択してください</option>
          <option value="12">12回 (1年)</option>
          <option value="24">24回 (2年)</option>
          <option value="36">36回 (3年)</option>
          <option value="48">48回 (4年)</option>
          <option value="60">60回 (5年)</option>
          <option value="72">72回 (6年)</option>
          <option value="84">84回 (7年)</option>
        </Select>

        {/* 支払期間は自動計算（読み取り専用） */}
        <Input
          label="支払期間（年）"
          name="payment_period"
          type="text"
          value={loanCalculation.payment_period || ""}
          onChange={handleChange}
          error={getFieldError("payment_period")}
          placeholder="自動計算"
          disabled={true}
          className="bg-gray-100"
        />

        <Input
          label="初回支払額"
          name="first_payment"
          type="text"
          inputMode="numeric"
          value={loanCalculation.first_payment || ""}
          onChange={handleChange}
          error={getFieldError("first_payment")}
          placeholder="0"
        />
        <Input
          label="月々支払額"
          name="monthly_payment"
          type="text"
          inputMode="numeric"
          value={loanCalculation.monthly_payment || ""}
          onChange={handleChange}
          error={getFieldError("monthly_payment")}
          placeholder="0"
        />
        <Input
          label="ボーナス加算額"
          name="bonus_amount"
          type="text"
          inputMode="numeric"
          value={loanCalculation.bonus_amount || ""}
          onChange={handleChange}
          error={getFieldError("bonus_amount")}
          placeholder="0"
        />
      </div>

      {/* ボーナス加算月チェックボックス */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">ボーナス加算月</label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
            // 選択された月をチェック
            const isChecked = Array.isArray(loanCalculation.bonus_months) ? loanCalculation.bonus_months.includes(month) : false;

            return (
              <div key={month} className="flex items-center">
                <input
                  id={`bonus_month_${month}`}
                  type="checkbox"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  name="bonus_months"
                  checked={isChecked}
                  onChange={(e) => {
                    // 現在の選択月配列をコピー
                    const currentMonths = Array.isArray(loanCalculation.bonus_months) ? [...loanCalculation.bonus_months] : [];

                    let newMonths: number[];

                    if (e.target.checked) {
                      // チェックが入った場合、月を追加
                      newMonths = [...currentMonths, month].sort((a, b) => a - b);
                    } else {
                      // チェックが外れた場合、月を削除
                      newMonths = currentMonths.filter((m) => m !== month);
                    }

                    // 更新した配列を親コンポーネントに渡す
                    onInputChange("loanCalculation", "bonus_months", newMonths);
                  }}
                />
                <label htmlFor={`bonus_month_${month}`} className="ml-2 text-sm text-gray-700">
                  {month}月
                </label>
              </div>
            );
          })}
        </div>
        {getFieldError("bonus_months") && <p className="mt-1 text-sm text-red-600">{getFieldError("bonus_months")}</p>}
      </div>

      {errors?.loanCalculation && typeof errors.loanCalculation === "string" && <div className="mt-4 text-sm text-red-600">{errors.loanCalculation}</div>}
    </div>
  );
};

// メインコンポーネント
const EstimateComponent: React.FC<EstimateComponentProps> = ({ loading, error, vehicle, formData, errors, success, onInputChange, onSubmit, onCancel }) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-gray-900">見積書作成</h1>
              </div>

              {errors?.general && (
                <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {success && (
                <div className="px-6 py-4 bg-green-50 border-b border-green-200">
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              <form onSubmit={onSubmit} className="p-6 space-y-8">
                {/* 車両情報のみ外部から取得した値で表示 */}
                {vehicle && <VehicleInfo vehicle={vehicle} />}

                {/* 下取り車両情報とローン情報は空の初期値で表示 */}
                <TradeInInfo tradeIn={formData.tradeIn} onInputChange={onInputChange} errors={errors} />

                <LoanCalculationComponent loanCalculation={formData.loanCalculation} onInputChange={onInputChange} errors={errors} />

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    キャンセル
                  </Button>
                  <Button type="submit">保存</Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default EstimateComponent;
