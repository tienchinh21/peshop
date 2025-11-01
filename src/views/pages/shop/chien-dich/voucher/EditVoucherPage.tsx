"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VoucherForm } from "@/components/shop/VoucherForm";
import {
  useVoucherDetail,
  useUpdateVoucher,
} from "@/hooks/shop/useShopVouchers";
import type { CreateVoucherPayload } from "@/types/shops/voucher.type";
import { VoucherType } from "@/lib/utils/enums/eVouchers";
import { ArrowLeft } from "lucide-react";
import _ from "lodash";

interface EditVoucherPageProps {
  voucherId: string;
}

export default function EditVoucherPage({ voucherId }: EditVoucherPageProps) {
  const router = useRouter();
  const { data, isLoading, error } = useVoucherDetail(voucherId);
  const updateMutation = useUpdateVoucher();

  const voucher = _.get(data, "content");

  const handleBack = () => {
    router.push("/shop/chien-dich/ma-giam-gia");
  };

  const handleSubmit = async (formData: CreateVoucherPayload) => {
    try {
      // Nếu voucher là giảm giá tiền trực tiếp, set maxDiscountAmount = null
      const payload = {
        ...formData,
        maxDiscountAmount:
          formData.type === VoucherType.FIXED_AMOUNT
            ? (null as any)
            : formData.maxDiscountAmount,
      };
      await updateMutation.mutateAsync({
        id: voucherId,
        payload,
      });
      router.push("/shop/chien-dich/ma-giam-gia");
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !voucher) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <div className="text-center text-red-600 p-6">
          Không tìm thấy mã giảm giá hoặc có lỗi xảy ra
        </div>
      </div>
    );
  }

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
              Chỉnh sửa mã giảm giá
            </h1>
            <p className="text-sm text-gray-500">{voucher.name}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <VoucherForm
        mode="edit"
        initialData={voucher}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}
