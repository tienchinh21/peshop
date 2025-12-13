"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef, lazy, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import _ from "lodash";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCurrentUser } from "@/lib/store/slices/authSlice";
import { useCart } from "@/features/customer/cart";
import { useDefaultAddress, useCreateVirtualOrder, useCalculateOrderTotal } from "../hooks";
import { getShippingFee, applyShippingFee, applySystemVoucher, applyShopVoucher, calculateOrderTotal, createOrder, mapCartItemsToOrderPayload } from "@/features/customer/orders";
import type { CreateVirtualOrderPayload, GetShippingFeeResponse, CalculatedOrderData } from "@/features/customer/orders";
import { PaymentMethod as OrderPaymentMethod } from "@/features/customer/orders";
import { checkVoucherEligibility } from "@/features/customer/voucher-check";
import { CheckoutSkeleton } from "@/shared/components/skeleton";
import { AddressSection } from "./AddressSection";
import { OrderItemsSection } from "./OrderItemsSection";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { formatPrice } from "@/shared/utils/format.utils";
import { PaymentMethod, PaymentMethodLabel } from "@/shared/enums";
import type { VoucherEligibilityResponse } from "@/features/customer/voucher-check";
import { SectionContainer } from "@/shared/components/layout";
const VoucherSection = lazy(() => import("./VoucherSection").then(m => ({
  default: m.VoucherSection
})));
const OrderPromotionsSection = lazy(() => import("./OrderPromotionsSection").then(m => ({
  default: m.OrderPromotionsSection
})));
export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAppSelector(selectCurrentUser);
  const {
    data: allCartItems = [],
    isLoading: isLoadingCart
  } = useCart();
  const {
    data: defaultAddress,
    isLoading: isLoadingAddress
  } = useDefaultAddress();
  const [isInitialized, setIsInitialized] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [shippingFees, setShippingFees] = useState<GetShippingFeeResponse | null>(null);
  const [vouchers, setVouchers] = useState<VoucherEligibilityResponse | null>(null);
  const [orderData, setOrderData] = useState<CalculatedOrderData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [selectedSystemVoucherId, setSelectedSystemVoucherId] = useState<string | null>(null);
  const [selectedShopVoucherIds, setSelectedShopVoucherIds] = useState<Record<string, string>>({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const isRecalculatingRef = useRef(false);
  const selectedCartIds = useMemo(() => {
    const itemsParam = searchParams.get("items");
    return itemsParam ? itemsParam.split(",") : [];
  }, [searchParams]);
  const cartItems = useMemo(() => {
    if (selectedCartIds.length === 0) return allCartItems;
    return allCartItems.filter(item => selectedCartIds.includes(item.cartId));
  }, [allCartItems, selectedCartIds]);
  const createVirtualOrderMutation = useCreateVirtualOrder();
  const calculateOrderMutation = useCalculateOrderTotal();
  useEffect(() => {
    if (cartItems.length === 0 && !isLoadingCart) {
      router.push("/gio-hang");
      return;
    }
    if (cartItems.length > 0 && user && defaultAddress && !isInitialized && !isLoadingAddress) {
      initializeCheckout();
    }
  }, [cartItems, user, defaultAddress, isLoadingCart, isLoadingAddress, isInitialized]);
  useEffect(() => {
    return () => {
      isRecalculatingRef.current = false;
    };
  }, []);
  const initializeCheckout = useCallback(async () => {
    if (!user || !defaultAddress) {
      toast.error("Vui lòng thêm địa chỉ giao hàng");
      return;
    }
    setIsLoadingData(true);
    const items = mapCartItemsToOrderPayload(cartItems);
    const payload: CreateVirtualOrderPayload = {
      userAddressId: defaultAddress.id,
      items
    };
    try {
      const virtualOrderResult = await createVirtualOrderMutation.mutateAsync(payload);
      const newOrderId = virtualOrderResult.orderId;
      setOrderId(newOrderId);
      const shippingFeeResult = await getShippingFee({
        orderId: newOrderId
      });
      setShippingFees(shippingFeeResult);
      await applyShippingFee({
        orderId: newOrderId
      });
      const voucherResult = await checkVoucherEligibility(newOrderId);
      setVouchers(voucherResult);
      const calculatedOrder = await calculateOrderTotal(newOrderId);
      setOrderData(calculatedOrder);
      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to initialize checkout:", error);
      toast.error("Không thể khởi tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsLoadingData(false);
    }
  }, [user, defaultAddress, cartItems, createVirtualOrderMutation]);
  const recalculateOrder = useCallback(async () => {
    if (!orderId || isRecalculatingRef.current) return;
    isRecalculatingRef.current = true;
    try {
      const calculatedOrder = await calculateOrderTotal(orderId);
      setOrderData(calculatedOrder);
    } catch (error) {
      console.error("Failed to recalculate order:", error);
      toast.error("Không thể tính toán đơn hàng. Vui lòng thử lại.");
    } finally {
      isRecalculatingRef.current = false;
    }
  }, [orderId]);
  const debouncedRecalculate = useMemo(() => _.debounce(recalculateOrder, 300), [recalculateOrder]);
  const handleSystemVoucherChange = useCallback(async (voucherId: string | null) => {
    setSelectedSystemVoucherId(voucherId);
    if (!orderId) return;
    if (!voucherId) {
      debouncedRecalculate();
      return;
    }
    try {
      await applySystemVoucher({
        voucherId,
        orderId
      });
      debouncedRecalculate();
    } catch (error) {
      console.error("Failed to apply system voucher:", error);
      toast.error("Không thể áp dụng voucher hệ thống. Vui lòng thử lại.");
    }
  }, [orderId, debouncedRecalculate]);
  const handleShopVoucherChange = useCallback(async (shopId: string, voucherId: string | null) => {
    setSelectedShopVoucherIds(prev => ({
      ...prev,
      [shopId]: voucherId || ""
    }));
    if (!orderId) return;
    if (!voucherId) {
      debouncedRecalculate();
      return;
    }
    try {
      await applyShopVoucher({
        voucherId,
        orderId,
        shopId
      });
      debouncedRecalculate();
    } catch (error) {
      console.error("Failed to apply shop voucher:", error);
      toast.error("Không thể áp dụng voucher shop. Vui lòng thử lại.");
    }
  }, [orderId, debouncedRecalculate]);
  const handleCheckout = async () => {
    if (!user || !defaultAddress || !orderId) {
      toast.error("Vui lòng thêm địa chỉ giao hàng");
      return;
    }
    setIsCreatingOrder(true);
    try {
      await calculateOrderMutation.mutateAsync(orderId);
      const apiPaymentMethod = selectedPaymentMethod === PaymentMethod.COD ? OrderPaymentMethod.COD : OrderPaymentMethod.VNPay;
      const result = await createOrder({
        orderId,
        paymentMethod: apiPaymentMethod
      });
      if (apiPaymentMethod === OrderPaymentMethod.VNPay && result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }
      toast.success("Đặt hàng thành công!");
      router.push("/don-hang");
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setIsCreatingOrder(false);
    }
  };
  const orderTotal = orderData?.orderTotal ?? 0;
  const shippingFee = orderData?.feeShippingTotal ?? 0;
  const voucherDiscount = orderData?.discountTotal ?? 0;
  const finalTotal = orderData?.amountTotal ?? 0;
  const isCalculating = createVirtualOrderMutation.isPending || calculateOrderMutation.isPending || isLoadingData || isCreatingOrder;
  if (isLoadingCart || isLoadingAddress) {
    return <CheckoutSkeleton />;
  }
  if (cartItems.length === 0 && !isLoadingCart) {
    return <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không có sản phẩm để thanh toán
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng chọn sản phẩm từ giỏ hàng
          </p>
          <Button onClick={() => router.push("/gio-hang")}>
            Quay lại giỏ hàng
          </Button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <SectionContainer>
        <div className="py-6 space-y-3">
          <AddressSection address={defaultAddress?.fullOldAddress || ""} onAddressChange={() => {}} />

          <OrderItemsSection items={cartItems} formatPrice={formatPrice} />

          {}
          {shippingFees?.listFeeShipping && shippingFees.listFeeShipping.length > 0 && <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Phí vận chuyển (GHN)
                </h3>
                <div className="space-y-3">
                  {shippingFees.listFeeShipping.map(fee => <div key={fee.shopId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{fee.shopName}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({fee.serviceTypeName})
                        </span>
                      </div>
                      <span className="font-semibold text-purple-600">
                        {formatPrice(fee.totalFee)}
                      </span>
                    </div>)}
                </div>
              </div>}

          <Suspense fallback={<div className="bg-white rounded-lg p-6 animate-pulse h-32" />}>
            {vouchers && <VoucherSection vouchers={vouchers} selectedSystemVoucherId={selectedSystemVoucherId} selectedShopVoucherIds={selectedShopVoucherIds} onSystemVoucherChange={handleSystemVoucherChange} onShopVoucherChange={handleShopVoucherChange} formatPrice={formatPrice} />}
          </Suspense>

          <Suspense fallback={<div className="bg-white rounded-lg p-6 animate-pulse h-24" />}>
            <OrderPromotionsSection orderId={orderId} />
          </Suspense>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Phương thức thanh toán
              </h3>
              <div className="space-y-3">
                {[PaymentMethod.COD, PaymentMethod.VNPAY].map(method => {
                return <div key={method} onClick={() => {
                  setSelectedPaymentMethod(method);
                }} className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPaymentMethod === method ? "border-purple-600 bg-purple-50" : "border-gray-200 hover:border-purple-300"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === method ? "border-purple-600" : "border-gray-300"}`}>
                          {selectedPaymentMethod === method && <div className="w-3 h-3 rounded-full bg-purple-600" />}
                        </div>
                        <span className={`font-medium ${selectedPaymentMethod === method ? "text-purple-600" : "text-gray-700"}`}>
                          {PaymentMethodLabel[method]}
                        </span>
                      </div>
                      {method === PaymentMethod.VNPAY && <div className="text-sm text-gray-500">
                          <svg className="w-12 h-8" viewBox="0 0 48 32" fill="none">
                            <rect width="48" height="32" rx="4" fill="#0D47A1" />
                            <text x="24" y="20" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">
                              VNPAY
                            </text>
                          </svg>
                        </div>}
                    </div>;
              })}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-sm border border-purple-100 p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tổng tiền hàng</span>
                <span className="text-gray-900">{formatPrice(orderTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="text-gray-900">
                  {formatPrice(shippingFee)}
                </span>
              </div>
              {voucherDiscount > 0 && <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Giảm giá voucher</span>
                  <span className="text-green-600">
                    -{formatPrice(voucherDiscount)}
                  </span>
                </div>}
              <div className="border-t border-purple-200 pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Tổng thanh toán</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatPrice(finalTotal)}
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={handleCheckout} disabled={calculateOrderMutation.isPending || isCalculating || !isInitialized} className="w-full h-12 text-base font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all">
                {calculateOrderMutation.isPending || isCalculating ? "Đang xử lý..." : "Đặt hàng"}
              </Button>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>;
}