"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ProductImage } from "@/shared/components/ui/product-image";
import { size, get, toNumber } from "lodash";
import { useProductDetail, type Product } from "@/features/customer/products";
import { useAddToCart } from "@/features/customer/cart";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/shared/components/ui/carousel";
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
  const { data: productDetail, isLoading } = useProductDetail(
    product?.slug || "",
    isOpen && !!product
  );
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
  const handleAddToCart = () => {
    if (!productDetail) return;
    const hasVariants = size(get(productDetail, "variants", [])) > 0;
    if (hasVariants && !selectedVariant) {
      return;
    }
    const payload = {
      productId: get(productDetail, "productId", ""),
      price: currentPrice,
      quantity,
      variantId: selectedVariant
        ? toNumber(get(selectedVariant, "variantId"))
        : null,
    };
    addToCartMutation.mutate(payload, {
      onSuccess: () => {
        onClose();
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
        className="w-[95vw] max-w-[95vw] sm:max-w-6xl max-h-[90vh] sm:w-auto p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        {/* Close button - minimum 44x44px touch target for mobile */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 z-50 rounded-full bg-white/90 hover:bg-white p-2.5 shadow-md transition-all min-h-[44px] min-w-[44px] h-11 w-11 flex items-center justify-center"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-h-[90vh] overflow-hidden">
          {}
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
                          <ProductImage
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

                {/* Carousel navigation buttons with proper touch targets */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevSlide}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-md transition-all cursor-pointer min-h-[44px] min-w-[44px] h-11 w-11 flex items-center justify-center"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={handleNextSlide}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-md transition-all cursor-pointer min-h-[44px] min-w-[44px] h-11 w-11 flex items-center justify-center"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </>
                )}

                {}
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

          {}
          <div className="p-6 lg:p-8 flex flex-col overflow-y-auto max-h-[90vh]">
            {}
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 line-clamp-2">
              {productDetail?.productName || product.name}
            </h2>

            {}
            <div className="mb-6">
              <div className="text-3xl lg:text-4xl font-bold text-purple-600">
                {formatPrice(currentPrice)}
              </div>
            </div>

            {}
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

            {}
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
                                      "min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg border transition-all text-sm font-medium cursor-pointer flex items-center gap-2",
                                      isSelected
                                        ? "border-2 border-gray-900 bg-gray-100 text-gray-900"
                                        : "border border-gray-300 hover:border-gray-400 text-gray-700",
                                      option.isOutOfStock &&
                                        "opacity-50 cursor-not-allowed line-through"
                                    )}
                                  >
                                    {}
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
                                        {}
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

            {/* Quantity selector with proper touch targets */}
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
                      className="min-w-[44px] min-h-[44px] w-11 h-11 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(selectedVariant.quantity, quantity + 1)
                        )
                      }
                      className="min-w-[44px] min-h-[44px] w-11 h-11 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons - stack vertically on mobile, horizontal on larger screens */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-2 mt-auto pt-4">
              <Button
                onClick={handleAddToCart}
                className="w-full sm:flex-1 bg-purple-600 hover:bg-purple-700 text-white min-h-[44px] h-11 font-medium text-sm"
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
                className="w-full sm:w-20 min-h-[44px] h-11 text-sm font-medium border hover:bg-gray-50"
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
