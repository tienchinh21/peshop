"use client";

import React, { useRef, useEffect, KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";
interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  maxLength?: number;
  autoFocus?: boolean;
  error?: string;
}
export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length,
  maxLength,
  autoFocus = false,
  error
}) => {
  const otpLength = maxLength || length || 6;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);
  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue && !/^\d$/.test(inputValue)) {
      return;
    }
    const newValue = value.split("");
    newValue[index] = inputValue;
    const updatedValue = newValue.join("").slice(0, otpLength);
    onChange(updatedValue);
    if (inputValue && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const digits = pastedData.replace(/\D/g, "").slice(0, otpLength);
    if (digits) {
      onChange(digits);
      const nextIndex = Math.min(digits.length, otpLength - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };
  const getDigitValue = (index: number): string => {
    return value[index] || "";
  };
  return <div className="space-y-2">
      <div className="grid gap-2" style={{
      gridTemplateColumns: `repeat(${otpLength}, minmax(0, 1fr))`
    }}>
        {Array.from({
        length: otpLength
      }).map((_, index) => <input key={index} ref={el => {
        inputRefs.current[index] = el;
      }} type="text" inputMode="numeric" maxLength={1} value={getDigitValue(index)} onChange={e => handleChange(index, e)} onKeyDown={e => handleKeyDown(index, e)} onPaste={handlePaste} aria-label={`Digit ${index + 1} of ${otpLength}`} className={`
              h-12 w-full text-center text-lg font-semibold
              border rounded-md
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              transition-all
              ${error ? "border-red-500" : "border-gray-300"}
            `} />)}
      </div>
      {error && <p className="text-sm text-red-500" role="alert">
          {error}
        </p>}
    </div>;
};