"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return <OTPInput data-slot="input-otp" containerClassName={cn("flex items-center gap-3 has-disabled:opacity-50", containerClassName)} className={cn("disabled:cursor-not-allowed", className)} {...props} />;
}
function InputOTPGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div data-slot="input-otp-group" className={cn("flex items-center gap-2", className)} {...props} />;
}
function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const {
    char,
    hasFakeCaret,
    isActive
  } = inputOTPContext?.slots[index] ?? {};
  return <div data-slot="input-otp-slot" data-active={isActive} className={cn("relative flex h-12 w-12 items-center justify-center", "rounded-lg border-2 border-gray-300 bg-white", "text-lg font-semibold text-gray-900", "shadow-sm transition-all duration-200", "outline-none", "hover:border-gray-400", "data-[active=true]:border-primary data-[active=true]:ring-4 data-[active=true]:ring-primary/20", "data-[active=true]:shadow-md", "has-[char]:border-primary has-[char]:bg-primary/5", "aria-invalid:border-red-500", "data-[active=true]:aria-invalid:border-red-500 data-[active=true]:aria-invalid:ring-red-500/20", "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100", className)} {...props}>
      {char}
      {hasFakeCaret && <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-primary h-5 w-0.5 duration-1000" />
        </div>}
    </div>;
}
function InputOTPSeparator({
  ...props
}: React.ComponentProps<"div">) {
  return <div data-slot="input-otp-separator" role="separator" className="flex items-center justify-center" {...props}>
      <MinusIcon className="h-4 w-4 text-gray-400" />
    </div>;
}
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };