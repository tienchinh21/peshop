"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { VoucherForm } from "./VoucherForm";
import { useVoucherDetail, useUpdateVoucher } from "../hooks";
import type { CreateVoucherPayload, UpdateVoucherPayload } from "../types";
import { VoucherType, VoucherStatus } from "@/lib/utils/enums/eVouchers";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import _ from "lodash";
interface EditVoucherPageProps {
  voucherId: string;
}
export default function EditVoucherPage({
  voucherId
}: EditVoucherPageProps) {
  const router = useRouter();
  const {
    data,
    isLoading,
    error
  } = useVoucherDetail(voucherId);
  const updateMutation = useUpdateVoucher();
  const voucher = _.get(data, "content");
  const handleBack = () => {
    router.push("/shop/chien-dich/ma-giam-gia");
  };
  const handleSubmit = async (formData: CreateVoucherPayload) => {
    try {
      const voucherStatus = voucher?.status;
      if (voucherStatus === VoucherStatus.EXPIRED) {
        toast.error("Không thể cập nhật voucher đã hết hạn");
        return;
      }
      let payload: UpdateVoucherPayload = {};
      if (voucherStatus === VoucherStatus.INACTIVE) {
        payload = {
          name: formData.name,
          discountValue: formData.discountValue,
          maxDiscountAmount: formData.type === VoucherType.FIXED_AMOUNT ? undefined : formData.maxDiscountAmount,
          minimumOrderValue: formData.minimumOrderValue,
          quantity: formData.quantity,
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString()
        };
      } else if (voucherStatus === VoucherStatus.ACTIVE) {
        payload = {
          name: formData.name,
          quantity: formData.quantity
        };
      }
      await updateMutation.mutateAsync({
        id: voucherId,
        payload
      });
      router.push("/shop/chien-dich/ma-giam-gia");
    } catch (error) {}
  };
  if (isLoading) {
    return <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>;
  }
  if (error || !voucher) {
    return <div className="space-y-6">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <div className="text-center text-red-600 p-6">
          Không tìm thấy mã giảm giá hoặc có lỗi xảy ra
        </div>
      </div>;
  }
  return <div className="space-y-6">
      {}
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

      {}
      <VoucherForm mode="edit" initialData={voucher} onSubmit={handleSubmit} isSubmitting={updateMutation.isPending} />
    </div>;
}