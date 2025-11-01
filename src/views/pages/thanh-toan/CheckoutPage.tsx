"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import _ from "lodash";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCurrentUser } from "@/lib/store/slices/authSlice";
import { useCart } from "@/hooks/user/useCart";
import { useDefaultAddress } from "@/hooks/user/useAddress";
import {
  useCreateVirtualOrder,
  useCalculateOrderTotal,
} from "@/hooks/user/useCheckout";
import {
  getShippingFee,
  applyShippingFee,
  applySystemVoucher,
  applyShopVoucher,
  calculateOrderTotal,
} from "@/services/api/users/order.service";
import { checkVoucherEligibility } from "@/services/api/users/voucher-check.service";
import { CheckoutSkeleton } from "@/components/skeleton";
import { AddressSection } from "./components/AddressSection";
import { OrderItemsSection } from "./components/OrderItemsSection";
import { ShippingFeeSection } from "./components/ShippingFeeSection";
import { VoucherSection } from "./components/VoucherSection";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type {
  CreateVirtualOrderPayload,
  OrderProductItemPayload,
  GetShippingFeePayload,
  ShippingFeeResponse,
} from "@/types/users/order.types";
import type { VoucherEligibilityResponse } from "@/types/users/voucher-check.types";
import { SectionContainer } from "@/components/common";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAppSelector(selectCurrentUser);
  const { data: allCartItems = [], isLoading: isLoadingCart } = useCart();
  const { data: defaultAddress, isLoading: isLoadingAddress } =
    useDefaultAddress();

  const [isInitialized, setIsInitialized] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [shippingFees, setShippingFees] = useState<ShippingFeeResponse | null>(
    null
  );
  const [vouchers, setVouchers] = useState<VoucherEligibilityResponse | null>(
    null
  );
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedShippingIds, setSelectedShippingIds] = useState<
    Record<string, string>
  >({});
  const [selectedSystemVoucherId, setSelectedSystemVoucherId] = useState<
    string | null
  >(null);
  const [selectedShopVoucherIds, setSelectedShopVoucherIds] = useState<
    Record<string, string>
  >({});

  const selectedCartIds = useMemo(() => {
    const itemsParam = searchParams.get("items");
    return itemsParam ? itemsParam.split(",") : [];
  }, [searchParams]);

  const cartItems = useMemo(() => {
    if (selectedCartIds.length === 0) return allCartItems;
    return allCartItems.filter((item) => selectedCartIds.includes(item.cartId));
  }, [allCartItems, selectedCartIds]);

  const createVirtualOrderMutation = useCreateVirtualOrder();
  const calculateOrderMutation = useCalculateOrderTotal();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  useEffect(() => {
    if (cartItems.length === 0 && !isLoadingCart) {
      router.push("/gio-hang");
      return;
    }

    if (
      cartItems.length > 0 &&
      user &&
      defaultAddress &&
      !isInitialized &&
      !isLoadingAddress
    ) {
      initializeCheckout();
    }
  }, [cartItems, user, defaultAddress, isLoadingCart, isLoadingAddress]);

  const initializeCheckout = async () => {
    if (!user || !defaultAddress) {
      toast.error("Vui lòng thêm địa chỉ giao hàng");
      return;
    }

    setIsLoadingData(true);

    const items: OrderProductItemPayload[] = cartItems.map((item) => ({
      productId: item.productId,
      variantId: item.variantId ? _.toNumber(item.variantId) : 0,
      note: "",
      quantity: item.quantity,
      priceOriginal: item.price,
      categoryId: "",
      shopId: item.shopId,
    }));

    const payload: CreateVirtualOrderPayload = {
      userAddressId: defaultAddress.id,
      items,
    };

    try {
      const virtualOrderResult = await createVirtualOrderMutation.mutateAsync(
        payload
      );
      const newOrderId = virtualOrderResult.orderId;
      setOrderId(newOrderId);

      const groupedByShop = _.groupBy(cartItems, "shopId");
      const listFeeShipping = Object.entries(groupedByShop).map(
        ([shopId, shopItems]) => ({
          shopId,
          product: shopItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId ? _.toNumber(item.variantId) : 0,
            note: "",
            quantity: item.quantity,
          })),
        })
      );

      const shippingFeePayload: GetShippingFeePayload = {
        userOldFullAddress: defaultAddress.fullOldAddress || "",
        userOldProviceId: defaultAddress.oldProviceId || "",
        userOldWardId: defaultAddress.oldDistrictId || "",
        orderId: newOrderId,
        listFeeShipping,
      };

      const [shippingFeeResult, voucherResult] = await Promise.all([
        getShippingFee(shippingFeePayload),
        checkVoucherEligibility(newOrderId),
      ]);

      setShippingFees(shippingFeeResult);
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
  };

  const recalculateOrder = async () => {
    if (!orderId) return;
    try {
      const calculatedOrder = await calculateOrderTotal(orderId);
      setOrderData(calculatedOrder);
    } catch (error) {
      console.error("Failed to recalculate order:", error);
      toast.error("Không thể tính toán đơn hàng. Vui lòng thử lại.");
    }
  };

  const handleShippingChange = async (shopId: string, shippingId: string) => {
    setSelectedShippingIds((prev) => ({
      ...prev,
      [shopId]: shippingId,
    }));

    if (!orderId) return;

    try {
      const listFeeShipping = Object.entries({
        ...selectedShippingIds,
        [shopId]: shippingId,
      }).map(([sid, shid]) => ({
        shippingId: shid,
        shopId: sid,
      }));

      await applyShippingFee({
        orderId,
        listFeeShipping,
      });

      await recalculateOrder();
    } catch (error) {
      console.error("Failed to apply shipping fee:", error);
      toast.error("Không thể áp dụng phí vận chuyển. Vui lòng thử lại.");
    }
  };

  const handleSystemVoucherChange = async (voucherId: string | null) => {
    setSelectedSystemVoucherId(voucherId);

    if (!orderId || !voucherId) return;

    try {
      await applySystemVoucher({
        voucherId,
        orderId,
      });

      await recalculateOrder();
    } catch (error) {
      console.error("Failed to apply system voucher:", error);
      toast.error("Không thể áp dụng voucher hệ thống. Vui lòng thử lại.");
    }
  };

  const handleShopVoucherChange = async (
    shopId: string,
    voucherId: string | null
  ) => {
    setSelectedShopVoucherIds((prev) => ({
      ...prev,
      [shopId]: voucherId || "",
    }));

    if (!orderId || !voucherId) return;

    try {
      await applyShopVoucher({
        voucherId,
        orderId,
        shopId,
      });

      await recalculateOrder();
    } catch (error) {
      console.error("Failed to apply shop voucher:", error);
      toast.error("Không thể áp dụng voucher shop. Vui lòng thử lại.");
    }
  };

  const handleCheckout = async () => {
    if (!user || !defaultAddress || !orderId) {
      toast.error("Vui lòng thêm địa chỉ giao hàng");
      return;
    }

    try {
      await calculateOrderMutation.mutateAsync(orderId);
      toast.success("Đặt hàng thành công!");
      router.push("/don-hang");
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  const orderTotal = orderData?.orderTotal || 0;
  const shippingFee = orderData?.feeShippingTotal || 0;
  const voucherDiscount =
    (orderData?.voucherSystemValue || 0) +
    _.sumBy(orderData?.itemShops || [], (shop: any) => shop.voucherValue || 0);
  const finalTotal = orderData?.amountTotal || 0;

  const isCalculating =
    createVirtualOrderMutation.isPending ||
    calculateOrderMutation.isPending ||
    isLoadingData;

  if (isLoadingCart || isLoadingAddress) {
    return <CheckoutSkeleton />;
  }

  if (cartItems.length === 0 && !isLoadingCart) {
    return (
      <div className="container mx-auto px-4 py-8">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SectionContainer>
        <div className="py-6 space-y-3">
          <AddressSection
            address={defaultAddress?.fullOldAddress || ""}
            onAddressChange={() => {}}
          />

          <OrderItemsSection items={cartItems} formatPrice={formatPrice} />

          {shippingFees?.listFeeShipping &&
            shippingFees.listFeeShipping.length > 0 && (
              <ShippingFeeSection
                shippingFees={shippingFees.listFeeShipping}
                selectedShippingIds={selectedShippingIds}
                onShippingChange={handleShippingChange}
                formatPrice={formatPrice}
              />
            )}

          {vouchers && (
            <VoucherSection
              vouchers={vouchers}
              selectedSystemVoucherId={selectedSystemVoucherId}
              selectedShopVoucherIds={selectedShopVoucherIds}
              onSystemVoucherChange={handleSystemVoucherChange}
              onShopVoucherChange={handleShopVoucherChange}
              formatPrice={formatPrice}
            />
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Phương thức thanh toán</span>
                </div>
                <span className="text-purple-600 font-medium">
                  Thanh toán khi nhận hàng
                </span>
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
              {voucherDiscount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Giảm giá voucher</span>
                  <span className="text-green-600">
                    -{formatPrice(voucherDiscount)}
                  </span>
                </div>
              )}
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
              <Button
                onClick={handleCheckout}
                disabled={
                  calculateOrderMutation.isPending ||
                  isCalculating ||
                  !isInitialized
                }
                className="w-full h-12 text-base font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                {calculateOrderMutation.isPending || isCalculating
                  ? "Đang xử lý..."
                  : "Đặt hàng"}
              </Button>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
