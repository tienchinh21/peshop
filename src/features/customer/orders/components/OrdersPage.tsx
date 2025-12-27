"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/shared/components/ui/product-image";
import {
  Package,
  RefreshCw,
  ShoppingBag,
  Zap,
  ChevronRight,
  Store,
  MessageSquare,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Button,
  Badge,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Input,
} from "@/shared/components/ui";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatPrice } from "@/shared/utils";
import { cn } from "@/lib/utils";
import { useGetOrders } from "../hooks";
import { OrderStatus, PaymentStatus } from "../types/order.enums";
import type { OrderListItem, OrderProductDetail } from "../types";

// Helper to get status text
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

// Helper for status badge styling
const getOrderStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Pending:
    case OrderStatus.Confirmed:
      return "text-orange-600 bg-orange-50 border-orange-100";
    case OrderStatus.PickedUp:
    case OrderStatus.Shipping:
      return "text-blue-600 bg-blue-50 border-blue-100";
    case OrderStatus.Delivered:
      return "text-green-600 bg-green-50 border-green-100";
    case OrderStatus.Cancelled:
    case OrderStatus.Rejected:
      return "text-red-600 bg-red-50 border-red-100";
    default:
      return "text-gray-600 bg-gray-50 border-gray-100";
  }
};

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Pending:
    case OrderStatus.Confirmed:
      return <Clock className="w-3.5 h-3.5 mr-1" />;
    case OrderStatus.PickedUp:
      return <Package className="w-3.5 h-3.5 mr-1" />;
    case OrderStatus.Shipping:
      return <Truck className="w-3.5 h-3.5 mr-1" />;
    case OrderStatus.Delivered:
      return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
    case OrderStatus.Cancelled:
    case OrderStatus.Rejected:
      return <XCircle className="w-3.5 h-3.5 mr-1" />;
    default:
      return null;
  }
};

function OrderListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="border-none shadow-sm overflow-hidden">
          <CardHeader className="p-4 border-b bg-gray-50/50 pb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-end">
            <Skeleton className="h-8 w-32" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function EmptyOrderState() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-dashed border-gray-200 text-center">
      <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mb-4">
        <Package className="h-10 w-10 text-primary/60" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">
        Chưa có đơn hàng nào
      </h3>
      <p className="text-muted-foreground mt-1 mb-6 max-w-sm text-sm">
        Bạn chưa có đơn hàng nào trong mục này. Hãy dạo quanh và khám phá thêm
        sản phẩm nhé!
      </p>
      <Button onClick={() => router.push("/san-pham")}>Mua sắm ngay</Button>
    </div>
  );
}

const OrderProductItem = ({ product }: { product: OrderProductDetail }) => (
  <div className="flex gap-3 py-2">
    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
      {product.productImage ? (
        <ProductImage
          src={product.productImage}
          alt={product.productName}
          fill
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Package className="h-8 w-8 text-gray-300" />
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0 flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
          {product.productName}
        </h4>
        {product.variantValues && product.variantValues.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {product.variantValues.map((v, idx) => (
              <span
                key={idx}
                className="text-xs text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded"
              >
                {v.value || v.valueName}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between items-end mt-1">
        <span className="text-xs text-muted-foreground">
          x{product.quantity}
        </span>
        <span className="text-sm font-medium text-gray-900">
          {formatPrice(product.price)}
        </span>
      </div>
    </div>
  </div>
);

const OrderCard = ({
  order,
  onClick,
}: {
  order: OrderListItem;
  onClick: () => void;
}) => {
  // Determine if we show buttons
  const isCompleted = order.orderStatus === OrderStatus.Delivered;
  const isCancelled =
    order.orderStatus === OrderStatus.Cancelled ||
    order.orderStatus === OrderStatus.Rejected;

  return (
    <Card
      onClick={onClick}
      className="group overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white"
    >
      {/* Header: Shop & Status */}
      <div className="px-4 py-3 border-b border-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-white">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
            <Store className="h-4 w-4" />
            <span>{order.shopName}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-muted-foreground hover:text-primary hidden sm:flex min-h-[44px]"
          >
            <MessageSquare className="h-3 w-3 mr-1" /> Chat
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-muted-foreground hover:text-primary sm:flex min-h-[44px]"
          >
            Xem Shop <ChevronRight className="h-3 w-3" />
          </Button>
        </div>

        <div
          className={cn(
            "flex items-center px-2.5 py-1 rounded text-xs font-medium border self-start sm:self-auto min-h-[32px]",
            getOrderStatusColor(order.orderStatus)
          )}
        >
          {getStatusIcon(order.orderStatus)}
          {getOrderStatusText(order.orderStatus)}
        </div>
      </div>

      {/* Body: Items */}
      <div className="px-4 py-3 space-y-3">
        {order.items.slice(0, 2).map((item, idx) => (
          <div key={idx}>
            <OrderProductItem product={item} />
            {idx < Math.min(order.items.length, 2) - 1 && (
              <Separator className="my-2" />
            )}
          </div>
        ))}
        {order.items.length > 2 && (
          <div className="text-center pt-1">
            <span className="text-xs text-muted-foreground">
              Xem thêm {order.items.length - 2} sản phẩm
            </span>
          </div>
        )}
      </div>

      {/* Footer: Summary & Actions */}
      <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100">
        <div className="flex justify-end items-center gap-2 mb-3">
          <span className="text-sm text-muted-foreground">Thành tiền:</span>
          <span className="text-lg font-bold text-primary">
            {formatPrice(order.finalPrice)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 min-h-[44px] w-full sm:w-auto"
          >
            Xem chi tiết
          </Button>
          {(isCompleted || isCancelled) && (
            <Button
              size="sm"
              variant="default"
              className="min-h-[44px] w-full sm:w-auto"
            >
              Mua lại
            </Button>
          )}
          {order.orderStatus === OrderStatus.Shipping && (
            <Button
              size="sm"
              variant="default"
              className="min-h-[44px] w-full sm:w-auto"
            >
              Đã nhận hàng
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export function OrdersPage() {
  const router = useRouter();
  const { data: orders, isLoading, isError, refetch } = useGetOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Define tab constants
  const tabs = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ xác nhận" },
    { value: "shipping", label: "Đang giao" },
    { value: "completed", label: "Hoàn thành" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  // Filtering Logic
  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    let result = [...orders];

    // Filter by Tab
    if (activeTab !== "all") {
      result = result.filter((order) => {
        const s = order.orderStatus;
        switch (activeTab) {
          case "pending": // Pending + Confirmed
            return s === OrderStatus.Pending || s === OrderStatus.Confirmed;
          case "shipping":
            return s === OrderStatus.Shipping || s === OrderStatus.PickedUp;
          case "completed":
            return s === OrderStatus.Delivered;
          case "cancelled":
            return s === OrderStatus.Cancelled || s === OrderStatus.Rejected;
          default:
            return true;
        }
      });
    }

    // Filter by Search (Shop name or Order Code)
    if (searchTerm.trim()) {
      const lowerIds = searchTerm.toLowerCase();
      result = result.filter(
        (o) =>
          o.shopName?.toLowerCase().includes(lowerIds) ||
          o.orderCode?.toLowerCase().includes(lowerIds) ||
          o.items.some((i) => i.productName.toLowerCase().includes(lowerIds))
      );
    }

    return result;
  }, [orders, activeTab, searchTerm]);

  const handleOrderClick = (orderId: string) => {
    router.push(`/don-hang/${orderId}`);
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
          <Package className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="border-b px-4 bg-white sticky top-0 z-10">
            <TabsList className="w-full justify-start h-auto bg-transparent p-0 overflow-x-auto flex-nowrap no-scrollbar">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-shrink-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-3 min-h-[44px] text-sm font-medium text-muted-foreground hover:text-gray-900 transition-colors"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Search Bar Area */}
          <div className="p-4 bg-gray-50/50 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo Tên Shop, ID đơn hàng hoặc sản phẩm..."
                className="pl-9 bg-white border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 min-h-[400px]">
            {isLoading ? (
              <OrderListSkeleton />
            ) : isError ? (
              <div className="text-center py-10">
                <p className="text-red-500">Có lỗi xảy ra khi tải đơn hàng.</p>
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  className="mt-2"
                >
                  Thử lại
                </Button>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.orderId}
                    order={order}
                    onClick={() => handleOrderClick(order.orderId)}
                  />
                ))}
              </div>
            ) : (
              <EmptyOrderState />
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
