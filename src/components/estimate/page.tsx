// src/components/estimate/page.tsx
import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import type { EstimateError, EstimateFormData } from "../../validations/estimate/page";
import { Vehicle } from "../../server/estimate/handler_000";
import { Accessory } from "../../types/db/accessories";
import { Plus, Trash2 } from "lucide-react";

// インターフェース更新
export interface EstimateComponentProps {
  loading: boolean;
  error: string | null;
  vehicle: Vehicle | undefined;
  formData: EstimateFormData;
  errors: EstimateError | null;
  success: string | null;
  onInputChange: (
    section: "tradeIn" | "loanCalculation" | "taxInsuranceFees" | "legalFees" | "processingFees" | "salesPrice" | "document_type",
    name: string,
    value: string | number | boolean | number[]
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onAccessoryChange: (action: "add" | "remove", value: Accessory | number) => void;
}

const ConfirmDialog: React.FC<{
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  vehicle?: Vehicle;
  formData: EstimateFormData;
}> = ({ isOpen, onConfirm, onCancel, title, formData }) => {
  if (!isOpen) return null;

  const documentTypeText = formData.document_type === "estimate" ? "見積書" : formData.document_type === "invoice" ? "請求書" : "注文書";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">以下の内容で{documentTypeText}を作成します：</p>
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
          <Button type="button" onClick={onConfirm}>
            作成する
          </Button>
        </div>
      </div>
    </div>
  );
};

// 車両情報コンポーネント
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

// 下取り車両情報コンポーネント
const TradeInInfo: React.FC<{
  tradeIn: EstimateFormData["tradeIn"];
  onInputChange: (section: "tradeIn", field: string, value: string | number | boolean) => void;
  errors?: EstimateError | null;
}> = ({ tradeIn, onInputChange, errors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let finalValue: string | number | boolean = value;
    if (type === "number") finalValue = Number(value);
    if (type === "radio" && (value === "true" || value === "false")) finalValue = value === "true";

    onInputChange("tradeIn", name, finalValue);
  };

  const getFieldError = (fieldName: string): string | undefined => {
    if (!errors || !errors.tradeIn) return undefined;
    return typeof errors.tradeIn === "string" ? errors.tradeIn : errors.tradeIn[fieldName];
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">下取り車両情報</h2>

      {/* 下取りありなしラジオボタン */}
      <div className="mb-4">
        <label className="mr-4 font-medium">下取りの有無</label>
        <label className="mr-4">
          <input type="radio" name="trade_in_available" value="true" checked={tradeIn.trade_in_available === true} onChange={handleChange} />
          <span className="ml-1">あり</span>
        </label>
        <label>
          <input type="radio" name="trade_in_available" value="false" checked={tradeIn.trade_in_available === false} onChange={handleChange} />
          <span className="ml-1">なし</span>
        </label>
      </div>

      {/* 下取りありの場合のみ入力必須にする */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="車名"
          name="vehicle_name"
          value={tradeIn.vehicle_name}
          onChange={handleChange}
          error={getFieldError("vehicle_name")}
          placeholder="例: トヨタ カローラ"
          required={tradeIn.trade_in_available === true}
          disabled={!tradeIn.trade_in_available}
        />
        <Input
          label="登録番号"
          name="registration_number"
          value={tradeIn.registration_number}
          onChange={handleChange}
          error={getFieldError("registration_number")}
          placeholder="例: 1234-5678"
          required={tradeIn.trade_in_available === true}
          disabled={!tradeIn.trade_in_available}
        />
        <Input
          label="走行距離 (km)"
          name="mileage"
          type="text"
          inputMode="numeric"
          value={tradeIn.mileage?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("mileage")}
          placeholder="0以上の数値"
          required={tradeIn.trade_in_available === true}
          disabled={!tradeIn.trade_in_available}
        />
        <Input
          label="初度登録年月"
          name="first_registration_date"
          type="date"
          value={tradeIn.first_registration_date || ""}
          onChange={handleChange}
          error={getFieldError("first_registration_date")}
          required={tradeIn.trade_in_available === true}
          disabled={!tradeIn.trade_in_available}
        />
        <Input
          label="車検満了日"
          name="inspection_expiry_date"
          type="date"
          value={tradeIn.inspection_expiry_date || ""}
          onChange={handleChange}
          error={getFieldError("inspection_expiry_date")}
          required={tradeIn.trade_in_available === true}
          disabled={!tradeIn.trade_in_available}
        />
        <Input
          label="車台番号"
          name="chassis_number"
          value={tradeIn.chassis_number}
          onChange={handleChange}
          error={getFieldError("chassis_number")}
          placeholder="例: ZVW50-1234567"
          required={tradeIn.trade_in_available === true}
          disabled={!tradeIn.trade_in_available}
        />
        <Input
          label="外装色"
          name="exterior_color"
          value={tradeIn.exterior_color}
          onChange={handleChange}
          error={getFieldError("exterior_color")}
          placeholder="例: ホワイトパールクリスタルシャイン"
          required={tradeIn.trade_in_available === true}
          disabled={!tradeIn.trade_in_available}
        />
      </div>

      {errors?.tradeIn && typeof errors.tradeIn === "string" && <div className="mt-4 text-sm text-red-600">{errors.tradeIn}</div>}
    </div>
  );
};

// ローン計算情報コンポーネント
const LoanCalculationComponent: React.FC<{
  loanCalculation: EstimateFormData["loanCalculation"];
  cashSalesPrice: number; // 現金販売価格を受け取る
  onInputChange: (section: "loanCalculation", name: string, value: number | string | number[]) => void;
  errors?: EstimateError | null;
}> = ({ loanCalculation, cashSalesPrice, onInputChange, errors }) => {
  // 現金・割賦元金を自動計算（現金販売価格 - 頭金）
  const calculatedPrincipal = Math.max(0, (cashSalesPrice || 0) - (loanCalculation.down_payment || 0));

  // 分割支払金合計を自動計算（現金・割賦元金 + 分割払手数料）
  const calculatedTotalPayment = calculatedPrincipal + (loanCalculation.interest_fee || 0);

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

  // 現金・割賦元金と分割支払金合計の自動更新
  React.useEffect(() => {
    // 現金・割賦元金の自動更新
    if (loanCalculation.principal !== calculatedPrincipal) {
      onInputChange("loanCalculation", "principal", calculatedPrincipal);
    }

    // 分割支払金合計の自動更新
    if (loanCalculation.total_payment !== calculatedTotalPayment) {
      onInputChange("loanCalculation", "total_payment", calculatedTotalPayment);
    }
  }, [
    calculatedPrincipal,
    loanCalculation.principal,
    calculatedTotalPayment,
    loanCalculation.total_payment,
    loanCalculation.interest_fee, // 分割払手数料の変更も監視
    onInputChange,
  ]);

  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">ローン計算情報</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="頭金"
          name="down_payment"
          type="text"
          currency={true}
          inputMode="numeric"
          value={loanCalculation.down_payment?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("down_payment")}
          placeholder="0"
        />
        <div className="md:col-span-1">
          <Input
            label="現金・割賦元金"
            name="principal"
            type="text"
            currency={true}
            inputMode="numeric"
            value={calculatedPrincipal || ""}
            error={getFieldError("principal")}
            placeholder="自動計算"
            disabled={true}
            className="bg-gray-100 font-semibold"
          />
          <div className="text-sm text-gray-500 mt-1">
            <p>現金販売価格({cashSalesPrice?.toLocaleString() || 0}円) - 頭金</p>
          </div>
        </div>
        <Input
          label="分割払手数料"
          name="interest_fee"
          type="text"
          currency={true}
          inputMode="numeric"
          value={loanCalculation.interest_fee?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("interest_fee")}
          placeholder="0"
        />
        <div className="md:col-span-1">
          <Input
            label="分割支払金合計"
            name="total_payment"
            type="text"
            currency={true}
            inputMode="numeric"
            value={calculatedTotalPayment || ""}
            error={getFieldError("total_payment")}
            placeholder="自動計算"
            disabled={true}
            className="bg-gray-100 font-semibold"
          />
          <div className="text-sm text-gray-500 mt-1">
            <p>現金・割賦元金({calculatedPrincipal?.toLocaleString() || 0}円) + 分割払手数料</p>
          </div>
        </div>

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
          currency={true}
          inputMode="numeric"
          value={loanCalculation.first_payment?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("first_payment")}
          placeholder="0"
        />
        <Input
          label="月々支払額"
          name="monthly_payment"
          type="text"
          currency={true}
          inputMode="numeric"
          value={loanCalculation.monthly_payment?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("monthly_payment")}
          placeholder="0"
        />
        <Input
          label="ボーナス加算額"
          name="bonus_amount"
          type="text"
          currency={true}
          inputMode="numeric"
          value={loanCalculation.bonus_amount?.toString() ?? ""}
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

// AccessoriesInfo コンポーネントを追加
import { accessorySchema } from "../../validations/estimate/page";

const AccessoriesInfo: React.FC<{
  accessories: Accessory[];
  onInputChange: (action: "add" | "remove", value: Accessory | number) => void;
  errors?: EstimateError | null;
}> = ({ accessories, onInputChange, errors }) => {
  // 初期値は空文字列に設定
  const [newAccessory, setNewAccessory] = useState<{ name: string; price: string | number }>({
    name: "",
    price: "", // 初期値を空文字列に変更
  });
  const [localErrors, setLocalErrors] = useState<{ name?: string; price?: string }>({});

  // 追加ボタン押下時にaccessorySchemaを使用してバリデーション
  const handleAddAccessory = () => {
    // 価格を数値に変換
    const accessoryData = {
      name: newAccessory.name,
      price: typeof newAccessory.price === "string" ? parseInt(newAccessory.price) || 0 : newAccessory.price,
    };

    // accessorySchemaを使ってバリデーション
    const validationResult = accessorySchema.safeParse(accessoryData);

    if (!validationResult.success) {
      // zodのエラー形式を変換
      const formattedErrors: { name?: string; price?: string } = {};

      validationResult.error.errors.forEach((err) => {
        const path = err.path[0] as string;
        formattedErrors[path as keyof typeof formattedErrors] = err.message;
      });

      // エラーを表示して処理を中断
      setLocalErrors(formattedErrors);
      return;
    }

    // バリデーション通過後に付属品を追加
    onInputChange("add", accessoryData as Accessory);

    // 入力フィールドとエラーをリセット
    setNewAccessory({ name: "", price: "" });
    setLocalErrors({});
  };

  const handleRemoveAccessory = (index: number) => {
    onInputChange("remove", index);
  };

  // 入力値変更時のハンドラ - バリデーションは行わない
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAccessory({ ...newAccessory, name: e.target.value });
    // バリデーションエラーがあれば消去
    if (localErrors.name) {
      setLocalErrors({ ...localErrors, name: undefined });
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 直接入力値を設定（変換しない）
    setNewAccessory({ ...newAccessory, price: e.target.value });

    // バリデーションエラーがあれば消去
    if (localErrors.price) {
      setLocalErrors({ ...localErrors, price: undefined });
    }
  };

  // サーバーサイドエラーの取得関数
  const getServerError = (fieldName: string): string | undefined => {
    if (!errors || !errors.accessories) return undefined;

    if (typeof errors.accessories === "string") {
      return errors.accessories;
    } else if (typeof errors.accessories === "object") {
      return errors.accessories[fieldName];
    }

    return undefined;
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">（A）付属品・特別仕様</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="品名"
            value={newAccessory.name}
            onChange={handleNameChange}
            error={localErrors.name || getServerError("name")}
            placeholder="例: ナビゲーションシステム"
          />
          <Input
            label="価格"
            type="text" // numberからtextに変更
            currency={true}
            inputMode="numeric" // 数字キーボードを表示
            value={newAccessory.price}
            onChange={handlePriceChange}
            error={localErrors.price || getServerError("price")}
            placeholder="0以上の数値"
          />
        </div>
        <div className="flex justify-end">
          <Button type="button" onClick={handleAddAccessory} className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            追加
          </Button>
        </div>

        {accessories.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">登録済み付属品</h3>
            <div className="space-y-2">
              {accessories.map((accessory, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div>
                    <span className="font-medium">{accessory.name}</span>
                    <span className="ml-4 text-gray-600">¥{Number(accessory.price).toLocaleString()}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAccessory(index)}
                    className="text-red-600 hover:text-red-700"
                    aria-label={`${accessory.name}を削除`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* サーバーサイドバリデーションエラーの表示 */}
        {errors?.accessories && typeof errors.accessories === "string" && <div className="mt-4 text-sm text-red-600">{errors.accessories}</div>}

        {/* 既に追加された付属品のサーバーサイドエラーがあれば表示 */}
        {errors?.accessories &&
          typeof errors.accessories === "object" &&
          Object.entries(errors.accessories)
            .filter(([key]) => key.includes("."))
            .map(([key, value]) => (
              <div key={key} className="mt-2 text-sm text-red-600">
                付属品 {parseInt(key.split(".")[0]) + 1}: {value}
              </div>
            ))}
      </div>
    </div>
  );
};

// TaxInsuranceInfo コンポーネント追加
const TaxInsuranceInfo: React.FC<{
  taxInsuranceFees: EstimateFormData["taxInsuranceFees"];
  onInputChange: (section: "taxInsuranceFees", field: string, value: string | number) => void;
  errors?: EstimateError | null;
}> = ({ taxInsuranceFees, onInputChange, errors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? 0 : parseInt(value);
    onInputChange("taxInsuranceFees", name, numValue);
  };

  const getFieldError = (fieldName: string): string | undefined => {
    if (!errors || !errors.taxInsuranceFees) return undefined;
    return typeof errors.taxInsuranceFees === "string" ? errors.taxInsuranceFees : errors.taxInsuranceFees[fieldName];
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">（B）税金・保険料内訳</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="自動車税"
          name="automobile_tax"
          type="text"
          currency={true}
          inputMode="numeric"
          value={taxInsuranceFees.automobile_tax?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("automobile_tax")}
          placeholder="0"
        />
        <Input
          label="環境性能割"
          name="environmental_performance_tax"
          type="text"
          currency={true}
          inputMode="numeric"
          value={taxInsuranceFees.environmental_performance_tax?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("environmental_performance_tax")}
          placeholder="0"
        />
        <Input
          label="重量税"
          name="weight_tax"
          type="text"
          currency={true}
          inputMode="numeric"
          value={taxInsuranceFees.weight_tax?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("weight_tax")}
          placeholder="0"
        />
        <Input
          label="自賠責保険料"
          name="liability_insurance_fee"
          type="text"
          currency={true}
          inputMode="numeric"
          value={taxInsuranceFees.liability_insurance_fee?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("liability_insurance_fee")}
          placeholder="0"
        />
        <Input
          label="任意保険料"
          name="voluntary_insurance_fee"
          type="text"
          currency={true}
          inputMode="numeric"
          value={taxInsuranceFees.voluntary_insurance_fee?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("voluntary_insurance_fee")}
          placeholder="0"
        />
      </div>
      {errors?.taxInsuranceFees && typeof errors.taxInsuranceFees === "string" && <div className="mt-4 text-sm text-red-600">{errors.taxInsuranceFees}</div>}
    </div>
  );
};

// LegalFeesInfo コンポーネント追加
const LegalFeesInfo: React.FC<{
  legalFees: EstimateFormData["legalFees"];
  onInputChange: (section: "legalFees", field: string, value: string | number) => void;
  errors?: EstimateError | null;
}> = ({ legalFees, onInputChange, errors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? 0 : parseInt(value);
    onInputChange("legalFees", name, numValue);
  };

  const getFieldError = (fieldName: string): string | undefined => {
    if (!errors || !errors.legalFees) return undefined;
    return typeof errors.legalFees === "string" ? errors.legalFees : errors.legalFees[fieldName];
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">（C）預り法定費用内訳</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="検査登録印紙代"
          name="inspection_registration_stamp"
          type="text"
          currency={true}
          inputMode="numeric"
          value={legalFees.inspection_registration_stamp?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("inspection_registration_stamp")}
          placeholder="0"
        />
        <Input
          label="車庫証明印紙代"
          name="parking_certificate_stamp"
          type="text"
          currency={true}
          inputMode="numeric"
          value={legalFees.parking_certificate_stamp?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("parking_certificate_stamp")}
          placeholder="0"
        />
        <Input
          label="下取車印紙代"
          name="trade_in_stamp"
          type="text"
          currency={true}
          inputMode="numeric"
          value={legalFees.trade_in_stamp?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("trade_in_stamp")}
          placeholder="0"
        />
        <Input
          label="リサイクル預託金"
          name="recycling_deposit"
          type="text"
          currency={true}
          inputMode="numeric"
          value={legalFees.recycling_deposit?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("recycling_deposit")}
          placeholder="0"
        />
        <Input
          label="その他非課税"
          name="other_nontaxable"
          type="text"
          currency={true}
          inputMode="numeric"
          value={legalFees.other_nontaxable?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("other_nontaxable")}
          placeholder="0"
        />
      </div>
      {errors?.legalFees && typeof errors.legalFees === "string" && <div className="mt-4 text-sm text-red-600">{errors.legalFees}</div>}
    </div>
  );
};

// ProcessingFeesInfo コンポーネント追加
const ProcessingFeesInfo: React.FC<{
  processingFees: EstimateFormData["processingFees"];
  onInputChange: (section: "processingFees", field: string, value: string | number) => void;
  errors?: EstimateError | null;
}> = ({ processingFees, onInputChange, errors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? 0 : parseInt(value);
    onInputChange("processingFees", name, numValue);
  };

  const getFieldError = (fieldName: string): string | undefined => {
    if (!errors || !errors.processingFees) return undefined;
    return typeof errors.processingFees === "string" ? errors.processingFees : errors.processingFees[fieldName];
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">（D）手続代行費用内訳</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="検査登録費用"
          name="inspection_registration_fee"
          type="text"
          currency={true}
          inputMode="numeric"
          value={processingFees.inspection_registration_fee?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("inspection_registration_fee")}
          placeholder="0"
        />
        <Input
          label="車庫証明費用"
          name="parking_certificate_fee"
          type="text"
          currency={true}
          inputMode="numeric"
          value={processingFees.parking_certificate_fee?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("parking_certificate_fee")}
          placeholder="0"
        />
        <Input
          label="下取車手続費用"
          name="trade_in_processing_fee"
          type="text"
          currency={true}
          inputMode="numeric"
          value={processingFees.trade_in_processing_fee?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("trade_in_processing_fee")}
          placeholder="0"
        />
        <Input
          label="下取車査定費用"
          name="trade_in_assessment_fee"
          type="text"
          currency={true}
          inputMode="numeric"
          value={processingFees.trade_in_assessment_fee?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("trade_in_assessment_fee")}
          placeholder="0"
        />
        <Input
          label="リサイクル管理費用"
          name="recycling_management_fee"
          type="text"
          currency={true}
          inputMode="numeric"
          value={processingFees.recycling_management_fee?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("recycling_management_fee")}
          placeholder="0"
        />
        <Input
          label="納車費用"
          name="delivery_fee"
          type="text"
          currency={true}
          inputMode="numeric"
          value={processingFees.delivery_fee?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("delivery_fee")}
          placeholder="0"
        />
        <Input
          label="その他費用"
          name="other_fees"
          type="text"
          currency={true}
          inputMode="numeric"
          value={processingFees.other_fees?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("other_fees")}
          placeholder="0"
        />
      </div>
      {errors?.processingFees && typeof errors.processingFees === "string" && <div className="mt-4 text-sm text-red-600">{errors.processingFees}</div>}
    </div>
  );
};

// SalesPriceInfo コンポーネント改善（不足カラム追加版）
const SalesPriceInfo: React.FC<{
  salesPrice: EstimateFormData["salesPrice"];
  taxInsuranceFees: EstimateFormData["taxInsuranceFees"];
  legalFees: EstimateFormData["legalFees"];
  processingFees: EstimateFormData["processingFees"];
  accessories: Accessory[]; // 付属品情報を追加
  onInputChange: (section: "salesPrice", field: string, value: string | number) => void;
  errors?: EstimateError | null;
}> = ({ salesPrice, taxInsuranceFees, legalFees, processingFees, accessories, onInputChange, errors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? 0 : parseInt(value);
    onInputChange("salesPrice", name, numValue);
  };

  const getFieldError = (fieldName: string): string | undefined => {
    if (!errors || !errors.salesPrice) return undefined;
    return typeof errors.salesPrice === "string" ? errors.salesPrice : errors.salesPrice[fieldName];
  };

  // 税金・保険料の合計を計算
  const totalTaxInsurance =
    (taxInsuranceFees.automobile_tax || 0) +
    (taxInsuranceFees.environmental_performance_tax || 0) +
    (taxInsuranceFees.weight_tax || 0) +
    (taxInsuranceFees.liability_insurance_fee || 0) +
    (taxInsuranceFees.voluntary_insurance_fee || 0);

  // 法定費用の合計を計算
  const totalLegalFee =
    (legalFees.inspection_registration_stamp || 0) +
    (legalFees.parking_certificate_stamp || 0) +
    (legalFees.trade_in_stamp || 0) +
    (legalFees.recycling_deposit || 0) +
    (legalFees.other_nontaxable || 0);

  // 手続代行費用の合計を計算
  const totalProcessingFee =
    (processingFees.inspection_registration_fee || 0) +
    (processingFees.parking_certificate_fee || 0) +
    (processingFees.trade_in_processing_fee || 0) +
    (processingFees.trade_in_assessment_fee || 0) +
    (processingFees.recycling_management_fee || 0) +
    (processingFees.delivery_fee || 0) +
    (processingFees.other_fees || 0);

  // 付属品費用の合計を計算
  const totalAccessoriesFee = accessories.reduce((total, accessory) => {
    return total + (typeof accessory.price === "number" ? accessory.price : 0);
  }, 0);

  // 車両販売価格(1)の合計を計算（車両本体価格 - 値引き + 車検整備費用 + 付属品・特別仕様）
  const calculatedVehiclePrice = (salesPrice.base_price || 0) - (salesPrice.discount || 0) + (salesPrice.inspection_fee || 0) + totalAccessoriesFee;

  // 販売諸費用(2)の合計を計算（税金・保険料 + 預り法定費用 + 手続代行費用）
  const totalMiscFee = totalTaxInsurance + totalLegalFee + totalProcessingFee;

  // 追加計算: 現金販売価格(1)+(2)を計算（車両販売価格(1) + 販売諸費用(2)）
  const calculatedTotalBeforeTax = calculatedVehiclePrice + totalMiscFee;

  // 消費税を計算（現金販売価格(1)+(2)の10%）
  const calculatedConsumptionTax = Math.floor(calculatedTotalBeforeTax * 0.1);

  // 最終的な現金販売価格(1)+(2)を計算（税込み）
  const calculatedTotalPrice = calculatedTotalBeforeTax + calculatedConsumptionTax;

  // 支払総額を計算（総額 - 下取り価格 + 下取り債務）
  const calculatedPaymentTotal = calculatedTotalPrice - (salesPrice.trade_in_price || 0) + (salesPrice.trade_in_debt || 0);

  // コンポーネントがマウントされた時や依存する値が変更された時に自動更新
  React.useEffect(() => {
    // 税金・保険料の自動更新
    if (salesPrice.tax_insurance !== totalTaxInsurance) {
      onInputChange("salesPrice", "tax_insurance", totalTaxInsurance);
    }

    // 法定費用の自動更新
    if (salesPrice.legal_fee !== totalLegalFee) {
      onInputChange("salesPrice", "legal_fee", totalLegalFee);
    }

    // 手続代行費用の自動更新
    if (salesPrice.processing_fee !== totalProcessingFee) {
      onInputChange("salesPrice", "processing_fee", totalProcessingFee);
    }

    // 付属品費用の自動更新
    if (salesPrice.accessories_fee !== totalAccessoriesFee) {
      onInputChange("salesPrice", "accessories_fee", totalAccessoriesFee);
    }

    // 車両販売価格(1)の自動更新
    if (salesPrice.vehicle_price !== calculatedVehiclePrice) {
      onInputChange("salesPrice", "vehicle_price", calculatedVehiclePrice);
    }

    // 販売諸費用(2)の自動更新
    if (salesPrice.misc_fee !== totalMiscFee) {
      onInputChange("salesPrice", "misc_fee", totalMiscFee);
    }

    // 消費税の自動更新
    if (salesPrice.consumption_tax !== calculatedConsumptionTax) {
      onInputChange("salesPrice", "consumption_tax", calculatedConsumptionTax);
    }

    // 現金販売価格(1)+(2)の自動更新
    if (salesPrice.total_price !== calculatedTotalPrice) {
      onInputChange("salesPrice", "total_price", calculatedTotalPrice);
    }

    // 支払総額の自動更新
    if (salesPrice.payment_total !== calculatedPaymentTotal) {
      onInputChange("salesPrice", "payment_total", calculatedPaymentTotal);
    }
  }, [
    // 依存関係を全て列挙
    totalTaxInsurance,
    salesPrice.tax_insurance,
    totalLegalFee,
    salesPrice.legal_fee,
    totalProcessingFee,
    salesPrice.processing_fee,
    totalAccessoriesFee,
    salesPrice.accessories_fee,
    calculatedVehiclePrice,
    salesPrice.vehicle_price,
    totalMiscFee,
    salesPrice.misc_fee,
    calculatedConsumptionTax,
    salesPrice.consumption_tax,
    calculatedTotalPrice,
    salesPrice.total_price,
    calculatedPaymentTotal,
    salesPrice.payment_total,
    salesPrice.base_price,
    salesPrice.discount,
    salesPrice.inspection_fee,
    salesPrice.trade_in_price,
    salesPrice.trade_in_debt,
    onInputChange,
  ]);

  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">販売価格情報</h2>

      {/* 基本価格情報 */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-3">基本価格・車両販売価格(1)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="車両本体価格"
            name="base_price"
            type="text"
            currency={true}
            inputMode="numeric"
            value={salesPrice.base_price?.toString() ?? ""}
            onChange={handleChange}
            error={getFieldError("base_price")}
            placeholder="0"
          />
          <Input
            label="値引き"
            name="discount"
            type="text"
            currency={true}
            inputMode="numeric"
            value={salesPrice.discount?.toString() ?? ""}
            onChange={handleChange}
            error={getFieldError("discount")}
            placeholder="0"
          />
          <Input
            label="車検整備費用"
            name="inspection_fee"
            type="text"
            currency={true}
            inputMode="numeric"
            value={salesPrice.inspection_fee?.toString() ?? ""}
            onChange={handleChange}
            error={getFieldError("inspection_fee")}
            placeholder="0"
          />
          <Input
            label="付属品・特別仕様"
            name="accessories_fee"
            type="text"
            currency={true}
            inputMode="numeric"
            value={totalAccessoriesFee || ""}
            error={getFieldError("accessories_fee")}
            placeholder="自動計算"
            disabled={true}
            className="bg-gray-100"
          />
          <div className="md:col-span-2">
            <Input
              label="車両販売価格(1)"
              name="vehicle_price"
              type="text"
              currency={true}
              inputMode="numeric"
              value={calculatedVehiclePrice || ""}
              error={getFieldError("vehicle_price")}
              placeholder="自動計算"
              disabled={true}
              className="bg-gray-100 font-semibold"
            />
            <div className="text-sm text-gray-500 mt-1">
              <p>車両本体価格 - 値引き + 車検整備費用 + 付属品・特別仕様</p>
            </div>
          </div>
        </div>
      </div>

      {/* 自動計算フィールド */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-3">販売諸費用(2)の内訳</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="税金・保険料"
            name="tax_insurance"
            type="text"
            currency={true}
            inputMode="numeric"
            value={totalTaxInsurance || ""}
            error={getFieldError("tax_insurance")}
            placeholder="自動計算"
            disabled={true}
            className="bg-gray-100"
          />
          <Input
            label="預り法定費用"
            name="legal_fee"
            type="text"
            currency={true}
            inputMode="numeric"
            value={totalLegalFee || ""}
            error={getFieldError("legal_fee")}
            placeholder="自動計算"
            disabled={true}
            className="bg-gray-100"
          />
          <Input
            label="手続代行費用"
            name="processing_fee"
            type="text"
            currency={true}
            inputMode="numeric"
            value={totalProcessingFee || ""}
            error={getFieldError("processing_fee")}
            placeholder="自動計算"
            disabled={true}
            className="bg-gray-100"
          />
          <div className="md:col-span-1">
            <Input
              label="販売諸費用(2)"
              name="misc_fee"
              type="text"
              currency={true}
              inputMode="numeric"
              value={totalMiscFee || ""}
              error={getFieldError("misc_fee")}
              placeholder="自動計算"
              disabled={true}
              className="bg-gray-100 font-semibold"
            />
            <div className="text-sm text-gray-500 mt-1">
              <p>上記3項目の合計</p>
            </div>
          </div>
        </div>
      </div>

      {/* その他費用と下取り情報 */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-3">販売諸費用・下取り情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="下取車価格"
            name="trade_in_price"
            type="text"
            currency={true}
            inputMode="numeric"
            value={salesPrice.trade_in_price?.toString() ?? ""}
            onChange={handleChange}
            error={getFieldError("trade_in_price")}
            placeholder="0"
          />
          <Input
            label="下取車残債"
            name="trade_in_debt"
            type="text"
            currency={true}
            inputMode="numeric"
            value={salesPrice.trade_in_debt?.toString() ?? ""}
            onChange={handleChange}
            error={getFieldError("trade_in_debt")}
            placeholder="0"
          />
        </div>
      </div>

      {/* 最終計算結果 */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-3">最終金額（自動計算）</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="現金販売価格(1)+(2)"
              name="total_price"
              type="text"
              currency={true}
              inputMode="numeric"
              value={calculatedTotalBeforeTax || ""}
              error={getFieldError("total_price")}
              placeholder="自動計算"
              disabled={true}
              className="bg-gray-100 font-semibold"
            />
            <div className="text-sm text-gray-500 mt-1">
              <p>車両販売価格(1) + 販売諸費用(2)</p>
            </div>
          </div>
          <Input
            label="内消費税"
            name="consumption_tax"
            type="text"
            currency={true}
            inputMode="numeric"
            value={calculatedConsumptionTax || ""}
            error={getFieldError("consumption_tax")}
            placeholder="自動計算（10%）"
            disabled={true}
            className="bg-gray-100"
          />
          <Input
            label="税込み総額"
            name="total_with_tax"
            type="text"
            currency={true}
            inputMode="numeric"
            value={calculatedTotalPrice || ""}
            placeholder="自動計算"
            disabled={true}
            className="bg-gray-100"
          />
          <div className="md:col-span-2">
            <Input
              label="お支払総額"
              name="payment_total"
              type="text"
              currency={true}
              inputMode="numeric"
              value={calculatedPaymentTotal || ""}
              error={getFieldError("payment_total")}
              placeholder="自動計算"
              disabled={true}
              className="bg-gray-100 text-lg font-semibold"
            />
          </div>
        </div>
      </div>

      {errors?.salesPrice && typeof errors.salesPrice === "string" && <div className="mt-4 text-sm text-red-600">{errors.salesPrice}</div>}
    </div>
  );
};

// メインコンポーネント
const EstimateComponent: React.FC<EstimateComponentProps> = ({
  loading,
  error,
  vehicle,
  formData,
  errors,
  success,
  onInputChange,
  onSubmit,
  onCancel,
  onAccessoryChange,
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  // 現金販売価格の計算（SalesPriceInfoと同じロジック）
  const totalTaxInsurance =
    (formData.taxInsuranceFees.automobile_tax || 0) +
    (formData.taxInsuranceFees.environmental_performance_tax || 0) +
    (formData.taxInsuranceFees.weight_tax || 0) +
    (formData.taxInsuranceFees.liability_insurance_fee || 0) +
    (formData.taxInsuranceFees.voluntary_insurance_fee || 0);

  const totalLegalFee =
    (formData.legalFees.inspection_registration_stamp || 0) +
    (formData.legalFees.parking_certificate_stamp || 0) +
    (formData.legalFees.trade_in_stamp || 0) +
    (formData.legalFees.recycling_deposit || 0) +
    (formData.legalFees.other_nontaxable || 0);

  const totalProcessingFee =
    (formData.processingFees.inspection_registration_fee || 0) +
    (formData.processingFees.parking_certificate_fee || 0) +
    (formData.processingFees.trade_in_processing_fee || 0) +
    (formData.processingFees.trade_in_assessment_fee || 0) +
    (formData.processingFees.recycling_management_fee || 0) +
    (formData.processingFees.delivery_fee || 0) +
    (formData.processingFees.other_fees || 0);

  const totalAccessoriesFee = (formData.accessories || []).reduce((total, accessory) => {
    return total + (typeof accessory.price === "number" ? accessory.price : 0);
  }, 0);

  const calculatedVehiclePrice =
    (formData.salesPrice.base_price || 0) - (formData.salesPrice.discount || 0) + (formData.salesPrice.inspection_fee || 0) + totalAccessoriesFee;

  const totalMiscFee = totalTaxInsurance + totalLegalFee + totalProcessingFee;

  // 現金販売価格(1)+(2)（税抜き）
  const cashSalesPrice = calculatedVehiclePrice + totalMiscFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーションチェック（エラーがある場合は確認ダイアログを表示しない）
    if (errors && Object.keys(errors).length > 0) {
      onSubmit(e); // 既存の処理でバリデーションエラーを表示
      return;
    }

    // 確認ダイアログを表示
    setShowConfirmDialog(true);
  };

  // 確認ダイアログでOKが押された場合
  const handleConfirmSubmit = () => {
    setShowConfirmDialog(false);
    // 実際の処理実行（新しいイベントオブジェクトを作成）
    const syntheticEvent = {
      preventDefault: () => {},
      target: {},
      currentTarget: {},
    } as React.FormEvent;
    onSubmit(syntheticEvent);
  };

  // 確認ダイアログでキャンセルが押された場合
  const handleCancelSubmit = () => {
    setShowConfirmDialog(false);
  };

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
              {/* 書類種別選択 - 追加 */}
              <div className="ml-4 border-b border-gray-200 pb-6 pt-4">
                <h2 className="text-lg font-medium text-gray-900 my-4">書類種別</h2>
                <div className="max-w-xs">
                  {" "}
                  {/* ★横幅を制限 */}
                  <Select
                    label="作成する書類"
                    name="document_type"
                    value={formData.document_type || "estimate"}
                    onChange={(e) => onInputChange("document_type", "document_type", e.target.value)}
                    error={errors?.document_type}
                    required
                  >
                    <option value="estimate">見積書</option>
                    <option value="invoice">請求書</option>
                    <option value="order">注文書</option>
                  </Select>
                </div>
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

              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* 車両情報のみ外部から取得した値で表示 */}
                {vehicle && <VehicleInfo vehicle={vehicle} />}
                {/* 下取り車両情報コンポーネントを使用 */}
                <TradeInInfo tradeIn={formData.tradeIn} onInputChange={onInputChange} errors={errors} />
                {/* ローン計算情報コンポーネントを使用 */}
                <LoanCalculationComponent
                  loanCalculation={formData.loanCalculation}
                  cashSalesPrice={cashSalesPrice}
                  onInputChange={onInputChange}
                  errors={errors}
                />
                {/* (A)付属品情報コンポーネントを使用 */}
                <AccessoriesInfo accessories={formData.accessories || []} onInputChange={onAccessoryChange} errors={errors} />
                {/* (B)税金・保険料コンポーネントを追加 */}
                <TaxInsuranceInfo taxInsuranceFees={formData.taxInsuranceFees} onInputChange={onInputChange} errors={errors} />
                {/* (C)法定費用コンポーネントを追加 */}
                <LegalFeesInfo legalFees={formData.legalFees} onInputChange={onInputChange} errors={errors} />
                {/* (D)手続代行費用コンポーネントを追加 */}
                <ProcessingFeesInfo processingFees={formData.processingFees} onInputChange={onInputChange} errors={errors} />
                {/* 販売価格情報コンポーネントを使用 - 全ての必要な情報を渡す */}
                <SalesPriceInfo
                  salesPrice={formData.salesPrice}
                  taxInsuranceFees={formData.taxInsuranceFees}
                  legalFees={formData.legalFees}
                  processingFees={formData.processingFees}
                  accessories={formData.accessories || []} // 付属品情報を渡す
                  onInputChange={onInputChange}
                  errors={errors}
                />
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
      {/* ★ここに確認ダイアログを追加★ */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
        title="書類作成確認"
        vehicle={vehicle}
        formData={formData}
      />
    </div>
  );
};

export default EstimateComponent;
