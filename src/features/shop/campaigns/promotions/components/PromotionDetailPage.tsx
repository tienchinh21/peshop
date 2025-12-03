"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import {
  ArrowLeft,
  Gift,
  Info,
  Calendar,
  Settings,
  Edit,
  Package,
  ShoppingCart,
} from "lucide-react";
import type { Promotion } from "../types";
import { toast } from "sonner";
import _ from "lodash";

interface PromotionDetailPageProps {
  promotionId: string;
}

export default function PromotionDetailPage({
  promotionId,
}: PromotionDetailPageProps) {
  const router = useRouter();
  const [promotion, setPromotion] = useState<Promotion | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem(`promotion_${promotionId}`);
    if (storedData) {
      try {
        const promotionData: Promotion = JSON.parse(storedData);
        setPromotion(promotionData);
      } catch (error) {
        toast.error("Không thể tải dữ liệu chương trình");
        router.push("/shop/chien-dich/muaXtangY");
      }
    } else {
      toast.error("Không thể tải dữ liệu chương trình");
      router.push("/shop/chien-dich/muaXtangY");
    }
  }, [promotionId, router]);

  const handleBack = () => {
    router.push("/shop/chien-dich/muaXtangY");
  };

  const handleEdit = () => {
    if (promotion) {
      sessionStorage.setItem(
        `promotion_${promotionId}`,
        JSON.stringify(promotion)
      );
      router.push(`/shop/chien-dich/muaXtangY/sua/${promotionId}`);
    }
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
    const statusMap: Record<number, { label: string; className: string }> = {
      0: { label: "Không hoạt động", className: "bg-gray-500" },
      1: { label: "Hoạt động", className: "bg-green-500" },
    };

    const statusInfo = statusMap[status] || statusMap[0];
    return (
      <Badge variant="secondary" className={statusInfo.className}>
        {statusInfo.label}
      </Badge>
    );
  };

  if (!promotion) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Chi tiết chương trình Mua X Tặng Y
            </h1>
          </div>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
              <p className="mt-4 text-sm text-gray-500">Đang tải...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {promotion.name}
            </h1>
            <p className="text-sm text-gray-500">
              Chi tiết chương trình khuyến mãi
            </p>
          </div>
        </div>
        <Button onClick={handleEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          Chỉnh sửa
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Lưu ý:</strong> Chương trình khuyến mãi sẽ tặng toàn bộ sản
          phẩm, không tặng theo biến thể (variant). Khách hàng sẽ nhận được sản
          phẩm quà tặng khi đáp ứng đủ điều kiện mua hàng.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Thông tin chương trình
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Tên chương trình
              </p>
              <p className="mt-1 text-base font-semibold">{promotion.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Trạng thái</p>
              <div className="mt-1">{getStatusBadge(promotion.status)}</div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Giới hạn sử dụng
              </p>
              <p className="mt-1 text-base">
                {promotion.totalUsageLimit === 0
                  ? "Không giới hạn"
                  : `${promotion.totalUsageLimit} lượt`}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Đã sử dụng</p>
              <p className="mt-1 text-base">{!promotion.usedCount} lượt</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Thời gian áp dụng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Bắt đầu</p>
              <p className="mt-1 text-base">
                {formatDate(promotion.startTime)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Kết thúc</p>
              <p className="mt-1 text-base">{formatDate(promotion.endTime)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Điều kiện mua hàng ({_.size(_.get(promotion, "rules", [])) || 0} sản
            phẩm)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {_.isEmpty(_.get(promotion, "rules", [])) ? (
            <p className="text-sm text-gray-500">Chưa có điều kiện mua hàng</p>
          ) : (
            <div className="space-y-3">
              {_.map(_.get(promotion, "rules", []), (rule, index) => {
                const product = _.get(rule, "product");
                const productId =
                  _.get(rule, "productId") || _.get(product, "id");
                const productName = _.get(product, "name");
                const productImage = _.get(product, "imgMain");

                return (
                  <div
                    key={_.get(rule, "id") || index}
                    className="flex items-center gap-4 rounded-lg border p-4"
                  >
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={productName || "Product"}
                        className="h-16 w-16 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-100">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium">
                        {productName || `Sản phẩm ID: ${productId}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        Số lượng tối thiểu: {_.get(rule, "quantity", 0)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Quà tặng ({_.size(_.get(promotion, "gifts", [])) || 0} sản phẩm)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {_.isEmpty(_.get(promotion, "gifts", [])) ? (
            <p className="text-sm text-gray-500">Chưa có quà tặng</p>
          ) : (
            <div className="space-y-3">
              {_.map(_.get(promotion, "gifts", []), (gift, index) => {
                const product = _.get(gift, "product");
                const productId =
                  _.get(gift, "productId") || _.get(product, "id");
                const productName = _.get(product, "name");
                const productImage = _.get(product, "imgMain");

                return (
                  <div
                    key={_.get(gift, "id") || index}
                    className="flex items-center gap-4 rounded-lg border p-4"
                  >
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={productName || "Product"}
                        className="h-16 w-16 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-100">
                        <Gift className="h-8 w-8 text-orange-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium">
                        {productName || `Sản phẩm ID: ${productId}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        Số lượng tặng: {_.get(gift, "giftQuantity", 0)}
                        {_.get(gift, "maxGiftPerOrder") &&
                          ` (Tối đa ${_.get(gift, "maxGiftPerOrder")}/đơn)`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
