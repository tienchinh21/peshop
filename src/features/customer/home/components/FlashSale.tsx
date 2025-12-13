"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/shared/components/ui/carousel";
import ProductSaleCard from "./ProductSaleCard";
import { FlashSaleSkeleton } from "./FlashSaleSkeleton";
import { useFlashSaleToday, useFlashSaleProducts, useInvalidateFlashSale } from "../hooks";
import { findActiveFlashSale, calculateTimeRemaining, formatTimeValue } from "../utils";
import type { TimeRemaining, FlashSaleProduct } from "../types";
export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });
  const {
    data: flashSales,
    isLoading: isLoadingToday,
    isError: isErrorToday
  } = useFlashSaleToday();
  const activeFlashSale = flashSales ? findActiveFlashSale(flashSales) : null;
  const {
    data: flashSaleProducts,
    isLoading: isLoadingProducts,
    isError: isErrorProducts
  } = useFlashSaleProducts(activeFlashSale?.flashSaleId ?? "", !!activeFlashSale);
  const invalidateFlashSale = useInvalidateFlashSale();
  const [hasInvalidated, setHasInvalidated] = useState(false);
  useEffect(() => {
    if (!activeFlashSale?.endTime) return;
    setHasInvalidated(false);
    const updateCountdown = () => {
      const remaining = calculateTimeRemaining(activeFlashSale.endTime);
      setTimeLeft(remaining);
      if (remaining.isExpired && !hasInvalidated) {
        setHasInvalidated(true);
        invalidateFlashSale();
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [activeFlashSale?.endTime, invalidateFlashSale, hasInvalidated]);
  if (isLoadingToday || activeFlashSale && isLoadingProducts) {
    return <FlashSaleSkeleton />;
  }
  if (isErrorToday || isErrorProducts || !activeFlashSale) {
    return null;
  }
  const products = flashSaleProducts?.products ?? [];
  if (products.length === 0) {
    return null;
  }
  return <div className="bg-white rounded-lg p-4 md:p-6">
      {}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3 md:gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Flash Deals
          </h2>

          {}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600">Ends in</span>
            <div className="flex items-center gap-1">
              <div className="bg-gray-800 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold min-w-[2rem] sm:min-w-[2.5rem] text-center">
                {formatTimeValue(timeLeft.hours)}
              </div>
              <span className="text-gray-600 font-bold">:</span>
              <div className="bg-gray-800 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold min-w-[2rem] sm:min-w-[2.5rem] text-center">
                {formatTimeValue(timeLeft.minutes)}
              </div>
              <span className="text-gray-600 font-bold">:</span>
              <div className="bg-gray-800 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold min-w-[2rem] sm:min-w-[2.5rem] text-center">
                {formatTimeValue(timeLeft.seconds)}
              </div>
            </div>
          </div>
        </div>

        <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-medium text-sm self-start sm:self-auto">
          See All Products
        </Button>
      </div>

      {}
      <Carousel opts={{
      align: "start",
      loop: true
    }} className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product: FlashSaleProduct) => <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              <ProductSaleCard id={product.id} name={product.name} image={product.image} price={product.price} priceDiscount={product.priceDiscount} percentDecrease={product.percentDecrease} quantity={product.quantity} usedQuantity={product.usedQuantity} reviewCount={product.reviewCount} reviewPoint={product.reviewPoint} slug={product.slug} shopName={product.shopName} />
            </CarouselItem>)}
        </CarouselContent>
        <CarouselPrevious className="left-0 hidden sm:flex" />
        <CarouselNext className="right-0 hidden sm:flex" />
      </Carousel>
    </div>;
}