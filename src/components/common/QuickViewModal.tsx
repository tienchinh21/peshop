"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useProductDetail } from "@/hooks/user/useProducts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  X,
  ShoppingCart,
  Store,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/users/product.types";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

/**
 * Modern Quick View Modal Component
 * Features:
 * - Large image gallery with smooth transitions
 * - Variant selector with image switching on hover/click
 * - Shop information
 * - Responsive design
 */
export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: QuickViewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<
    number | null
  >(null);
  const [imageError, setImageError] = useState(false);

  // Fetch full product details
  const { data: productDetail, isLoading } = useProductDetail(
    product?.slug || "",
    isOpen && !!product
  );

  // Reset state when modal opens/closes or product changes
  useEffect(() => {
    if (isOpen && product) {
      setCurrentImageIndex(0);
      setSelectedVariantIndex(null);
      setImageError(false);
    }
  }, [isOpen, product]);

  // Get current images to display
  const images = productDetail?.images || [];
  const currentImage =
    images.length > 0 ? images[currentImageIndex]?.urlImage : product?.image;

  // Handle variant hover/click - switch to variant image
  const handleVariantInteraction = (variantIndex: number) => {
    const variant = productDetail?.variants[variantIndex];
    if (!variant) return;

    // Find variant image from property values
    const variantImage = variant.propertyValues.find(
      (pv) => pv.urlImage !== null
    );

    if (variantImage?.urlImage) {
      // Find the image index in the images array
      const imageIndex = images.findIndex(
        (img) => img.urlImage === variantImage.urlImage
      );
      if (imageIndex !== -1) {
        setCurrentImageIndex(imageIndex);
      }
    }

    setSelectedVariantIndex(variantIndex);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (product) {
      onAddToCart?.(product);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white transition-colors"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left: Image Gallery */}
          <div className="relative bg-gray-50 p-6 md:p-8">
            {/* Main Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-white mb-4">
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <>
                  <Image
                    src={
                      imageError
                        ? "/placeholder-product.svg"
                        : currentImage || product.image
                    }
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-out"
                    onError={() => setImageError(true)}
                    priority
                  />

                  {/* Image Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {!isLoading && images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all",
                      currentImageIndex === index
                        ? "border-purple-600 ring-2 ring-purple-200"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Image
                      src={img.urlImage}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="p-6 md:p-8 flex flex-col">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold text-gray-900 leading-tight">
                {product.name}
              </DialogTitle>
            </DialogHeader>

            {/* Price */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-purple-600">
                {formatPrice(
                  selectedVariantIndex !== null &&
                    productDetail?.variants[selectedVariantIndex]
                    ? productDetail.variants[selectedVariantIndex].price
                    : product.price
                )}
              </div>
            </div>

            {/* Shop Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {product.shopName}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>{product.addressShop}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating & Stats */}
            <div className="flex items-center gap-6 mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">
                    {product.reviewPoint.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.reviewCount} đánh giá)
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Đã bán:{" "}
                <span className="font-semibold">{product.boughtCount}</span>
              </div>
            </div>

            {/* Variants */}
            {isLoading ? (
              <div className="mb-6">
                <Skeleton className="h-6 w-32 mb-3" />
                <div className="flex gap-2">
                  <Skeleton className="h-12 w-24" />
                  <Skeleton className="h-12 w-24" />
                  <Skeleton className="h-12 w-24" />
                </div>
              </div>
            ) : (
              productDetail?.variants &&
              productDetail.variants.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm font-semibold text-gray-700 mb-3">
                    Phân loại:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {productDetail.variants.map((variant, index) => {
                      const variantLabel = variant.propertyValues
                        .map((pv) => pv.value)
                        .join(" - ");
                      const isSelected = selectedVariantIndex === index;
                      const isOutOfStock = variant.quantity === 0;

                      return (
                        <button
                          key={variant.variantId}
                          onClick={() => handleVariantInteraction(index)}
                          onMouseEnter={() => handleVariantInteraction(index)}
                          disabled={isOutOfStock}
                          className={cn(
                            "px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium",
                            isSelected
                              ? "border-purple-600 bg-purple-50 text-purple-700"
                              : "border-gray-200 hover:border-purple-300 text-gray-700",
                            isOutOfStock &&
                              "opacity-50 cursor-not-allowed line-through"
                          )}
                        >
                          {variantLabel}
                          {isOutOfStock && (
                            <span className="ml-2 text-xs text-red-500">
                              Hết hàng
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Stock Info */}
                  {selectedVariantIndex !== null &&
                    productDetail.variants[selectedVariantIndex] && (
                      <div className="mt-3 text-sm text-gray-600">
                        Còn lại:{" "}
                        <span className="font-semibold text-gray-900">
                          {
                            productDetail.variants[selectedVariantIndex]
                              .quantity
                          }{" "}
                          sản phẩm
                        </span>
                      </div>
                    )}
                </div>
              )
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white h-12 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Thêm vào giỏ hàng
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="px-6 h-12 text-base"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
