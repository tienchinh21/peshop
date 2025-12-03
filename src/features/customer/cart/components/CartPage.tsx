"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { groupBy, get } from "lodash";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { useCart, useUpdateCart, useDeleteCart, useClearCart } from "../hooks";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Store,
  Package,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import type { CartItem } from "../types";
import { SectionContainer } from "@/shared/components/layout";

export default function CartPage() {
  const router = useRouter();
  const { data: cartItems = [], isLoading, error } = useCart();
  const updateCartMutation = useUpdateCart();
  const deleteCartMutation = useDeleteCart();
  const clearCartMutation = useClearCart();

  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const groupedByShop = useMemo(() => {
    return groupBy(cartItems, "shopId");
  }, [cartItems]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleSelectItem = (cartId: string) => {
    setSelectedItems((prev) =>
      prev.includes(cartId)
        ? prev.filter((id) => id !== cartId)
        : [...prev, cartId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.cartId));
    }
  };

  const handleUpdateQuantity = (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    updateCartMutation.mutate({
      cartId,
      quantity: newQuantity,
    });
  };

  const handleDeleteItem = (cartId: string) => {
    deleteCartMutation.mutate(cartId);
    setSelectedItems((prev) => prev.filter((id) => id !== cartId));
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;

    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) {
      clearCartMutation.mutate();
      setSelectedItems([]);
    }
  };

  // Calculate totals for selected items
  const { totalItems, totalPrice } = useMemo(() => {
    const selected = cartItems.filter((item) =>
      selectedItems.includes(item.cartId)
    );
    return {
      totalItems: selected.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: selected.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    };
  }, [cartItems, selectedItems]);

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    const selectedCartIds = selectedItems.join(",");
    router.push(`/thanh-toan?items=${selectedCartIds}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Đang tải giỏ hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <Package className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Không thể tải giỏ hàng
          </h3>
          <p className="text-gray-600 mb-4">
            {get(error, "message", "Đã có lỗi xảy ra. Vui lòng thử lại.")}
          </p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </Card>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
          <Button onClick={() => router.push("/san-pham")} size="lg">
            Tiếp tục mua sắm
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <SectionContainer>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Giỏ hàng</h1>
        <p className="text-gray-600">
          Bạn có {cartItems.length} sản phẩm trong giỏ hàng
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Select All & Clear Cart */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={
                      selectedItems.length === cartItems.length &&
                      cartItems.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="font-medium">
                    Chọn tất cả ({cartItems.length})
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa tất cả
                </Button>
              </div>
            </CardContent>
          </Card>

          {Object.entries(groupedByShop).map(([shopId, items]) => {
            const shopName = get(items, "[0].shopName", "Cửa hàng");

            return (
              <Card key={shopId}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                    <Store className="w-5 h-5 text-purple-600" />
                    <Link
                      href={`/shop/${shopId}`}
                      className="font-semibold text-gray-900 hover:text-purple-600"
                    >
                      {shopName}
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <CartItemRow
                        key={item.cartId}
                        item={item}
                        isSelected={selectedItems.includes(item.cartId)}
                        onSelect={() => handleSelectItem(item.cartId)}
                        onUpdateQuantity={handleUpdateQuantity}
                        onDelete={() => handleDeleteItem(item.cartId)}
                        formatPrice={formatPrice}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Thông tin đơn hàng
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số lượng</span>
                  <span className="font-medium">{totalItems} sản phẩm</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold">Tổng cộng</span>
                <span className="text-2xl font-bold text-purple-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="w-full h-12 text-base"
                size="lg"
              >
                Thanh toán ({selectedItems.length})
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionContainer>
  );
}

interface CartItemRowProps {
  item: CartItem;
  isSelected: boolean;
  onSelect: () => void;
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onDelete: () => void;
  formatPrice: (price: number) => string;
}

function CartItemRow({
  item,
  isSelected,
  onSelect,
  onUpdateQuantity,
  onDelete,
  formatPrice,
}: CartItemRowProps) {
  return (
    <div className="flex gap-4">
      <Checkbox checked={isSelected} onCheckedChange={onSelect} />

      <div className="flex-1 flex gap-4">
        <Link href={`/san-pham/${item.slug}`} className="flex-shrink-0">
          <Image
            src={item.productImage || "/placeholder.png"}
            alt={item.productName}
            width={80}
            height={80}
            className="rounded-md object-cover"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            href={`/san-pham/${item.slug}`}
            className="font-medium text-gray-900 hover:text-purple-600 line-clamp-2"
          >
            {item.productName}
          </Link>

          {item.variantValues && item.variantValues.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Phân loại:{" "}
              {item.variantValues
                .map((vv) => get(vv, "propertyValue.value", ""))
                .filter(Boolean)
                .join(", ")}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-purple-600">
              {formatPrice(item.price)}
            </span>

            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() =>
                    onUpdateQuantity(item.cartId, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    onUpdateQuantity(item.cartId, item.quantity + 1)
                  }
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
