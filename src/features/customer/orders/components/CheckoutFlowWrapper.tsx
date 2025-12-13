"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCurrentUser } from "@/lib/store/slices/authSlice";
import { useCart } from "@/features/customer/cart";
import { useDefaultAddress } from "@/features/customer/checkout/hooks";
import { CheckoutSkeleton } from "@/shared/components/skeleton";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui";
import { ShoppingBag, MapPin } from "lucide-react";
import { CheckoutFlow, type CheckoutCartItem } from "./CheckoutFlow";
export function CheckoutFlowWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAppSelector(selectCurrentUser);
  const { data: allCartItems = [], isLoading: isLoadingCart } = useCart();
  const { data: defaultAddress, isLoading: isLoadingAddress } =
    useDefaultAddress();
  const selectedCartIds = React.useMemo(() => {
    const itemsParam = searchParams.get("items");
    return itemsParam ? itemsParam.split(",") : [];
  }, [searchParams]);
  const cartItems = React.useMemo(() => {
    if (selectedCartIds.length === 0) return allCartItems;
    return allCartItems.filter((item) => selectedCartIds.includes(item.cartId));
  }, [allCartItems, selectedCartIds]);
  const checkoutCartItems: CheckoutCartItem[] = React.useMemo(() => {
    return cartItems.map((item) => ({
      cartId: item.cartId,
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage,
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.price,
      shopId: item.shopId,
      shopName: item.shopName,
    }));
  }, [cartItems]);
  if (isLoadingCart || isLoadingAddress) {
    return <CheckoutSkeleton />;
  }
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Không có sản phẩm để thanh toán
            </h2>
            <p className="text-muted-foreground mb-6">
              Vui lòng chọn sản phẩm từ giỏ hàng
            </p>
            <Button onClick={() => router.push("/gio-hang")}>
              Quay lại giỏ hàng
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!defaultAddress) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Chưa có địa chỉ giao hàng
            </h2>
            <p className="text-muted-foreground mb-6">
              Vui lòng thêm địa chỉ giao hàng để tiếp tục
            </p>
            <Button onClick={() => router.push("/tai-khoan")}>
              Thêm địa chỉ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutFlow
        cartItems={checkoutCartItems}
        userAddressId={defaultAddress.id}
        userAddress={defaultAddress.fullNewAddress}
        onOrderCreated={(orderId) => {
          console.log("Order created:", orderId);
        }}
      />
    </div>
  );
}
