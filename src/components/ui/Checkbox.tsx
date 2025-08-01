// src/components/ui/Checkbox.tsx
import React from "react";

interface CheckboxProps {
  id?: string; // オプショナルに変更
  label: string;
  name: string;
  value?: string | number;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 明示的な型
  className?: string;
  disabled?: boolean;
  error?: string;
}

// コンポーネントをエクスポート
const Checkbox: React.FC<CheckboxProps> = ({ id, label, name, value, checked, onChange, className = "", disabled = false, error }) => {
  // nameを元に一意のIDを生成
  const inputId = id || `checkbox-${name}`;

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={inputId}
          name={name}
          value={value?.toString() || ""}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`h-4 w-4 rounded text-red-600 focus:ring-red-500 ${error ? "border-red-500" : "border-gray-300"}`}
        />
        <label htmlFor={inputId} className={`ml-2 block text-sm font-medium ${disabled ? "text-gray-400" : "text-gray-700"} cursor-pointer`}>
          {label}
        </label>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// 必ずデフォルトエクスポートを追加
export default Checkbox;
