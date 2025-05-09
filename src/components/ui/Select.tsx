// src / components / ui / Select.tsx;
import React, { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, className = "", children, onKeyDown, ...props }, ref) => {
  // エンターキー対策を組み込んだキーダウンハンドラー
  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
    // 元のonKeyDownも実行
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <div className="relative">
        <select
          ref={ref}
          className={`w-full px-3 py-2 bg-white border ${
            error ? "border-red-500" : "border-slate-300"
          } rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${className}`}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
        </select>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Select.displayName = "Select";

export default Select;