"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";
import ProductSaleCard from "./ProductSaleCard";
import { mockProducts } from "./mock-products";

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 12,
    seconds: 46,
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset timer when it reaches 0
          return { hours: 24, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3 md:gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Flash Deals
          </h2>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600">Ends in</span>
            <div className="flex items-center gap-1">
              <div className="bg-gray-800 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold min-w-[2rem] sm:min-w-[2.5rem] text-center">
                {timeLeft.hours.toString().padStart(2, "0")}
              </div>
              <span className="text-gray-600 font-bold">:</span>
              <div className="bg-gray-800 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold min-w-[2rem] sm:min-w-[2.5rem] text-center">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </div>
              <span className="text-gray-600 font-bold">:</span>
              <div className="bg-gray-800 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold min-w-[2rem] sm:min-w-[2.5rem] text-center">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-medium text-sm self-start sm:self-auto"
        >
          See All Products
        </Button>
      </div>

      {/* Products Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {mockProducts.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <ProductSaleCard
                {...product}
                totalQuantity={product.totalQuantity || 0}
                soldQuantity={product.soldQuantity || 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 hidden sm:flex" />
        <CarouselNext className="right-0 hidden sm:flex" />
      </Carousel>
    </div>
  );
}
