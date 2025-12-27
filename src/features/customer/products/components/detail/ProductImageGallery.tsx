"use client";

import { useEffect, useState } from "react";
import { ProductImage } from "@/shared/components/ui/product-image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/shared/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ZoomIn } from "lucide-react";
interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  onImageChange?: (index: number) => void;
}
export const ProductImageGallery = ({
  images,
  productName,
  onImageChange,
}: ProductImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [isZoomed, setIsZoomed] = useState(false);
  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    api?.scrollTo(index);
    onImageChange?.(index);
  };
  const handleCarouselSelect = () => {
    if (!api) return;
    const index = api.selectedScrollSnap();
    setSelectedIndex(index);
    onImageChange?.(index);
  };
  useEffect(() => {
    if (!api) return;
    api.on("select", handleCarouselSelect);
    api.on("reInit", handleCarouselSelect);
    return () => {
      api.off("select", handleCarouselSelect);
      api.off("reInit", handleCarouselSelect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);
  useEffect(() => {
    if (!api) return;
    api.scrollTo(selectedIndex);
  }, [api, selectedIndex]);
  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative w-full overflow-hidden rounded-lg border bg-white"
        style={{
          aspectRatio: "1/1",
        }}
      >
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            startIndex: selectedIndex,
          }}
          className="h-full w-full"
        >
          <CarouselContent className="h-full">
            {images.map((image, index) => (
              <CarouselItem key={index} className="h-full">
                <div
                  className={cn(
                    "relative h-full w-full cursor-zoom-in transition-transform",
                    isZoomed && "scale-150"
                  )}
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <ProductImage
                    src={image || "/placeholder-product.png"}
                    alt={`${productName} - Ảnh ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    quality={90}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="absolute bottom-4 right-4 rounded-full bg-black/50 p-2 text-white">
          <ZoomIn className="h-5 w-5" />
        </div>

        <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-md border-2 transition-all hover:border-primary",
              selectedIndex === index
                ? "border-primary ring-2 ring-primary ring-offset-2"
                : "border-gray-200"
            )}
          >
            <ProductImage
              src={image || "/placeholder-product.png"}
              alt={`${productName} - Thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 20vw, 10vw"
              loading="lazy"
              quality={75}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
