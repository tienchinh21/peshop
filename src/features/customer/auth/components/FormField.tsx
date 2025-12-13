import React from "react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
export interface FormFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
}
export const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  pattern,
  minLength,
  maxLength
}) => {
  return <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && " *"}
      </Label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>}
        <Input id={id} name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled} required={required} pattern={pattern} minLength={minLength} maxLength={maxLength} className={`${icon ? "pl-10" : ""} ${error ? "border-red-500 focus:ring-red-500" : ""} ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`} />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>;
};