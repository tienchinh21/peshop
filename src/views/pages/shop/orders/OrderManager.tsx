"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderTable } from "@/components/shop/table";
import {
  useShopOrders,
  useConfirmOrders,
  useRejectOrders,
} from "@/hooks/shop/useShopOrders";
import { OrderFilterParams, Order } from "@/types/shops/order.type";
import { OrderStatus } from "@/enums/order.enum";
import { ShoppingCart } from "lucide-react";
import _ from "lodash";
import { toast } from "sonner";

interface OrderManagerProps {
  defaultStatus?: OrderStatus;
  title: string;
}

export default function OrderManager({
  defaultStatus,
  title,
}: OrderManagerProps) {
  const [filters, setFilters] = useState<OrderFilterParams>({
    page: 0,
    size: 10,
    sort: "createdAt,desc",
    filter:
      defaultStatus !== undefined
        ? `statusOrder : ${defaultStatus}`
        : undefined,
  });

  const { data, isLoading, error } = useShopOrders(filters);
  const confirmMutation = useConfirmOrders();
  const rejectMutation = useRejectOrders();

  const orders = _.get(data, "content.response", []) as Order[];
  const pagination = _.get(data, "content.info");

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setFilters((prev) => ({ ...prev, size, page: 0 }));
  }, []);

  const handleConfirm = useCallback(
    async (order: Order) => {
      try {
        await confirmMutation.mutateAsync([order.id]);
      } catch (error) {
        // Error handled by mutation
      }
    },
    [confirmMutation]
  );

  const handleReject = useCallback(
    async (order: Order) => {
      try {
        await rejectMutation.mutateAsync([order.id]);
      } catch (error) {
        // Error handled by mutation
      }
    },
    [rejectMutation]
  );

  const handleView = useCallback((order: Order) => {
    toast.info(`Xem chi tiết đơn hàng ${order.orderCode} (Chưa cài đặt)`);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý danh sách đơn hàng
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Danh sách đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTable
            orders={orders}
            pagination={pagination}
            isLoading={isLoading}
            onView={handleView}
            onConfirm={handleConfirm}
            onReject={handleReject}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
