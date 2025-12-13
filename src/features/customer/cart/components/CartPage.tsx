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
        {}
        <div className="lg:col-span-2 space-y-4">
          {}

          <div className="flex items-center justify-between px-2">
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

          {Object.entries(groupedByShop).map(([shopId, items]) => {
            const shopName = get(items, "[0].shopName", "Cửa hàng");
            return (
              <Card
                key={shopId}
                className="border-none shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] mb-6 transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 p-4 border-b border-gray-50 bg-white rounded-t-xl">
                    <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                      <Store className="w-4 h-4" />
                    </div>
                    <Link
                      href={`/shop/${shopId}`}
                      className="font-bold text-gray-900 hover:text-purple-600 flex-1"
                    >
                      {shopName}
                    </Link>
                  </div>

                  <div className="p-4 space-y-6 bg-white">
                    {items.map((item, index) => (
                      <React.Fragment key={item.cartId}>
                        {index > 0 && <Separator className="bg-gray-50" />}
                        <CartItemRow
                          item={item}
                          isSelected={selectedItems.includes(item.cartId)}
                          onSelect={() => handleSelectItem(item.cartId)}
                          onUpdateQuantity={handleUpdateQuantity}
                          onDelete={() => handleDeleteItem(item.cartId)}
                          formatPrice={formatPrice}
                        />
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4 border-none shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Thông tin đơn hàng
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tạm tính</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Số lượng</span>
                  <span className="font-semibold text-gray-900">
                    {totalItems} sản phẩm
                  </span>
                </div>
              </div>

              <Separator className="my-6 bg-gray-100" />

              <div className="flex justify-between mb-8 items-end">
                <span className="text-base font-medium text-gray-600 mb-1">
                  Tổng cộng
                </span>
                <span className="text-2xl font-bold text-purple-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="w-full h-12 text-base font-semibold shadow-lg shadow-purple-200 hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300"
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
    <div className="flex gap-4 group/item items-start py-2">
      <Checkbox
        checked={isSelected}
        onCheckedChange={onSelect}
        className="mt-8 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
      />

      <div className="flex-1 flex gap-5">
        <Link
          href={`/san-pham/${item.slug}`}
          className="flex-shrink-0 relative group"
        >
          <Image
            src={item.productImage || "/placeholder.png"}
            alt={item.productName}
            width={100}
            height={100}
            className="rounded-xl object-cover shadow-sm transition-transform group-hover:scale-105"
          />
        </Link>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <Link
              href={`/san-pham/${item.slug}`}
              className="font-medium text-gray-900 hover:text-purple-600 line-clamp-2 text-base mb-1"
            >
              {item.productName}
            </Link>

            {item.variantValues && item.variantValues.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.variantValues
                  .map((vv) => get(vv, "propertyValue.value", ""))
                  .filter(Boolean)
                  .map((val, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-600 font-medium"
                    >
                      {val}
                    </span>
                  ))}
              </div>
            )}
          </div>

          <div className="flex items-end justify-between mt-4">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-purple-600">
                {formatPrice(item.price)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-50 rounded-lg p-1 shadow-sm border border-gray-100">
                <button
                  onClick={() =>
                    onUpdateQuantity(item.cartId, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                  className="w-7 h-7 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-10 text-center font-semibold text-sm text-gray-900">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    onUpdateQuantity(item.cartId, item.quantity + 1)
                  }
                  className="w-7 h-7 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full h-9 w-9"
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
