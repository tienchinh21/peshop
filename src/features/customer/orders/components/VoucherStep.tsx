"use client";

import React, { useState, useCallback } from "react";
import _ from "lodash";
import { Tag, X, Loader2, Check, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from "@/shared/components/ui";
import { formatPrice } from "@/shared/utils";
import { useApplySystemVoucher, useApplyShopVoucher } from "../hooks";
import type { VirtualOrderData, OrderShopItem } from "../types";
export interface VoucherStepProps {
  orderId: string;
  orderData: VirtualOrderData;
  onVoucherApplied: (updatedOrder: VirtualOrderData) => void;
}
function ShopVoucherInput({
  shop,
  orderId,
  onVoucherApplied
}: {
  shop: OrderShopItem;
  orderId: string;
  onVoucherApplied: (updatedOrder: VirtualOrderData) => void;
}) {
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(shop.voucherId);
  const applyShopVoucherMutation = useApplyShopVoucher();
  const handleApplyVoucher = useCallback(async () => {
    if (!voucherCode.trim()) return;
    try {
      const result = await applyShopVoucherMutation.mutateAsync({
        voucherId: voucherCode.trim(),
        orderId,
        shopId: shop.shopId
      });
      setAppliedVoucher(voucherCode.trim());
      setVoucherCode("");
      onVoucherApplied(result);
    } catch {}
  }, [voucherCode, orderId, shop.shopId, applyShopVoucherMutation, onVoucherApplied]);
  const handleRemoveVoucher = useCallback(() => {
    setAppliedVoucher(null);
  }, []);
  return <div className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Store className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">{shop.shopName}</span>
        {shop.voucherValue > 0 && <Badge variant="secondary" className="ml-auto">
            -{formatPrice(shop.voucherValue)}
          </Badge>}
      </div>

      {appliedVoucher ? <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">
              Đã áp dụng: {appliedVoucher}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRemoveVoucher} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div> : <div className="flex gap-2">
          <Input placeholder="Nhập mã voucher shop" value={voucherCode} onChange={e => setVoucherCode(e.target.value)} className="flex-1" disabled={applyShopVoucherMutation.isPending} />
          <Button onClick={handleApplyVoucher} disabled={!voucherCode.trim() || applyShopVoucherMutation.isPending} size="sm">
            {applyShopVoucherMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Áp dụng"}
          </Button>
        </div>}
    </div>;
}
export function VoucherStep({
  orderId,
  orderData,
  onVoucherApplied
}: VoucherStepProps) {
  const [systemVoucherCode, setSystemVoucherCode] = useState("");
  const [appliedSystemVoucher, setAppliedSystemVoucher] = useState<string | null>(null);
  const applySystemVoucherMutation = useApplySystemVoucher();
  const handleApplySystemVoucher = useCallback(async () => {
    if (!systemVoucherCode.trim()) return;
    try {
      const result = await applySystemVoucherMutation.mutateAsync({
        voucherId: systemVoucherCode.trim(),
        orderId
      });
      setAppliedSystemVoucher(systemVoucherCode.trim());
      setSystemVoucherCode("");
      onVoucherApplied(result);
    } catch {}
  }, [systemVoucherCode, orderId, applySystemVoucherMutation, onVoucherApplied]);
  const handleRemoveSystemVoucher = useCallback(() => {
    setAppliedSystemVoucher(null);
  }, []);
  return <div className="space-y-6">
      {}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Voucher hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appliedSystemVoucher ? <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">
                  Đã áp dụng: {appliedSystemVoucher}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRemoveSystemVoucher} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div> : <div className="flex gap-2">
              <Input placeholder="Nhập mã voucher hệ thống" value={systemVoucherCode} onChange={e => setSystemVoucherCode(e.target.value)} className="flex-1" disabled={applySystemVoucherMutation.isPending} />
              <Button onClick={handleApplySystemVoucher} disabled={!systemVoucherCode.trim() || applySystemVoucherMutation.isPending}>
                {applySystemVoucherMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Áp dụng"}
              </Button>
            </div>}
          <p className="text-xs text-muted-foreground mt-2">
            Voucher hệ thống áp dụng cho toàn bộ đơn hàng
          </p>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Store className="h-4 w-4" />
            Voucher từng shop
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderData.itemShops.map(shop => <ShopVoucherInput key={shop.shopId} shop={shop} orderId={orderId} onVoucherApplied={onVoucherApplied} />)}
          <p className="text-xs text-muted-foreground">
            Mỗi shop có thể áp dụng một voucher riêng
          </p>
        </CardContent>
      </Card>

      {}
      {orderData.discountTotal > 0 && <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">
                Tổng giảm giá từ voucher
              </span>
              <span className="text-lg font-bold text-green-600">
                -{formatPrice(orderData.discountTotal)}
              </span>
            </div>
          </CardContent>
        </Card>}
    </div>;
}