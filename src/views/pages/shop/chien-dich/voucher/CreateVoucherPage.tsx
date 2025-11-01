"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { VoucherForm } from "@/components/shop/VoucherForm";
import { useCreateVoucher } from "@/hooks/shop/useShopVouchers";
import type { CreateVoucherPayload } from "@/types/shops/voucher.type";
import { VoucherType } from "@/lib/utils/enums/eVouchers";
import { ArrowLeft } from "lucide-react";

export default function CreateVoucherPage() {
  const router = useRouter();
  const createMutation = useCreateVoucher();

  const handleBack = () => {
    router.push("/shop/chien-dich/ma-giam-gia");
  };

  const handleSubmit = async (data: CreateVoucherPayload) => {
    try {
      const payload = {
        ...data,
        maxDiscountAmount:
          data.type === VoucherType.FIXED_AMOUNT
            ? (null as any)
            : data.maxDiscountAmount,
      };
      await createMutation.mutateAsync(payload);
      router.push("/shop/chien-dich/ma-giam-gia");
    } catch (error) {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tạo mã giảm giá mới
            </h1>
            <p className="text-sm text-gray-500">
              Điền thông tin để tạo mã giảm giá cho shop
            </p>
          </div>
        </div>
      </div>

      <VoucherForm
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}
