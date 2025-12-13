"use client";

import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import { Truck, Loader2, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/shared/components/ui";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatPrice } from "@/shared/utils";
import { useApplyShippingFee, useGetShippingFee, useCalculateOrderTotal } from "../hooks";
import type { VirtualOrderData, OrderShopItem, ShippingFeeOption } from "../types";
export interface ShippingStepProps {
  orderId: string;
  orderData: VirtualOrderData;
  onShippingApplied: (updatedOrder: VirtualOrderData) => void;
}
function ShopShippingCard({
  option
}: {
  option: ShippingFeeOption;
}) {
  return <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
      <Store className="h-5 w-5 text-muted-foreground" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{option.shopName}</span>
          <Badge variant="outline" className="text-xs">
            {option.serviceTypeName}
          </Badge>
        </div>
        {option.expectedDeliveryTime && <p className="text-xs text-muted-foreground mt-0.5">
            Dự kiến: {option.expectedDeliveryTime}
          </p>}
      </div>
      <div className="text-right">
        <p className="font-semibold text-primary">
          {formatPrice(option.totalFee)}
        </p>
      </div>
    </div>;
}
export function ShippingStep({
  orderId,
  orderData,
  onShippingApplied
}: ShippingStepProps) {
  const [shippingOptions, setShippingOptions] = useState<ShippingFeeOption[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isApplied, setIsApplied] = useState(false);
  const getShippingFeeMutation = useGetShippingFee();
  const applyShippingFeeMutation = useApplyShippingFee();
  const calculateOrderTotalMutation = useCalculateOrderTotal();
  useEffect(() => {
    const fetchAndApplyShipping = async () => {
      setIsLoadingOptions(true);
      try {
        const result = await getShippingFeeMutation.mutateAsync(orderId);
        setShippingOptions(result.listFeeShipping || []);
        await applyShippingFeeMutation.mutateAsync(orderId);
        setIsApplied(true);
        const updatedOrder = await calculateOrderTotalMutation.mutateAsync(orderId);
        onShippingApplied(updatedOrder);
      } catch {} finally {
        setIsLoadingOptions(false);
      }
    };
    if (!isApplied) {
      fetchAndApplyShipping();
    }
  }, [orderId, isApplied]);
  return <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Phí vận chuyển (GHN)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoadingOptions ? <div className="space-y-3">
              {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div> : shippingOptions.length > 0 ? shippingOptions.map(option => <ShopShippingCard key={option.shopId} option={option} />) : <p className="text-sm text-muted-foreground text-center py-4">
              Không có phương thức vận chuyển khả dụng
            </p>}
        </CardContent>
      </Card>

      {}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-700">
              Tổng phí vận chuyển
            </span>
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(orderData.feeShippingTotal)}
            </span>
          </div>
        </CardContent>
      </Card>

      {(getShippingFeeMutation.isPending || applyShippingFeeMutation.isPending || calculateOrderTotalMutation.isPending) && <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Đang tính phí vận chuyển...</span>
        </div>}
    </div>;
}