"use client";

import { ProductCard } from "@/features/customer/home";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";
import { useSimilarProducts } from "../../hooks";
import { ProductSkeleton } from "@/shared/components/skeleton";

interface SimilarProductsProps {
  productId: string;
  title?: string;
  byCategory?: boolean;
  byShop?: boolean;
  limit?: number;
}

export const SimilarProducts = ({
  productId,
  title = "Sản phẩm tương tự",
  byCategory = true,
  byShop = false,
  limit = 12,
}: SimilarProductsProps) => {
  const { data: products, isLoading } = useSimilarProducts(productId, {
    byCategory,
    byShop,
    limit,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>

      {/* Desktop: Carousel */}
      <div className="hidden md:block">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4" />
          <CarouselNext className="-right-4" />
        </Carousel>
      </div>

      {/* Mobile: Grid */}
      <div className="grid grid-cols-2 gap-4 md:hidden">
        {products.slice(0, 6).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
