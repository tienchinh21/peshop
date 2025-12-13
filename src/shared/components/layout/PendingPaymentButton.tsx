"use client";

import React from "react";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCurrentUser } from "@/lib/store/slices/authSlice";
import { Button } from "@/shared/components/ui/button";

export function PendingPaymentButton() {
  const user = useAppSelector(selectCurrentUser);
  const processing = user?.orderPaymentProcessing;

  const count = processing?.paymentLink ? 1 : 0;
  const paymentLink: string | undefined = processing?.paymentLink;

  if (!count || !paymentLink) return null;

  const handleClick = () => {
    if (typeof window !== "undefined" && paymentLink) {
      window.location.href = paymentLink;
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="rounded-lg shadow-lg bg-background border border-border px-4 py-3 flex items-center gap-3">
        <div className="text-sm">Bạn có {count} đơn hàng cần thanh toán</div>
        <Button
          size="sm"
          onClick={handleClick}
          className="bg-primary text-primary-foreground"
        >
          Thanh toán ngay
        </Button>
      </div>
    </div>
  );
}

export default PendingPaymentButton;
