"use client";

import { useState, useMemo } from "react";
import { Star, Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProductDetail } from "../../types";
import { useAddToCart } from "@/features/customer/cart";
interface ProductInfoSectionProps {
  product: ProductDetail;
  onVariantChange?: (variantIndex: number) => void;
}
export const ProductInfoSection = ({
  product,
  onVariantChange,
}: ProductInfoSectionProps) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addToCartMutation = useAddToCart();
  const selectedVariant = product.variants[selectedVariantIndex];
  const maxQuantity = selectedVariant?.quantity || 0;
  const variantsByLevel = useMemo(() => {
    const grouped: Record<number, any[]> = {};
    product.variants.forEach((variant, index) => {
      variant.variantValues.forEach((vv) => {
        if (!grouped[vv.propertyValue.level]) {
          grouped[vv.propertyValue.level] = [];
        }
        const existing = grouped[vv.propertyValue.level].find(
          (item) => item.value === vv.propertyValue.value
        );
        if (!existing) {
          grouped[vv.propertyValue.level].push({
            value: vv.propertyValue.value,
            imgUrl: vv.propertyValue.imgUrl,
            propertyName: vv.property.name,
            variantIndex: index,
          });
        }
      });
    });
    return grouped;
  }, [product.variants]);
  const handleVariantSelect = (variantIndex: number) => {
    setSelectedVariantIndex(variantIndex);
    setQuantity(1);
    onVariantChange?.(variantIndex);
  };
  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };
  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCartMutation.mutate({
      productId: product.productId,
      //@ts-ignore
      variantId: selectedVariant.variantId,
      quantity,
    });
  };
  const isInStock = maxQuantity > 0;
  const priceFormatted = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(selectedVariant?.price || product.price);
  return (
    <div className="flex flex-col gap-6">
      {}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {product.productName}
        </h1>
      </div>

      {}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-orange-500">
            {product.reviewPoint.toFixed(1)}
          </span>
          <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
        </div>
        <div className="h-4 w-px bg-gray-300" />
        <div className="text-gray-600">
          <span className="font-semibold">{product.reviewCount}</span> Đánh giá
        </div>
        <div className="h-4 w-px bg-gray-300" />
        <div className="text-gray-600">
          <span className="font-semibold">{product.boughtCount}</span> Đã bán
        </div>
      </div>

      {}
      <div className="rounded-lg bg-gray-50 p-4">
        <div className="text-3xl font-bold text-primary">{priceFormatted}</div>
      </div>

      {}
      {Object.entries(variantsByLevel).map(([level, options]) => (
        <div key={level} className="flex flex-col gap-3">
          <div className="text-sm font-medium text-gray-700">
            {options[0]?.propertyName}
          </div>
          <div className="flex flex-wrap gap-2">
            {options.map((option, index) => {
              const isSelected = selectedVariantIndex === option.variantIndex;
              return (
                <button
                  key={index}
                  onClick={() => handleVariantSelect(option.variantIndex)}
                  className={cn(
                    "flex items-center gap-2 rounded-md border-2 px-4 py-2 text-sm transition-all hover:border-primary min-h-[44px] min-w-[44px]",
                    isSelected
                      ? "border-primary bg-primary/5 font-medium"
                      : "border-gray-200"
                  )}
                >
                  {option.imgUrl && (
                    <div className="relative h-6 w-6 overflow-hidden rounded">
                      <img
                        src={option.imgUrl}
                        alt={option.value}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <span>{option.value}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {}
      <div className="flex flex-col gap-3">
        <div className="text-sm font-medium text-gray-700">Số lượng</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="h-11 w-11 min-h-[44px] min-w-[44px]"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex h-11 w-16 items-center justify-center border-x">
              <span className="font-medium">{quantity}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= maxQuantity}
              className="h-11 w-11 min-h-[44px] min-w-[44px]"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            {isInStock ? (
              <span>{maxQuantity} sản phẩm có sẵn</span>
            ) : (
              <Badge variant="destructive">Hết hàng</Badge>
            )}
          </div>
        </div>
      </div>

      {}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          size="lg"
          onClick={handleAddToCart}
          disabled={!isInStock || addToCartMutation.isPending}
          className="flex-1 min-h-[44px]"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Thêm vào giỏ hàng
        </Button>
        <Button size="lg" disabled={!isInStock} className="flex-1 min-h-[44px]">
          Mua ngay
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 min-h-[44px] min-w-[44px]"
        >
          <Heart className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
