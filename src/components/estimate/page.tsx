// src/components/estimate/page.tsx
import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import type { EstimateError, EstimateFormData, ShippingInfo } from "../../validations/estimate/page";
import { Vehicle } from "../../server/estimate/handler_000";
import { Accessory } from "../../types/db/accessories";
import { Plus, Trash2 } from "lucide-react";
import ShippingAreaSelector from "./ShippingAreaSelector";

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
  onShippingChange: (shippingInfo: ShippingInfo) => void;
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
          <p className="text-sm text-gray-500">グレード</p>
          <p className="text-base">{vehicle.grade || "-"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">型式</p>
          <p className="text-base">{vehicle.model_code || "-"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">ボディーカラー</p>
          <p className="text-base">{vehicle.color || "-"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">走行距離</p>
          <p className="text-base">{vehicle.mileage.toLocaleString()}km</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">車両本体価格</p>
          <p className="text-base">¥{vehicle.price.toLocaleString()}（税込）</p>
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

  // ★年利による自動計算ロジック★
  const calculateFromAnnualRate = React.useCallback(() => {
    if (calculatedPrincipal > 0 && loanCalculation.annual_rate > 0 && loanCalculation.payment_count > 0) {
      const result = calculateLoanPayments({
        principal: calculatedPrincipal,
        annualRate: loanCalculation.annual_rate,
        paymentCount: loanCalculation.payment_count,
        bonusAmount: loanCalculation.bonus_amount,
        bonusMonths: loanCalculation.bonus_months || [],
      });

      return result;
    }

    return {
      monthlyPayment: 0,
      interestFee: 0,
      totalPayment: calculatedPrincipal,
    };
  }, [calculatedPrincipal, loanCalculation.annual_rate, loanCalculation.payment_count, loanCalculation.bonus_amount, loanCalculation.bonus_months]);

  // 自動計算結果
  const autoCalculatedValues = calculateFromAnnualRate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // 支払回数が変更された場合
    if (name === "payment_count") {
      const numValue = value === "" ? 0 : parseInt(value, 10);
      onInputChange("loanCalculation", name, numValue);
    } else if (name === "annual_rate") {
      // ★年利の処理（小数点対応）
      const numValue = value === "" ? 0 : parseFloat(value);
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

  // ★自動計算値の更新 - 年利による計算を優先
  React.useEffect(() => {
    const shouldUpdate =
      loanCalculation.principal !== calculatedPrincipal ||
      (loanCalculation.annual_rate > 0 &&
        (loanCalculation.monthly_payment !== autoCalculatedValues.monthlyPayment ||
          loanCalculation.interest_fee !== autoCalculatedValues.interestFee ||
          loanCalculation.total_payment !== autoCalculatedValues.totalPayment));

    if (shouldUpdate) {
      // 現金・割賦元金の自動更新
      if (loanCalculation.principal !== calculatedPrincipal) {
        onInputChange("loanCalculation", "principal", calculatedPrincipal);
      }

      // 年利による自動計算値の更新（年利が入力されている場合のみ）
      if (loanCalculation.annual_rate > 0) {
        if (loanCalculation.monthly_payment !== autoCalculatedValues.monthlyPayment) {
          onInputChange("loanCalculation", "monthly_payment", autoCalculatedValues.monthlyPayment);
        }
        if (loanCalculation.interest_fee !== autoCalculatedValues.interestFee) {
          onInputChange("loanCalculation", "interest_fee", autoCalculatedValues.interestFee);
        }
        if (loanCalculation.total_payment !== autoCalculatedValues.totalPayment) {
          onInputChange("loanCalculation", "total_payment", autoCalculatedValues.totalPayment);
        }
      }
    }
  }, [
    calculatedPrincipal,
    autoCalculatedValues,
    loanCalculation.principal,
    loanCalculation.monthly_payment,
    loanCalculation.interest_fee,
    loanCalculation.total_payment,
    loanCalculation.annual_rate,
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
          taxStatus="taxIncluded" // 頭金は税込価格から支払う
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
            taxStatus="taxIncluded" // 現金・割賦元金は税込
          />
          <div className="text-sm text-gray-500 mt-1">
            <p>現金販売価格({cashSalesPrice?.toLocaleString() || 0}円) - 頭金</p>
          </div>
        </div>

        <Input
          label="年利（%）"
          name="annual_rate"
          type="number"
          step="0.01"
          min="0"
          max="50"
          inputMode="decimal"
          value={loanCalculation.annual_rate?.toString() ?? ""}
          onChange={handleChange}
          error={getFieldError("annual_rate")}
          placeholder="例: 5.25"
          taxStatus="none" // 年利は金額ではない
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
          taxStatus="none" // 期間は金額ではない
        />

        <div className="md:col-span-1">
          <Input
            label="分割払手数料"
            name="interest_fee"
            type="text"
            currency={true}
            inputMode="numeric"
            value={loanCalculation.annual_rate > 0 ? autoCalculatedValues.interestFee : loanCalculation.interest_fee?.toString() ?? ""}
            onChange={handleChange}
            error={getFieldError("interest_fee")}
            placeholder={loanCalculation.annual_rate > 0 ? "年利から自動計算" : "0"}
            disabled={loanCalculation.annual_rate > 0}
            className={loanCalculation.annual_rate > 0 ? "bg-gray-100 font-semibold" : ""}
            taxStatus="nonTaxable" // 分割払手数料（利息）は非課税
          />
          <div className="text-sm text-gray-500 mt-1">
            {loanCalculation.annual_rate > 0 ? <p>利息総額（年利 {loanCalculation.annual_rate}%）</p> : <p>年利を入力すると自動計算されます</p>}
          </div>
        </div>

        <div className="md:col-span-1">
          <Input
            label="分割支払金合計"
            name="total_payment"
            type="text"
            currency={true}
            inputMode="numeric"
            value={loanCalculation.annual_rate > 0 ? autoCalculatedValues.totalPayment : calculatedPrincipal + (loanCalculation.interest_fee || 0)}
            error={getFieldError("total_payment")}
            placeholder="自動計算"
            disabled={true}
            className="bg-gray-100 font-semibold"
            taxStatus="taxIncluded" // 分割支払金合計は税込
          />
          <div className="text-sm text-gray-500 mt-1">
            <p>現金・割賦元金({calculatedPrincipal?.toLocaleString() || 0}円) + 分割払手数料</p>
          </div>
        </div>

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
          taxStatus="taxIncluded" // 初回支払いは税込
        />

        <div className="md:col-span-1">
          <Input
            label="月々支払額"
            name="monthly_payment"
            type="text"
            currency={true}
            inputMode="numeric"
            value={loanCalculation.annual_rate > 0 ? autoCalculatedValues.monthlyPayment : loanCalculation.monthly_payment?.toString() ?? ""}
            onChange={handleChange}
            error={getFieldError("monthly_payment")}
            placeholder={loanCalculation.annual_rate > 0 ? "年利から自動計算" : "0"}
            disabled={loanCalculation.annual_rate > 0}
            className={loanCalculation.annual_rate > 0 ? "bg-gray-100 font-semibold" : ""}
            taxStatus="taxIncluded" // 月々支払額は税込
          />
          <div className="text-sm text-gray-500 mt-1">
            {loanCalculation.annual_rate > 0 ? <p>年利 {loanCalculation.annual_rate}% で自動計算</p> : <p>年利を入力すると自動計算されます</p>}
          </div>
        </div>

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
          taxStatus="taxIncluded" // ボーナス加算額は税込
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

      {/* ★年利使用時の計算詳細表示★ */}
      {loanCalculation.annual_rate > 0 && calculatedPrincipal > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">計算詳細</h4>
          <div className="text-sm text-blue-700 grid grid-cols-2 gap-2">
            <div>借入元金: {calculatedPrincipal.toLocaleString()}円</div>
            <div>年利: {loanCalculation.annual_rate}%</div>
            <div>月利: {(loanCalculation.annual_rate / 12).toFixed(3)}%</div>
            <div>返済回数: {loanCalculation.payment_count}回</div>
          </div>
        </div>
      )}

      {errors?.loanCalculation && typeof errors.loanCalculation === "string" && <div className="mt-4 text-sm text-red-600">{errors.loanCalculation}</div>}
    </div>
  );
};

// AccessoriesInfo コンポーネントを追加
import { accessorySchema } from "../../validations/estimate/page";
import { calculateLoanPayments } from "../../utils/loanCalculation";

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
            taxStatus="none" // 品名は金額ではないので税区分なし
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
            taxStatus="taxExcluded" // 付属品は消費税対象（税抜入力）
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
                    <span className="ml-2 px-2 py-1 text-xs font-medium rounded-md border bg-blue-50 border-blue-200 text-blue-600">税抜</span>
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
          taxStatus="nonTaxable" // 税金は非課税
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
          taxStatus="nonTaxable" // 税金は非課税
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
          taxStatus="nonTaxable" // 税金は非課税
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
          taxStatus="nonTaxable" // 保険料は非課税
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
          taxStatus="nonTaxable" // 印紙代は非課税
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
          taxStatus="nonTaxable" // 印紙代は非課税
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
          taxStatus="nonTaxable" // 印紙代は非課税
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
          taxStatus="nonTaxable" // 預託金は非課税
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
          taxStatus="nonTaxable" // 非課税項目
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
          taxStatus="taxExcluded" // 手続代行費用は消費税対象（税抜入力）
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
          taxStatus="taxExcluded" // 手続代行費用は消費税対象（税抜入力）
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
          taxStatus="taxExcluded" // 手続代行費用は消費税対象（税抜入力）
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
          taxStatus="taxExcluded" // 手続代行費用は消費税対象（税抜入力）
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
          taxStatus="taxExcluded" // 手続代行費用は消費税対象（税抜入力）
        />
      </div>
      {errors?.processingFees && typeof errors.processingFees === "string" && <div className="mt-4 text-sm text-red-600">{errors.processingFees}</div>}
    </div>
  );
};

// SalesPriceInfo コンポーネント改善（不足カラム追加版）
// SalesPriceInfo コンポーネント完全版（全ての修正を含む）
const SalesPriceInfo: React.FC<{
  salesPrice: EstimateFormData["salesPrice"];
  taxInsuranceFees: EstimateFormData["taxInsuranceFees"];
  legalFees: EstimateFormData["legalFees"];
  processingFees: EstimateFormData["processingFees"];
  accessories: Accessory[];
  onInputChange: (section: "salesPrice", field: string, value: string | number) => void;
  errors?: EstimateError | null;
}> = ({ salesPrice, taxInsuranceFees, legalFees, processingFees, accessories, onInputChange, errors }) => {
  
  // 入力値変更ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? 0 : parseInt(value);
    onInputChange("salesPrice", name, numValue);
  };

  // エラー取得関数
  const getFieldError = (fieldName: string): string | undefined => {
    if (!errors || !errors.salesPrice) return undefined;
    return typeof errors.salesPrice === "string" ? errors.salesPrice : errors.salesPrice[fieldName];
  };

  // =================== 計算ロジック ===================
  
  // 税金・保険料の合計を計算（消費税非対象）
  const totalTaxInsurance =
    (taxInsuranceFees.automobile_tax || 0) +
    (taxInsuranceFees.environmental_performance_tax || 0) +
    (taxInsuranceFees.weight_tax || 0) +
    (taxInsuranceFees.liability_insurance_fee || 0);

  // 法定費用の合計を計算（消費税非対象）
  const totalLegalFee =
    (legalFees.inspection_registration_stamp || 0) +
    (legalFees.parking_certificate_stamp || 0) +
    (legalFees.trade_in_stamp || 0) +
    (legalFees.recycling_deposit || 0) +
    (legalFees.other_nontaxable || 0);

  // 手続代行費用の合計を計算（消費税対象）
  const totalProcessingFee =
    (processingFees.inspection_registration_fee || 0) +
    (processingFees.parking_certificate_fee || 0) +
    (processingFees.recycling_management_fee || 0) +
    (processingFees.delivery_fee || 0) +
    (processingFees.other_fees || 0);

  // 付属品費用の合計を計算（消費税対象）
  const totalAccessoriesFee = accessories.reduce((total, accessory) => {
    return total + (typeof accessory.price === "number" ? accessory.price : 0);
  }, 0);

  // ★修正：消費税対象項目の計算（税抜き）
  const taxableAmount = 
    (salesPrice.base_price || 0) - (salesPrice.discount || 0) + 
    (salesPrice.inspection_fee || 0) + 
    totalAccessoriesFee + 
    totalProcessingFee;

  // ★修正：消費税非対象項目の計算
  const nonTaxableAmount = totalTaxInsurance + totalLegalFee;

  // ★修正：消費税の正しい計算（消費税対象項目のみに10%）
  const calculatedConsumptionTax = Math.floor(taxableAmount * 0.1);

  // 車両販売価格(1)の計算（消費税対象のみ、税抜き）
  const calculatedVehiclePrice = (salesPrice.base_price || 0) - (salesPrice.discount || 0) + (salesPrice.inspection_fee || 0) + totalAccessoriesFee;

  // 販売諸費用(2)の計算（消費税対象＋非対象の合計）
  const totalMiscFee = totalTaxInsurance + totalLegalFee + totalProcessingFee;

  // ★修正：最終的な総額計算（税抜き＋消費税＋非課税）
  const calculatedTotalPrice = taxableAmount + calculatedConsumptionTax + nonTaxableAmount;

  // 支払総額を計算（総額 - 下取り価格 + 下取り債務）
  const calculatedPaymentTotal = calculatedTotalPrice - (salesPrice.trade_in_price || 0) + (salesPrice.trade_in_debt || 0);

  // 税抜き総額の計算
  const taxBeforeTaxTotal = taxableAmount + nonTaxableAmount;

  // =================== フォームデータ自動更新 ===================
  
  React.useEffect(() => {
    let updateNeeded = false;
    const updates: Array<{field: string, current: number, calculated: number}> = [];

    // 各項目をチェックして更新が必要かどうかを判断
    if (salesPrice.tax_insurance !== totalTaxInsurance) {
      updates.push({field: 'tax_insurance', current: salesPrice.tax_insurance || 0, calculated: totalTaxInsurance});
      updateNeeded = true;
    }
    if (salesPrice.legal_fee !== totalLegalFee) {
      updates.push({field: 'legal_fee', current: salesPrice.legal_fee || 0, calculated: totalLegalFee});
      updateNeeded = true;
    }
    if (salesPrice.processing_fee !== totalProcessingFee) {
      updates.push({field: 'processing_fee', current: salesPrice.processing_fee || 0, calculated: totalProcessingFee});
      updateNeeded = true;
    }
    if (salesPrice.accessories_fee !== totalAccessoriesFee) {
      updates.push({field: 'accessories_fee', current: salesPrice.accessories_fee || 0, calculated: totalAccessoriesFee});
      updateNeeded = true;
    }
    if (salesPrice.vehicle_price !== calculatedVehiclePrice) {
      updates.push({field: 'vehicle_price', current: salesPrice.vehicle_price || 0, calculated: calculatedVehiclePrice});
      updateNeeded = true;
    }
    if (salesPrice.misc_fee !== totalMiscFee) {
      updates.push({field: 'misc_fee', current: salesPrice.misc_fee || 0, calculated: totalMiscFee});
      updateNeeded = true;
    }
    if (salesPrice.consumption_tax !== calculatedConsumptionTax) {
      updates.push({field: 'consumption_tax', current: salesPrice.consumption_tax || 0, calculated: calculatedConsumptionTax});
      updateNeeded = true;
    }
    if (salesPrice.total_price !== calculatedTotalPrice) {
      updates.push({field: 'total_price', current: salesPrice.total_price || 0, calculated: calculatedTotalPrice});
      updateNeeded = true;
    }
    if (salesPrice.payment_total !== calculatedPaymentTotal) {
      updates.push({field: 'payment_total', current: salesPrice.payment_total || 0, calculated: calculatedPaymentTotal});
      updateNeeded = true;
    }

    if (updateNeeded) {
      console.log('✅ フォーム更新実行:', updates);
      
      // 個別に更新して確実に反映させる
      updates.forEach(update => {
        console.log(`🔄 ${update.field}: ${update.current.toLocaleString()} → ${update.calculated.toLocaleString()}`);
        onInputChange("salesPrice", update.field, update.calculated);
      });
    } else {
      console.log('⏸️ 更新不要: 全ての値が同期済み');
    }
  }, [
    // 依存関係を明確に列挙
    totalTaxInsurance, totalLegalFee, totalProcessingFee, totalAccessoriesFee,
    calculatedVehiclePrice, totalMiscFee, calculatedConsumptionTax, calculatedTotalPrice, calculatedPaymentTotal,
    salesPrice.tax_insurance, salesPrice.legal_fee, salesPrice.processing_fee, salesPrice.accessories_fee,
    salesPrice.vehicle_price, salesPrice.misc_fee, salesPrice.consumption_tax, salesPrice.total_price, salesPrice.payment_total,
    salesPrice.base_price, salesPrice.discount, salesPrice.inspection_fee, salesPrice.trade_in_price, salesPrice.trade_in_debt,
    onInputChange
  ]);

  // =================== JSX レンダリング ===================
  
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
            taxStatus="taxExcluded" // 車両価格は税抜入力
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
            taxStatus="taxExcluded" // 値引きも税抜
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
            taxStatus="taxExcluded" // 整備費用は税抜入力
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
            taxStatus="taxExcluded"
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
              className="bg-blue-50 font-semibold"
              taxStatus="taxExcluded"
            />
          </div>
        </div>
      </div>

      {/* 販売諸費用の内訳 */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-3">販売諸費用(2)の内訳</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
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
              taxStatus="nonTaxable"
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
              taxStatus="nonTaxable"
            />
          </div>
          <div className="space-y-4">
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
              className="bg-blue-50"
              taxStatus="taxExcluded"
            />
          </div>
        </div>

        <div className="mt-4">
          <Input
            label="販売諸費用(2)【税対象+非対象 合計】"
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
        </div>
      </div>

      {/* 下取り情報 */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-3">下取り情報</h3>
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
            taxStatus="nonTaxable" // 下取りは非課税
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
            taxStatus="nonTaxable" // 残債も非課税
          />
        </div>
      </div>

      {/* 税計算・最終金額 */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-3">税計算・最終金額</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="内消費税"
            name="consumption_tax"
            type="text"
            currency={true}
            inputMode="numeric"
            value={calculatedConsumptionTax || ""}
            error={getFieldError("consumption_tax")}
            placeholder="消費税対象額の10%"
            disabled={true}
            className="font-semibold"
          />
          <Input
            label="総額"
            name="total_before_tax"
            type="text"
            currency={true}
            inputMode="numeric"
            value={taxBeforeTaxTotal || ""}
            placeholder="自動計算"
            disabled={true}
            className="font-semibold"
            taxStatus="taxExcluded"
          />
          <Input
            label="総額"
            name="total_price"
            type="text"
            currency={true}
            inputMode="numeric"
            value={calculatedTotalPrice || ""}
            error={getFieldError("total_price")}
            placeholder="自動計算"
            disabled={true}
            className="font-semibold"
            taxStatus="taxIncluded"
          />
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
            className="bg-yellow-100 font-semibold"
          />
        </div>
      </div>

      {/* エラーメッセージ */}
      {errors?.salesPrice && typeof errors.salesPrice === "string" && <div className="mt-4 text-sm text-red-600">{errors.salesPrice}</div>}
    </div>
  );
};

// メインコンポーネント
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
  onShippingChange,
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // =================== 修正された現金販売価格の計算 ===================
  
  const totalTaxInsurance =
    (formData.taxInsuranceFees.automobile_tax || 0) +
    (formData.taxInsuranceFees.environmental_performance_tax || 0) +
    (formData.taxInsuranceFees.weight_tax || 0) +
    (formData.taxInsuranceFees.liability_insurance_fee || 0);

  const totalLegalFee =
    (formData.legalFees.inspection_registration_stamp || 0) +
    (formData.legalFees.parking_certificate_stamp || 0) +
    (formData.legalFees.trade_in_stamp || 0) +
    (formData.legalFees.recycling_deposit || 0) +
    (formData.legalFees.other_nontaxable || 0);

  const totalProcessingFee =
    (formData.processingFees.inspection_registration_fee || 0) +
    (formData.processingFees.parking_certificate_fee || 0) +
    (formData.processingFees.recycling_management_fee || 0) +
    (formData.processingFees.delivery_fee || 0) +
    (formData.processingFees.other_fees || 0);

  const totalAccessoriesFee = (formData.accessories || []).reduce((total, accessory) => {
    return total + (typeof accessory.price === "number" ? accessory.price : 0);
  }, 0);

  // ★修正：消費税対象項目の計算（税抜き）
  const taxableAmount = 
    (formData.salesPrice.base_price || 0) - 
    (formData.salesPrice.discount || 0) + 
    (formData.salesPrice.inspection_fee || 0) + 
    totalAccessoriesFee + 
    totalProcessingFee;

  // ★修正：消費税非対象項目の計算
  const nonTaxableAmount = totalTaxInsurance + totalLegalFee;

  // ★修正：消費税の正しい計算（消費税対象項目のみに10%）
  const calculatedConsumptionTax = Math.floor(taxableAmount * 0.1);

  // ★修正：現金販売価格（正しい計算）= 消費税対象（税抜き）+ 消費税 + 消費税非対象
  const cashSalesPrice = taxableAmount + calculatedConsumptionTax + nonTaxableAmount;

  // =================== フォーム送信処理 ===================
  
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

  // =================== ローディング・エラー処理 ===================
  
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

  // =================== メインレンダリング ===================
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow rounded-lg">

              {/* 書類種別選択 */}
              <div className="ml-4 border-b border-gray-200 pb-6 pt-4">
                <h2 className="text-lg font-medium text-gray-900 my-4">書類種別</h2>
                <div className="max-w-xs">
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

              {/* エラー・成功メッセージ */}
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

              {/* メインフォーム */}
              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                
                {/* 車両情報 */}
                {vehicle && <VehicleInfo vehicle={vehicle} />}
                
                {/* 下取り車両情報 */}
                <TradeInInfo tradeIn={formData.tradeIn} onInputChange={onInputChange} errors={errors} />
                
                {/* ローン計算情報 - 修正された現金販売価格を渡す */}
                <LoanCalculationComponent
                  loanCalculation={formData.loanCalculation}
                  cashSalesPrice={cashSalesPrice}
                  onInputChange={onInputChange}
                  errors={errors}
                />
                
                {/* 付属品情報 */}
                <AccessoriesInfo accessories={formData.accessories || []} onInputChange={onAccessoryChange} errors={errors} />
                
                {/* 税金・保険料 */}
                <TaxInsuranceInfo taxInsuranceFees={formData.taxInsuranceFees} onInputChange={onInputChange} errors={errors} />
                
                {/* 法定費用 */}
                <LegalFeesInfo legalFees={formData.legalFees} onInputChange={onInputChange} errors={errors} />
                
                {/* 手続代行費用 */}
                <ProcessingFeesInfo processingFees={formData.processingFees} onInputChange={onInputChange} errors={errors} />
                
                {/* 販売価格情報 - 修正版SalesPriceInfoコンポーネントを使用 */}
                <SalesPriceInfo
                  salesPrice={formData.salesPrice}
                  taxInsuranceFees={formData.taxInsuranceFees}
                  legalFees={formData.legalFees}
                  processingFees={formData.processingFees}
                  accessories={formData.accessories || []}
                  onInputChange={onInputChange}
                  errors={errors}
                />
                
                {/* 配送エリア選択 */}
                <ShippingAreaSelector shippingInfo={formData.shippingInfo} onShippingChange={onShippingChange} errors={errors} />
                
                {/* フォームボタン */}
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
      
      {/* 確認ダイアログ */}
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