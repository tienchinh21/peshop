"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Package,
  ArrowLeft,
  Store,
  MapPin,
  Phone,
  User,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Box,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Badge,
  Separator,
} from "@/shared/components/ui";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatPrice } from "@/shared/utils";
import { cn } from "@/lib/utils";
import { useGetOrderDetail, useGetTrackingLogs } from "../hooks";
import CreateOrderReviewModal from "@/features/customer/orders/components/CreateOrderReviewModal";
import {
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "../types/order.enums";
import type { TrackingLog } from "../types";

interface OrderDetailPageProps {
  orderId: string;
}

const getOrderStatusText = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    [OrderStatus.Pending]: "Chờ xác nhận",
    [OrderStatus.Confirmed]: "Đã xác nhận",
    [OrderStatus.Rejected]: "Đã từ chối",
    [OrderStatus.PickedUp]: "Đã lấy hàng",
    [OrderStatus.Shipping]: "Đang giao hàng",
    [OrderStatus.Delivered]: "Đã giao hàng",
    [OrderStatus.Cancelled]: "Đã hủy",
  };
  return statusMap[status] || "Không xác định";
};

const getPaymentMethodText = (method: PaymentMethod): string => {
  return method === PaymentMethod.COD
    ? "Thanh toán khi nhận hàng (COD)"
    : "VNPay";
};

const getPaymentStatusText = (status: PaymentStatus): string => {
  const statusMap: Record<PaymentStatus, string> = {
    [PaymentStatus.Unpaid]: "Chưa thanh toán",
    [PaymentStatus.Paid]: "Đã thanh toán",
    [PaymentStatus.Failed]: "Thanh toán thất bại",
    [PaymentStatus.Refunded]: "Đã hoàn tiền",
    [PaymentStatus.Cancelled]: "Đã hủy",
    [PaymentStatus.Pending]: "Đang xử lý",
  };
  return statusMap[status] || "Không xác định";
};

const getTrackingStatusIcon = (status: string) => {
  const s = (status || "").toLowerCase();
  switch (s) {
    case "ready_to_pick":
    case "picking":
    case "waiting_to_return":
      return <Clock className="h-4 w-4" />;
    case "picked":
    case "picked_to_storing":
    case "storing":
    case "sorting":
      return <Box className="h-4 w-4" />;
    case "delivering":
    case "transporting":
    case "return_transporting":
      return <Truck className="h-4 w-4" />;
    case "returning":
      return <RefreshCw className="h-4 w-4" />;
    case "delivered":
    case "returned":
      return <CheckCircle2 className="h-4 w-4" />;
    case "cancel":
    case "delivery_fail":
    case "return_fail":
    case "return":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getTrackingStatusColor = (status: string) => {
  const s = (status || "").toLowerCase();
  switch (s) {
    case "delivered":
    case "returned":
      return "text-green-600 bg-green-100 border-green-200";
    case "delivering":
    case "transporting":
    case "money_collect_delivering":
    case "return_transporting":
      return "text-blue-600 bg-blue-100 border-blue-200";
    case "cancel":
    case "delivery_fail":
    case "return_fail":
      return "text-red-600 bg-red-100 border-red-200";
    default:
      return "text-orange-600 bg-orange-100 border-orange-200";
  }
};

function OrderDetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

function TrackingTimeline({ logs }: { logs: TrackingLog[] }) {
  // Sort logs by action_at descending (newest first)
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.action_at).getTime() - new Date(a.action_at).getTime()
  );

  return (
    <div className="relative">
      {sortedLogs.map((log, index) => {
        const isFirst = index === 0;
        const isLast = index === sortedLogs.length - 1;

        return (
          <div
            key={`${log.order_code}-${log.action_at}`}
            className="flex gap-4 pb-6 last:pb-0"
          >
            {/* Timeline line and dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2",
                  isFirst
                    ? getTrackingStatusColor(log.status)
                    : "bg-gray-100 border-gray-200 text-gray-400"
                )}
              >
                {getTrackingStatusIcon(log.status)}
              </div>
              {!isLast && <div className="w-0.5 flex-1 bg-gray-200 mt-2" />}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={cn(
                    "font-medium text-sm",
                    isFirst ? "text-gray-900" : "text-gray-600"
                  )}
                >
                  {log.status_name}
                </span>
                {isFirst && (
                  <Badge variant="secondary" className="text-xs">
                    Mới nhất
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                {format(new Date(log.action_at), "HH:mm - dd/MM/yyyy", {
                  locale: vi,
                })}
              </p>
              {log.location?.address && (
                <p className="text-xs text-muted-foreground">
                  {log.location.address}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function OrderDetailPage({ orderId }: OrderDetailPageProps) {
  const router = useRouter();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewProductId, setReviewProductId] = useState<string>("");
  const [reviewVariantId, setReviewVariantId] = useState<string>("");
  const [reviewProductName, setReviewProductName] = useState<string>("");
  const {
    data: order,
    isLoading: isLoadingOrder,
    isError: isOrderError,
  } = useGetOrderDetail(orderId);
  const {
    data: tracking,
    isLoading: isLoadingTracking,
    refetch: refetchTracking,
  } = useGetTrackingLogs(order?.orderCode || "");

  if (isLoadingOrder) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <OrderDetailSkeleton />
      </div>
    );
  }

  if (isOrderError || !order) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">Không thể tải thông tin đơn hàng</p>
          <Button variant="outline" onClick={() => router.back()}>
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const orderInfo = tracking?.order_info;
  const trackingLogs = tracking?.tracking_logs || [];

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
          <p className="text-sm text-muted-foreground">
            Mã đơn: {order.orderCode}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left Column - Order Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Order Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Trạng thái đơn hàng
                </h2>
                <Badge
                  className={cn(
                    "border",
                    getTrackingStatusColor(orderInfo?.status || "")
                  )}
                >
                  {orderInfo?.status_name ||
                    getOrderStatusText(order.orderStatus)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {orderInfo && (
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  {orderInfo.leadtime_order?.picked_date && (
                    <div>
                      <span className="text-muted-foreground">
                        Ngày lấy hàng:
                      </span>
                      <p className="font-medium">
                        {format(
                          new Date(orderInfo.leadtime_order.picked_date),
                          "dd/MM/yyyy HH:mm",
                          { locale: vi }
                        )}
                      </p>
                    </div>
                  )}
                  {orderInfo.leadtime_order?.delivered_date && (
                    <div>
                      <span className="text-muted-foreground">
                        Ngày giao hàng:
                      </span>
                      <p className="font-medium">
                        {format(
                          new Date(orderInfo.leadtime_order.delivered_date),
                          "dd/MM/yyyy HH:mm",
                          { locale: vi }
                        )}
                      </p>
                    </div>
                  )}
                  {!orderInfo.leadtime_order?.delivered_date &&
                    orderInfo.leadtime_order?.to_estimate_date && (
                      <div>
                        <span className="text-muted-foreground">
                          Dự kiến giao:
                        </span>
                        <p className="font-medium">
                          {format(
                            new Date(orderInfo.leadtime_order.to_estimate_date),
                            "dd/MM/yyyy",
                            { locale: vi }
                          )}
                        </p>
                      </div>
                    )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Lịch sử vận chuyển
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetchTracking()}
                  disabled={isLoadingTracking}
                >
                  <RefreshCw
                    className={cn(
                      "h-4 w-4 mr-1",
                      isLoadingTracking && "animate-spin"
                    )}
                  />
                  Cập nhật
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingTracking ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : trackingLogs.length > 0 ? (
                <TrackingTimeline logs={trackingLogs} />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Chưa có thông tin vận chuyển
                </p>
              )}
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader className="pb-3">
              <h2 className="font-semibold flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                {order.shopName}
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx}>
                  <div className="flex gap-3">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-gray-50">
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-8 w-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.productName}
                      </h4>
                      {item.variantValues && item.variantValues.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.variantValues.map((v, i) => (
                            <span
                              key={i}
                              className="text-xs text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded"
                            >
                              {v.value || v.valueName}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between items-end mt-2">
                        <span className="text-xs text-muted-foreground">
                          x{item.quantity}
                        </span>
                        <span className="text-sm font-medium">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      {item.isAllowReview && (
                        <div className="mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setReviewProductId(item.productId);
                              setReviewVariantId(item.variantId || "");
                              setReviewProductName(item.productName);
                              setReviewOpen(true);
                            }}
                          >
                            Đánh giá
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  {idx < order.items.length - 1 && (
                    <Separator className="my-3" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-4">
          {/* Delivery Address */}
          <Card>
            <CardHeader className="pb-3">
              <h2 className="font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Địa chỉ nhận hàng
              </h2>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {orderInfo?.to_name || order.recipientName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{orderInfo?.to_phone || order.recipientPhone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">
                  {orderInfo?.to_address || order.recipientAddress}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader className="pb-3">
              <h2 className="font-semibold">Thông tin thanh toán</h2>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phương thức:</span>
                <span>{getPaymentMethodText(order.paymentMethod)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trạng thái:</span>
                <Badge
                  variant={
                    order.paymentStatus === PaymentStatus.Paid
                      ? "default"
                      : "secondary"
                  }
                >
                  {getPaymentStatusText(order.paymentStatus)}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính:</span>
                <span>{formatPrice(order.originalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí vận chuyển:</span>
                <span>{formatPrice(order.shippingFee)}</span>
              </div>
              {order.discountPrice > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span>-{formatPrice(order.discountPrice)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-base">
                <span>Tổng cộng:</span>
                <span className="text-primary">
                  {formatPrice(order.finalPrice)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Order Info */}
          <Card>
            <CardHeader className="pb-3">
              <h2 className="font-semibold">Thông tin đơn hàng</h2>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã đơn hàng:</span>
                <span className="font-mono">{order.orderCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày đặt:</span>
                <span>
                  {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <CreateOrderReviewModal
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        orderId={order.orderId}
        productId={reviewProductId}
        variantId={reviewVariantId}
        productName={reviewProductName}
      />
    </div>
  );
}
