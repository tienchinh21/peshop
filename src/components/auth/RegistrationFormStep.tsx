"use client";

import React from "react";
import { FormField } from "./FormField";
import { PasswordField } from "./PasswordField";
import { Button } from "@/components/ui/button";
import { User, UserCircle, ArrowLeft } from "lucide-react";
import { VALIDATION_PATTERNS } from "@/lib/validations/html5-patterns";

export interface RegistrationFormStepProps {
  email: string;
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
  errors: Record<string, string>;
  isLoading: boolean;
  onFieldChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export const RegistrationFormStep: React.FC<RegistrationFormStepProps> = ({
  email,
  username,
  name,
  password,
  confirmPassword,
  errors,
  isLoading,
  onFieldChange,
  onSubmit,
  onBack,
}) => {
  return (
    <div className="space-y-6">
      {/* Verified Email (Read-only) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Email đã xác thực
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <UserCircle className="w-5 h-5" />
          </div>
          <input
            type="email"
            value={email}
            disabled
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-green-600">✓ Email đã được xác thực</p>
      </div>

      {/* Username Field */}
      <FormField
        id="username"
        name="username"
        type="text"
        label="Tên đăng nhập"
        placeholder="Nhập tên đăng nhập"
        value={username}
        onChange={(e) => onFieldChange("username", e.target.value)}
        error={errors.username}
        icon={<User className="w-5 h-5" />}
        required
        pattern={VALIDATION_PATTERNS.username}
        minLength={3}
        maxLength={50}
      />

      {/* Name Field */}
      <FormField
        id="name"
        name="name"
        type="text"
        label="Họ và tên"
        placeholder="Nhập họ và tên đầy đủ"
        value={name}
        onChange={(e) => onFieldChange("name", e.target.value)}
        error={errors.name}
        icon={<UserCircle className="w-5 h-5" />}
        required
        pattern={VALIDATION_PATTERNS.name}
        minLength={2}
        maxLength={100}
      />

      {/* Password Field */}
      <PasswordField
        id="password"
        name="password"
        label="Mật khẩu"
        placeholder="Nhập mật khẩu"
        value={password}
        onChange={(e) => onFieldChange("password", e.target.value)}
        error={errors.password}
        required
        minLength={6}
      />

      {/* Confirm Password Field */}
      <PasswordField
        id="confirmPassword"
        name="confirmPassword"
        label="Xác nhận mật khẩu"
        placeholder="Nhập lại mật khẩu"
        value={confirmPassword}
        onChange={(e) => onFieldChange("confirmPassword", e.target.value)}
        error={errors.confirmPassword}
        required
        minLength={6}
      />

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        {/* Back Button */}
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        {/* Submit Button */}
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang đăng ký...
            </>
          ) : (
            "Hoàn tất đăng ký"
          )}
        </Button>
      </div>
    </div>
  );
};
