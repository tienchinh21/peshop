"use client";

import React, { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
export interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  minLength?: number;
}
export const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  minLength
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && " *"}
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input id={id} name={name} type={showPassword ? "text" : "password"} placeholder={placeholder} value={value} onChange={onChange} required={required} minLength={minLength} className={`pl-10 pr-10 ${error ? "border-red-500 focus:ring-red-500" : ""}`} />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>;
};