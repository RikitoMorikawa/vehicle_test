// src/components/ui/Select.tsx
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
      {label && (
        <div className="flex items-center justify-between mb-1 h-6">
          <label className="text-sm font-medium text-slate-700 leading-6">{label}</label>
        </div>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`w-full px-3 py-2 bg-white border ${
            error ? "border-red-500" : "border-slate-300"
          } rounded-md shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none ${className}`}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
        </select>
        {/* カスタムドロップダウン矢印 */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Select.displayName = "Select";

export default Select;
