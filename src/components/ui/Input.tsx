// src/components/ui/Input.tsx
import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = "", type, onKeyDown, disabled, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

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

  // disabled の場合に適用する背景色のクラス
  const disabledClass = disabled ? "bg-gray-100" : "bg-white";

  return (
    <div className="w-full">
      {label && <label className={`block text-sm font-medium ${disabled ? "text-slate-500" : "text-slate-700"} mb-1`}>{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          type={isPassword && showPassword ? "text" : type}
          className={`w-full px-3 py-2 ${disabledClass} border ${error ? "border-red-500" : "border-slate-300"} rounded-md shadow-sm ${
            disabled ? "text-slate-500 placeholder-slate-300 cursor-not-allowed" : "text-slate-900 placeholder-slate-400"
          } focus:outline-none ${!disabled ? "focus:ring-2 focus:ring-teal-500 focus:border-transparent" : ""} ${isPassword ? "pr-10" : ""} ${className}`}
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
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
