// src/components/ui/Checkbox.tsx
import React, { forwardRef } from "react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ label, error, className = "", onKeyDown, ...props }, ref) => {
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

  return (
    <div className="w-full py-2">
      <div className="flex items-center">
        <input
          ref={ref}
          type="checkbox"
          className={`h-5 w-5 text-teal-500 focus:ring-teal-500 border-slate-300 rounded cursor-pointer ${className}`}
          onKeyDown={handleKeyDown}
          {...props}
        />
        <label className="ml-3 block text-sm font-medium text-slate-700 cursor-pointer">{label}</label>
      </div>
      {error && <p className="mt-1 text-sm text-red-600 ml-8">{error}</p>}
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;