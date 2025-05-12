import React from "react";

interface CheckboxProps {
  id: string;
  label: string;
  name: string;
  value: string | number;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, label, name, value, checked, onChange, className = "", disabled = false }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value.toString()}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 rounded text-red-600 focus:ring-red-500 border-gray-300"
      />
      <label htmlFor={id} className={`ml-2 block text-sm font-medium ${disabled ? "text-gray-400" : "text-gray-700"} cursor-pointer`}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
