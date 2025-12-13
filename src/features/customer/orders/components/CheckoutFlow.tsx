"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import _ from "lodash";
import { Package, RefreshCw, ShoppingBag, Zap, ChevronRight, Check, MapPin, Truck, CreditCard, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/shared/components/ui";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatPrice } from "@/shared/utils";
import { useCreateVirtualOrder } from "../hooks";
import { mapCartItemsToOrderPayload } from "../utils";
import type { VirtualOrderData, OrderShopItem, OrderProductItem, CreateVirtualOrderPayload } from "../types";
import { VoucherStep } from "./VoucherStep";
import { ShippingStep } from "./ShippingStep";
import { PaymentStep } from "./PaymentStep";
export enum CheckoutStep {
  Review = 0,
  Shipping = 1,
  Voucher = 2,
  Payment = 3,
}
const CHECKOUT_STEPS = [{
  id: CheckoutStep.Review,
  label: "Xem lại",
  icon: ShoppingBag
}, {
  id: CheckoutStep.Shipping,
  label: "Vận chuyển",
  icon: Truck
}, {
  id: CheckoutStep.Voucher,
  label: "Voucher",
  icon: Tag
}, {
  id: CheckoutStep.Payment,
  label: "Thanh toán",
  icon: CreditCard
}];
export interface CheckoutCartItem {
  cartId: string;
  productId: string;
  productName: string;
  productImage: string;
  variantId: string | null;
  quantity: number;
  price: number;
  shopId: string;
  shopName: string;
}
export interface CheckoutFlowProps {
  cartItems: CheckoutCartItem[];
  userAddressId: string;
  userAddress?: string;
  onOrderCreated?: (orderId: string) => void;
  onStepChange?: (step: CheckoutStep) => void;
}
function CheckoutFlowSkeleton() {
  return <div className="space-y-6">
      {}
      <div className="flex items-center justify-between mb-8">
        {[...Array(4)].map((_, i) => <div key={i} className="flex items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            {i < 3 && <Skeleton className="h-1 w-16 mx-2" />}
          </div>)}
      </div>

      {}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="flex gap-4">
              <Skeleton className="h-20 w-20 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>)}
        </CardContent>
      </Card>

      {}
      <Card>
        <CardContent className="p-6 space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    </div>;
}
function CheckoutErrorState({
  message,
  onRetry
}: {
  message: string;
  onRetry: () => void;
}) {
  return <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Package className="h-16 w-16 text-destructive mb-4" />
        <h3 className="text-lg font-medium mb-2">Không thể tạo đơn hàng</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          {message}
        </p>
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Thử lại
        </Button>
      </CardContent>
    </Card>;
}
function StepIndicator({
  currentStep,
  onStepClick
}: {
  currentStep: CheckoutStep;
  onStepClick?: (step: CheckoutStep) => void;
}) {
  return <div className="flex items-center justify-between mb-8">
      {CHECKOUT_STEPS.map((step, index) => {
      const isCompleted = currentStep > step.id;
      const isCurrent = currentStep === step.id;
      const Icon = step.icon;
      return <React.Fragment key={step.id}>
            <button onClick={() => isCompleted && onStepClick?.(step.id)} disabled={!isCompleted} className={`flex flex-col items-center gap-2 transition-colors ${isCompleted ? "cursor-pointer text-primary" : isCurrent ? "text-primary" : "text-muted-foreground cursor-default"}`}>
              <div className={`flex items-center justify-center h-10 w-10 rounded-full border-2 transition-colors ${isCompleted ? "bg-primary border-primary text-primary-foreground" : isCurrent ? "border-primary text-primary" : "border-muted-foreground/30"}`}>
                {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <span className={`text-xs font-medium ${isCurrent || isCompleted ? "text-primary" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </button>
            {index < CHECKOUT_STEPS.length - 1 && <div className={`flex-1 h-1 mx-2 rounded ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />}
          </React.Fragment>;
    })}
    </div>;
}
function ShopItemCard({
  shop
}: {
  shop: OrderShopItem;
}) {
  return <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          {shop.shopLogoUrl ? <Image src={shop.shopLogoUrl} alt={shop.shopName} width={32} height={32} className="rounded-full" /> : <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </div>}
          <CardTitle className="text-base">{shop.shopName}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {shop.products.map((product, index) => <ProductItemRow key={`${product.productId}-${index}`} product={product} />)}

        {}
        <div className="pt-3 border-t space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tạm tính</span>
            <span>{formatPrice(shop.priceOriginal)}</span>
          </div>
          {shop.flashSaleDiscount > 0 && <div className="flex justify-between text-destructive">
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Flash Sale
              </span>
              <span>-{formatPrice(shop.flashSaleDiscount)}</span>
            </div>}
          {shop.voucherValue > 0 && <div className="flex justify-between text-green-600">
              <span>Voucher shop</span>
              <span>-{formatPrice(shop.voucherValue)}</span>
            </div>}
          {shop.feeShipping > 0 && <div className="flex justify-between">
              <span className="text-muted-foreground">Phí vận chuyển</span>
              <span>{formatPrice(shop.feeShipping)}</span>
            </div>}
        </div>
      </CardContent>
    </Card>;
}
function ProductItemRow({
  product
}: {
  product: OrderProductItem;
}) {
  const hasFlashSale = !!product.flashSaleProductId;
  return <div className="flex gap-3">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border bg-muted">
        <div className="flex h-full w-full items-center justify-center">
          <Package className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="font-medium text-sm line-clamp-2">
              Sản phẩm #{product.productId.slice(0, 8)}
            </p>
            {hasFlashSale && <Badge variant="destructive" className="gap-1 mt-1">
                <Zap className="h-3 w-3" />-{product.flashSalePercentDecrease}%
              </Badge>}
          </div>
          <div className="text-right">
            {hasFlashSale && product.flashSalePrice ? <>
                <p className="text-sm font-medium text-destructive">
                  {formatPrice(product.flashSalePrice)}
                </p>
                <p className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.priceOriginal)}
                </p>
              </> : <p className="text-sm font-medium">
                {formatPrice(product.priceOriginal)}
              </p>}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Số lượng: {product.quantity}
        </p>
      </div>
    </div>;
}
function OrderSummary({
  orderData,
  isLoading
}: {
  orderData: VirtualOrderData | null;
  isLoading: boolean;
}) {
  if (isLoading || !orderData) {
    return <Card>
        <CardContent className="p-6 space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-6 w-1/2" />
        </CardContent>
      </Card>;
  }
  return <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
      <CardContent className="p-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tổng tiền hàng</span>
          <span>{formatPrice(orderData.orderTotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Phí vận chuyển</span>
          <span>{formatPrice(orderData.feeShippingTotal)}</span>
        </div>
        {orderData.discountTotal > 0 && <div className="flex justify-between text-sm text-green-600">
            <span>Giảm giá voucher</span>
            <span>-{formatPrice(orderData.discountTotal)}</span>
          </div>}
        {orderData.flashSaleDiscountTotal > 0 && <div className="flex justify-between text-sm text-destructive">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Flash Sale
            </span>
            <span>-{formatPrice(orderData.flashSaleDiscountTotal)}</span>
          </div>}
        <div className="border-t border-purple-200 pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Tổng thanh toán</span>
            <span className="text-2xl font-bold text-purple-600">
              {formatPrice(orderData.amountTotal)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>;
}
function ReviewStepContent({
  orderData,
  userAddress
}: {
  orderData: VirtualOrderData;
  userAddress?: string;
}) {
  return <div className="space-y-4">
      {}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Thông tin nhận hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-sm">
            <p className="font-medium">{orderData.recipientName}</p>
            <p className="text-muted-foreground">{orderData.recipientPhone}</p>
            <p className="text-muted-foreground">
              {orderData.userFullNewAddress || userAddress}
            </p>
          </div>
        </CardContent>
      </Card>

      {}
      <div>
        <h3 className="font-medium mb-3">
          Sản phẩm ({orderData.itemShops.length} shop)
        </h3>
        {orderData.itemShops.map((shop, index) => <ShopItemCard key={`${shop.shopId}-${index}`} shop={shop} />)}
      </div>

      {}
      {orderData.hasFlashSale && <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
          <Zap className="h-5 w-5 text-destructive" />
          <span className="text-sm font-medium text-destructive">
            Đơn hàng có sản phẩm Flash Sale
          </span>
        </div>}
    </div>;
}
export function CheckoutFlow({
  cartItems,
  userAddressId,
  userAddress,
  onOrderCreated,
  onStepChange
}: CheckoutFlowProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.Review);
  const [orderData, setOrderData] = useState<VirtualOrderData | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const createVirtualOrderMutation = useCreateVirtualOrder();
  const initializeCheckout = useCallback(async () => {
    if (cartItems.length === 0) {
      setError("Không có sản phẩm trong giỏ hàng");
      return;
    }
    if (!userAddressId) {
      setError("Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    setError(null);
    try {
      const items = mapCartItemsToOrderPayload(cartItems);
      const payload: CreateVirtualOrderPayload = {
        userAddressId,
        items
      };
      const result = await createVirtualOrderMutation.mutateAsync(payload);
      setOrderData(result);
      setOrderId(result.orderId);
      setIsInitialized(true);
      if (onOrderCreated) {
        onOrderCreated(result.orderId);
      }
    } catch (err: any) {
      const errorMessage = _.get(err, "response.data.message", "Không thể tạo đơn hàng. Vui lòng thử lại.");
      setError(errorMessage);
    }
  }, [cartItems, userAddressId, createVirtualOrderMutation, onOrderCreated]);
  useEffect(() => {
    if (!isInitialized && cartItems.length > 0 && userAddressId) {
      initializeCheckout();
    }
  }, [isInitialized, cartItems.length, userAddressId, initializeCheckout]);
  const handleStepChange = useCallback((step: CheckoutStep) => {
    setCurrentStep(step);
    onStepChange?.(step);
  }, [onStepChange]);
  const handleNextStep = useCallback(() => {
    if (currentStep < CheckoutStep.Payment) {
      handleStepChange(currentStep + 1);
    }
  }, [currentStep, handleStepChange]);
  const handlePrevStep = useCallback(() => {
    if (currentStep > CheckoutStep.Review) {
      handleStepChange(currentStep - 1);
    }
  }, [currentStep, handleStepChange]);
  const handleRetry = useCallback(() => {
    setError(null);
    setIsInitialized(false);
    initializeCheckout();
  }, [initializeCheckout]);
  if (createVirtualOrderMutation.isPending) {
    return <CheckoutFlowSkeleton />;
  }
  if (error) {
    return <CheckoutErrorState message={error} onRetry={handleRetry} />;
  }
  if (!isInitialized || !orderData) {
    return <CheckoutFlowSkeleton />;
  }
  return <div className="space-y-6">
      {}
      <StepIndicator currentStep={currentStep} onStepClick={handleStepChange} />

      {}
      <div className="min-h-[400px]">
        {currentStep === CheckoutStep.Review && <ReviewStepContent orderData={orderData} userAddress={userAddress} />}

        {currentStep === CheckoutStep.Shipping && orderId && <ShippingStep orderId={orderId} orderData={orderData} onShippingApplied={setOrderData} />}

        {currentStep === CheckoutStep.Voucher && orderId && <VoucherStep orderId={orderId} orderData={orderData} onVoucherApplied={setOrderData} />}

        {currentStep === CheckoutStep.Payment && orderId && <PaymentStep orderId={orderId} orderData={orderData} />}
      </div>

      {}
      <OrderSummary orderData={orderData} isLoading={createVirtualOrderMutation.isPending} />

      {}
      {currentStep !== CheckoutStep.Payment && <div className="flex justify-between gap-4">
          <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === CheckoutStep.Review}>
            Quay lại
          </Button>
          <Button onClick={handleNextStep} className="flex items-center gap-2">
            Tiếp tục
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>}

      {}
      {currentStep === CheckoutStep.Payment && <Button variant="outline" onClick={handlePrevStep} className="w-full">
          Quay lại chọn vận chuyển
        </Button>}
    </div>;
}