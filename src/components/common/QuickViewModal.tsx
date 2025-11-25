"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { size, get, toNumber } from "lodash";
import { useProductDetail } from "@/hooks/user/useProducts";
import { useAddToCart } from "@/hooks/user/useCart";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import {
  X,
  ShoppingCart,
  Store,
  Star,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/users/product.types";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded?: () => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onDataLoaded,
}: QuickViewModalProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<
    number | null
  >(null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch full product details
  const { data: productDetail, isLoading } = useProductDetail(
    product?.slug || "",
    isOpen && !!product
  );

  // Add to cart mutation
  const addToCartMutation = useAddToCart();

  useEffect(() => {
    if (isOpen && product) {
      setSelectedVariantIndex(null);
      setSelectedOptions({});
      setQuantity(1);
      setCurrentSlide(0);
    }
  }, [isOpen, product]);

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (isOpen && productDetail && !isLoading && onDataLoaded) {
      onDataLoaded();
    }
  }, [isOpen, productDetail, isLoading, onDataLoaded]);

  const allImages = (() => {
    if (!productDetail) return [product?.image || ""];

    const images: string[] = [];

    if (productDetail.imgMain) {
      images.push(productDetail.imgMain);
    }

    if (productDetail.imgList && productDetail.imgList.length > 0) {
      productDetail.imgList.forEach((img) => {
        if (img && !images.includes(img)) {
          images.push(img);
        }
      });
    }

    if (productDetail.variants && productDetail.variants.length > 0) {
      productDetail.variants.forEach((variant) => {
        variant.variantValues.forEach((vv) => {
          if (
            vv.propertyValue.level === 0 &&
            vv.propertyValue.imgUrl &&
            !images.includes(vv.propertyValue.imgUrl)
          ) {
            images.push(vv.propertyValue.imgUrl);
          }
        });
      });
    }

    return images.length > 0 ? images : [product?.image || ""];
  })();

  const handleOptionSelect = (propertyName: string, propertyValue: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [propertyName]: propertyValue,
    }));
  };

  const handleVariantHover = (variantIndex: number) => {
    const variant = productDetail?.variants[variantIndex];
    if (!variant || !carouselApi) return;

    const colorVariant = variant.variantValues.find(
      (vv) => vv.propertyValue.level === 0 && vv.propertyValue.imgUrl
    );

    if (colorVariant?.propertyValue.imgUrl) {
      const imageIndex = allImages.indexOf(colorVariant.propertyValue.imgUrl);
      if (imageIndex !== -1) {
        carouselApi.scrollTo(imageIndex);
      }
    }
  };

  const findMatchingVariant = () => {
    if (!productDetail?.variants) return null;

    return productDetail.variants.find((variant) => {
      return Object.entries(selectedOptions).every(
        ([propertyName, selectedValue]) => {
          return variant.variantValues.some(
            (vv) =>
              vv.propertyValue.propertyName === propertyName &&
              vv.propertyValue.value === selectedValue
          );
        }
      );
    });
  };

  useEffect(() => {
    const matchingVariant = findMatchingVariant();
    if (matchingVariant && productDetail?.variants) {
      const variantIndex = productDetail.variants.findIndex(
        (v) => v.variantId === matchingVariant.variantId
      );
      setSelectedVariantIndex(variantIndex !== -1 ? variantIndex : null);
    } else {
      setSelectedVariantIndex(null);
    }
  }, [selectedOptions, productDetail?.variants]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Handle add to cart with variant selection
  const handleAddToCart = () => {
    if (!productDetail) return;

    // Check if product has variants and user selected one
    const hasVariants = size(get(productDetail, "variants", [])) > 0;
    if (hasVariants && !selectedVariant) {
      return; // Button should be disabled in this case
    }

    // Prepare payload
    const payload = {
      productId: get(productDetail, "productId", ""),
      price: currentPrice,
      quantity,
      variantId: selectedVariant
        ? toNumber(get(selectedVariant, "variantId"))
        : null,
    };

    // Call mutation
    addToCartMutation.mutate(payload, {
      onSuccess: () => {
        onClose(); // Close modal after successful add
      },
    });
  };

  const handlePrevSlide = () => {
    if (carouselApi) {
      carouselApi.scrollPrev();
    }
  };

  const handleNextSlide = () => {
    if (carouselApi) {
      carouselApi.scrollNext();
    }
  };

  const selectedVariant =
    selectedVariantIndex !== null &&
    productDetail?.variants[selectedVariantIndex];
  const currentPrice = selectedVariant
    ? selectedVariant.price
    : productDetail?.price || product?.price || 0;

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[95vw] sm:max-w-6xl max-h-[90vh] w-[95vw] p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-50 rounded-full bg-white/90 hover:bg-white p-1.5 shadow-md transition-all"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-h-[90vh] overflow-hidden">
          {/* Left: Image Carousel */}
          <div className="relative bg-gray-50 p-4 md:p-6">
            {isLoading ? (
              <Skeleton className="w-full aspect-square rounded-lg" />
            ) : (
              <div className="relative">
                <Carousel setApi={setCarouselApi} className="w-full">
                  <CarouselContent>
                    {allImages.map((img, index) => (
                      <CarouselItem key={index}>
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-white">
                          <Image
                            src={img || "/placeholder-product.svg"}
                            alt={`${
                              productDetail?.productName || product.name
                            } - ${index + 1}`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={index === 0}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>

                {/* Navigation Buttons */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevSlide}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={handleNextSlide}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </>
                )}

                {/* Carousel Dots */}
                {allImages.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-3">
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => carouselApi?.scrollTo(index)}
                        className={cn(
                          "h-1.5 rounded-full transition-all cursor-pointer",
                          index === currentSlide
                            ? "w-6 bg-purple-600"
                            : "w-1.5 bg-gray-300 hover:bg-gray-400"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="p-6 lg:p-8 flex flex-col overflow-y-auto max-h-[90vh]">
            {/* Product Name */}
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 line-clamp-2">
              {productDetail?.productName || product.name}
            </h2>

            {/* Price */}
            <div className="mb-6">
              <div className="text-3xl lg:text-4xl font-bold text-purple-600">
                {formatPrice(currentPrice)}
              </div>
            </div>

            {/* Shop & Rating */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">
                  {productDetail?.shopName || product.shopName}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">
                  {productDetail?.reviewPoint.toFixed(1) ||
                    product.reviewPoint.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500">
                  ({productDetail?.reviewCount || product.reviewCount})
                </span>
              </div>
            </div>

            {/* Variants */}
            {isLoading ? (
              <div className="mb-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-16" />
                  <Skeleton className="h-9 w-16" />
                </div>
              </div>
            ) : (
              productDetail?.variants &&
              productDetail.variants.length > 0 && (
                <div className="mb-4">
                  {(() => {
                    // Group variants by property type
                    const groupedVariants = productDetail.variants.reduce(
                      (acc, variant, variantIndex) => {
                        variant.variantValues.forEach((vv) => {
                          const propertyName = vv.propertyValue.propertyName;
                          const propertyValue = vv.propertyValue.value;
                          const level = vv.propertyValue.level;

                          if (!acc[propertyName]) {
                            acc[propertyName] = {
                              propertyName,
                              level,
                              options: new Map(),
                            };
                          }

                          // Store unique options for this property
                          if (!acc[propertyName].options.has(propertyValue)) {
                            acc[propertyName].options.set(propertyValue, {
                              value: propertyValue,
                              imgUrl: vv.propertyValue.imgUrl,
                              isOutOfStock: variant.quantity === 0,
                            });
                          }
                        });
                        return acc;
                      },
                      {} as Record<string, any>
                    );

                    return Object.values(groupedVariants)
                      .sort((a: any, b: any) => a.level - b.level)
                      .map((group: any) => (
                        <div key={group.propertyName} className="mb-4">
                          <div className="text-sm font-semibold text-gray-700 mb-2">
                            {group.propertyName}:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {Array.from(group.options.values()).map(
                              (option: any) => {
                                const isSelected =
                                  selectedOptions[group.propertyName] ===
                                  option.value;

                                return (
                                  <button
                                    key={`${group.propertyName}-${option.value}`}
                                    onClick={() =>
                                      handleOptionSelect(
                                        group.propertyName,
                                        option.value
                                      )
                                    }
                                    onMouseEnter={() => {
                                      // Find variant that matches this option
                                      const matchingVariant =
                                        productDetail?.variants.find(
                                          (variant) =>
                                            variant.variantValues.some(
                                              (vv) =>
                                                vv.propertyValue
                                                  .propertyName ===
                                                  group.propertyName &&
                                                vv.propertyValue.value ===
                                                  option.value
                                            )
                                        );
                                      if (matchingVariant) {
                                        const variantIndex =
                                          productDetail?.variants.findIndex(
                                            (v) =>
                                              v.variantId ===
                                              matchingVariant.variantId
                                          );
                                        if (variantIndex !== -1) {
                                          handleVariantHover(variantIndex);
                                        }
                                      }
                                    }}
                                    disabled={option.isOutOfStock}
                                    className={cn(
                                      "px-3 py-2 rounded-lg border transition-all text-sm font-medium cursor-pointer flex items-center gap-2",
                                      isSelected
                                        ? "border-2 border-gray-900 bg-gray-100 text-gray-900"
                                        : "border border-gray-300 hover:border-gray-400 text-gray-700",
                                      option.isOutOfStock &&
                                        "opacity-50 cursor-not-allowed line-through"
                                    )}
                                  >
                                    {/* Color/Image Icon */}
                                    {option.imgUrl ? (
                                      <div className="w-4 h-4 rounded-sm overflow-hidden">
                                        <Image
                                          src={option.imgUrl}
                                          alt={option.value}
                                          width={16}
                                          height={16}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ) : group.propertyName
                                        .toLowerCase()
                                        .includes("màu") ||
                                      group.propertyName
                                        .toLowerCase()
                                        .includes("color") ? (
                                      <div
                                        className="w-4 h-4 rounded-sm border border-gray-300"
                                        style={{
                                          backgroundColor:
                                            option.value.toLowerCase() === "đen"
                                              ? "#000"
                                              : option.value.toLowerCase() ===
                                                "trắng"
                                              ? "#fff"
                                              : option.value.toLowerCase() ===
                                                "cam"
                                              ? "#ff9500"
                                              : option.value.toLowerCase() ===
                                                "xanh"
                                              ? "#007AFF"
                                              : option.value.toLowerCase() ===
                                                "đỏ"
                                              ? "#FF3B30"
                                              : option.value.toLowerCase() ===
                                                "vàng"
                                              ? "#FFCC00"
                                              : option.value.toLowerCase() ===
                                                "hồng"
                                              ? "#FF2D92"
                                              : option.value.toLowerCase() ===
                                                "tím"
                                              ? "#AF52DE"
                                              : option.value.toLowerCase() ===
                                                "xám"
                                              ? "#8E8E93"
                                              : "#D1D1D6",
                                        }}
                                      />
                                    ) : (
                                      <div className="w-4 h-4 rounded-sm bg-gray-200 flex items-center justify-center">
                                        {/* Empty - no text or numbers */}
                                      </div>
                                    )}

                                    <span>{option.value}</span>

                                    {option.isOutOfStock && (
                                      <span className="ml-1 text-xs text-red-600">
                                        Hết
                                      </span>
                                    )}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ));
                  })()}
                </div>
              )
            )}

            {/* Stock & Quantity */}
            {selectedVariant && (
              <div className="mb-4 p-2 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Còn lại:{" "}
                    <span className="font-medium text-gray-800">
                      {selectedVariant.quantity}
                    </span>{" "}
                    sản phẩm
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(selectedVariant.quantity, quantity + 1)
                        )
                      }
                      className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto pt-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white h-10 font-medium text-sm"
                disabled={
                  isLoading ||
                  addToCartMutation.isPending ||
                  (productDetail?.variants &&
                    productDetail.variants.length > 0 &&
                    !selectedVariant)
                }
              >
                {isLoading || addToCartMutation.isPending ? (
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isLoading ? "Đang tải..." : "Đang thêm..."}</span>
                  </div>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Thêm vào giỏ hàng
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-20 h-10 text-sm font-medium border hover:bg-gray-50"
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
