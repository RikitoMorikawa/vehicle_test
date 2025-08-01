// src/components/ui/Input.tsx
import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  currency?: boolean; // 金額表示用のプロパティを追加
  taxStatus?: "taxIncluded" | "taxExcluded" | "nonTaxable" | "none"; // 税区分の追加
  taxNote?: string; // カスタムの税区分メッセージ
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      className = "",
      type,
      onKeyDown,
      disabled,
      currency = false,
      taxStatus = "none", // デフォルトは表示なし
      taxNote,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    // 数値をカンマ区切りにフォーマットする関数
    const formatNumber = (num: string | number | readonly string[]): string => {
      if (!num && num !== 0) return "";
      if (Array.isArray(num)) return ""; // 配列の場合は空文字を返す
      const numStr = num.toString().replace(/[^\d]/g, ""); // 数字以外を除去
      if (!numStr) return "";
      const parsed = parseInt(numStr);
      return isNaN(parsed) ? "" : parsed.toLocaleString();
    };

    // カンマ区切りの数値を数値のみに変換する関数
    const parseNumber = (formattedNum: string): string => {
      const cleaned = formattedNum.replace(/[^\d]/g, "");
      return cleaned;
    };

    // 表示用の値を計算
    const getDisplayValue = () => {
      if (!currency || !(type === "text" || type === "number")) {
        return value;
      }

      if (value === "" || value === undefined || value === null) {
        return "";
      }

      // 既にフォーマット済みかチェック（カンマが含まれている場合）
      if (typeof value === "string" && value.includes(",")) {
        return value;
      }

      return formatNumber(value);
    };

    const displayValue = getDisplayValue();

    // 税区分の表示テキストとスタイルを取得
    const getTaxStatusDisplay = () => {
      if (taxNote) {
        return {
          text: taxNote,
          className: "text-purple-600 bg-purple-50 border-purple-200",
        };
      }

      switch (taxStatus) {
        case "taxIncluded":
          return {
            text: "税込",
            className: "text-green-600 bg-green-50 border-green-200",
          };
        case "taxExcluded":
          return {
            text: "税抜",
            className: "text-blue-600 bg-blue-50 border-blue-200",
          };
        case "nonTaxable":
          return {
            text: "非課税",
            className: "text-red-600 bg-red-50 border-red-200",
          };
        default:
          return null;
      }
    };

    const taxStatusDisplay = getTaxStatusDisplay();

    // エンターキー対策を組み込んだキーダウンハンドラー
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
      }
      // 元のonKeyDownも実行
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    // 金額入力の変更ハンドラー
    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return;

      if (!currency) {
        onChange(e);
        return;
      }

      const inputValue = e.target.value;
      // 数字のみを抽出
      const numericValue = parseNumber(inputValue);

      // 新しいイベントオブジェクトを作成（表示用にフォーマット済みの値を設定）
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          name: e.target.name,
          value: numericValue, // 親コンポーネントには数値のみを渡す
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(newEvent);
    };

    // disabled の場合に適用する背景色のクラス
    const disabledClass = disabled ? "bg-gray-100" : "bg-white";

    return (
      <div className="w-full">
        {/* ラベルと税区分を横並びで表示 - 高さを固定 */}
        <div className="flex items-center justify-between mb-1 h-6">
          {label && <label className={`text-sm font-medium ${disabled ? "text-slate-500" : "text-slate-700"} leading-6`}>{label}</label>}
          {taxStatusDisplay && (
            <span className={`px-2 py-0.5 text-xs font-medium rounded-md border ${taxStatusDisplay.className} leading-none`}>{taxStatusDisplay.text}</span>
          )}
        </div>

        <div className="relative">
          <input
            ref={ref}
            type={isPassword && showPassword ? "text" : currency ? "text" : type}
            className={`w-full px-3 py-2 ${disabledClass} border ${error ? "border-red-500" : "border-slate-300"} rounded-md shadow-sm ${
              disabled ? "text-slate-500 placeholder-slate-300 cursor-not-allowed" : "text-slate-900 placeholder-slate-400"
            } focus:outline-none ${!disabled ? "focus:ring-2 focus:ring-teal-500 focus:border-transparent" : ""} ${
              isPassword ? "pr-10" : currency ? "pr-8" : ""
            } ${className}`}
            value={displayValue}
            onChange={currency ? handleCurrencyChange : onChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className={`absolute inset-y-0 right-0 pr-3 flex items-center ${disabled ? "text-gray-300" : "text-gray-400 hover:text-gray-600"}`}
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
          {currency && !isPassword && (
            <div className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none ${disabled ? "text-slate-400" : "text-slate-600"}`}>
              <span className="text-sm">円</span>
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
