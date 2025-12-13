"use client";

import React from "react";
import { FormField } from "./FormField";
import { OTPInput } from "./OTPInput";
import { Button } from "@/shared/components/ui/button";
import { Mail } from "lucide-react";
import { VALIDATION_PATTERNS } from "@/lib/validations/html5-patterns";
export interface EmailVerificationStepProps {
  email: string;
  otp: string;
  otpSent: boolean;
  countdown: number;
  isSendingOtp: boolean;
  isVerifyingOtp: boolean;
  errors: Record<string, string>;
  onEmailChange: (value: string) => void;
  onOtpChange: (value: string) => void;
  onSendOtp: () => void;
  onResendOtp: () => void;
  onVerifyOtp: () => void;
}
export const EmailVerificationStep: React.FC<EmailVerificationStepProps> = ({
  email,
  otp,
  otpSent,
  countdown,
  isSendingOtp,
  isVerifyingOtp,
  errors,
  onEmailChange,
  onOtpChange,
  onSendOtp,
  onResendOtp,
  onVerifyOtp
}) => {
  return <div className="space-y-6">
      {}
      <FormField id="email" name="email" type="email" label="Email" placeholder="example@email.com" value={email} onChange={e => onEmailChange(e.target.value)} error={errors.email} icon={<Mail className="w-5 h-5" />} required pattern={VALIDATION_PATTERNS.email} disabled={otpSent} />

      {}
      {!otpSent && <Button type="button" onClick={onSendOtp} disabled={isSendingOtp || !email} className="w-full">
          {isSendingOtp ? <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang gửi...
            </> : "Gửi mã OTP"}
        </Button>}

      {}
      {otpSent && <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Mã OTP <span className="text-red-500">*</span>
            </label>
            <OTPInput value={otp} onChange={onOtpChange} length={6} autoFocus error={errors.otp} />
            <p className="text-xs text-gray-500">
              Mã OTP đã được gửi đến email của bạn
            </p>
          </div>

          {}
          <div className="text-center">
            {countdown > 0 ? <p className="text-sm text-gray-600">
                Bạn có thể gửi lại mã sau{" "}
                <span className="font-semibold text-primary">{countdown}s</span>
              </p> : <button type="button" onClick={onResendOtp} disabled={isSendingOtp} className="text-sm text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isSendingOtp ? "Đang gửi..." : "Không nhận được mã? Gửi lại"}
              </button>}
          </div>

          {}
          <Button type="button" onClick={onVerifyOtp} disabled={isVerifyingOtp || otp.length !== 6} className="w-full">
            {isVerifyingOtp ? <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xác thực...
              </> : "Xác thực OTP"}
          </Button>
        </div>}
    </div>;
};