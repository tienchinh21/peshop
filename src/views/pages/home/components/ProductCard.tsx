"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart, Gift } from "lucide-react";
import { usePrefetchProductWithDebounce } from "@/hooks/user/useProducts";
import { useAddToCart } from "@/hooks/user/useCart";
import type { Product } from "@/types/users/product.types";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  priority?: boolean;
}

export default function ProductCard({
  product,
  onQuickView,
  priority = false,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { onMouseEnter, onMouseLeave } = usePrefetchProductWithDebounce();
  const addToCartMutation = useAddToCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    onQuickView?.(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    onQuickView?.(product);
  };

  return (
    <div
      className="relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow duration-300 h-full flex flex-col"
      onMouseEnter={() => onMouseEnter(product.slug)}
      onMouseLeave={onMouseLeave}
    >
      <Link
        href={{
          pathname: `/san-pham/${product.slug}`,
          query: { hasPromotion: product.hasPromotion },
        }}
        className="relative aspect-square overflow-hidden block"
      >
        <Image
          src={imageError ? "/placeholder-product.svg" : product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          onError={() => setImageError(true)}
        />

        {product.boughtCount > 0 && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full text-white bg-green-500">
              Đã bán {product.boughtCount}
            </span>
          </div>
        )}

        {product.hasPromotion && (
          <div className="absolute top-2 right-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <Gift className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </Link>

      <div className="p-3 flex-1 flex flex-col">
        <Link
          href={{
            pathname: `/san-pham/${product.slug}`,
            query: { hasPromotion: product.hasPromotion },
          }}
        >
          <h3
            className="text-sm font-medium text-gray-900 mb-2 leading-tight h-10 overflow-hidden text-ellipsis"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-2 h-6">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2 h-5">
          <div className="w-4 h-4 rounded-full bg-blue-500" />
          <span className="text-xs text-gray-600">{product.shopName}</span>
        </div>

        <div className="flex items-center gap-1 mb-3 h-5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.reviewPoint)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        <div className="flex-1" />

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="default"
            size="default"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm h-10"
            onClick={handleAddToCart}
          >
            <>
              <ShoppingCart className="w-4 h-4 mr-1" />
              Thêm vào giỏ
            </>
          </Button>
          <Button
            variant="outline"
            size="default"
            className="flex-1 text-purple-600 border-purple-600 hover:bg-purple-50 text-sm h-10"
            onClick={handleQuickView}
          >
            <Eye className="w-4 h-4 mr-1" />
            Xem nhanh
          </Button>
        </div>
      </div>
    </div>
  );
}
