// src/components/ui/Input.tsx
import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  currency?: boolean; // 金額表示用のプロパティを追加
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
      currency = false, // デフォルトはfalse
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
        {label && <label className={`block text-sm font-medium ${disabled ? "text-slate-500" : "text-slate-700"} mb-1`}>{label}</label>}
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
