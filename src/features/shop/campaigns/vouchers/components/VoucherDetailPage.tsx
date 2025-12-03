"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useVoucherDetail } from "../hooks";
import {
  VoucherStatus,
  VoucherStatusLabels,
  VoucherStatusColors,
  VoucherType,
  VoucherTypeLabels,
} from "@/lib/utils/enums/eVouchers";
import {
  ArrowLeft,
  Ticket,
  Calendar,
  Settings,
  Edit,
  Users,
} from "lucide-react";
import _ from "lodash";

interface VoucherDetailPageProps {
  voucherId: string;
}

export default function VoucherDetailPage({
  voucherId,
}: VoucherDetailPageProps) {
  const router = useRouter();
  const { data, isLoading, error } = useVoucherDetail(voucherId);

  const voucher = _.get(data, "content");

  const handleBack = () => {
    router.push("/shop/chien-dich/ma-giam-gia");
  };

  const handleEdit = () => {
    router.push(`/shop/chien-dich/ma-giam-gia/sua/${voucherId}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: number) => {
    const statusEnum = status as VoucherStatus;
    const label = VoucherStatusLabels[statusEnum] || "Không xác định";
    const colorClass = VoucherStatusColors[statusEnum] || "bg-gray-500";

    return (
      <Badge variant="secondary" className={colorClass}>
        {label}
      </Badge>
    );
  };

  const getDiscountDisplay = (type: number, value: number) => {
    if (type === VoucherType.PERCENTAGE) {
      return `${value}%`;
    }
    return formatPrice(value);
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
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Không tìm thấy mã giảm giá hoặc có lỗi xảy ra
            </div>
          </CardContent>
        </Card>
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
            <h1 className="text-2xl font-bold text-gray-900">{voucher.name}</h1>
            <p className="text-sm text-gray-500">Chi tiết mã giảm giá</p>
          </div>
        </div>
        <Button onClick={handleEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          Chỉnh sửa
        </Button>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tên mã giảm giá</p>
              <p className="font-medium">{voucher.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Mã code</p>
              <code className="rounded bg-gray-100 px-3 py-1 text-sm font-mono">
                {voucher.code}
              </code>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
              {getStatusBadge(voucher.status)}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Loại giảm giá</p>
              <Badge variant="outline">
                {VoucherTypeLabels[voucher.type as VoucherType]}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discount Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cài đặt giảm giá
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Giá trị giảm</p>
              <p className="text-2xl font-bold text-green-600">
                {getDiscountDisplay(voucher.type, voucher.discountValue)}
              </p>
            </div>
            {voucher.type === VoucherType.PERCENTAGE &&
              voucher.maxDiscountAmount &&
              voucher.maxDiscountAmount > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Giảm tối đa</p>
                  <p className="text-xl font-semibold">
                    {formatPrice(voucher.maxDiscountAmount)}
                  </p>
                </div>
              )}
            <div>
              <p className="text-sm text-gray-500 mb-1">Đơn hàng tối thiểu</p>
              <p className="text-xl font-semibold">
                {voucher.minimumOrderValue && voucher.minimumOrderValue > 0
                  ? formatPrice(voucher.minimumOrderValue)
                  : "Không yêu cầu"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quantity & Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Số lượng & Sử dụng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng số lượng</p>
              <p className="text-2xl font-bold">{voucher.quantity}</p>
            </div>
            {!_.isNil(voucher.quantityUsed) && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Đã sử dụng</p>
                <p className="text-2xl font-bold text-blue-600">
                  {voucher.quantityUsed}
                </p>
              </div>
            )}
            {!_.isNil(voucher.quantityUsed) && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Còn lại</p>
                <p className="text-2xl font-bold text-orange-600">
                  {voucher.quantity - voucher.quantityUsed}
                </p>
              </div>
            )}
            {voucher.limitForUser && (
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Giới hạn/người dùng
                </p>
                <p className="text-xl font-semibold">{voucher.limitForUser}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Time Period */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Thời gian áp dụng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Ngày bắt đầu</p>
              <p className="font-medium">{formatDate(voucher.startTime)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Ngày kết thúc</p>
              <p className="font-medium">{formatDate(voucher.endTime)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
