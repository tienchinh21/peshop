"use client";

import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/shared/components/ui/carousel";
const slides = [{
  id: 2,
  image: "/homev2-slider01.webp",
  beforeTitle: "NEW ARRIVALS",
  title: "Latest Technology\nInnovation",
  description: "Discover cutting-edge laptops",
  buttonText: "Explore",
  backgroundColor: "#f4efef",
  textColor: "text-gray-800",
  beforeTitleColor: "text-gray-600",
  descriptionColor: "text-gray-700",
  buttonVariant: "outline",
  buttonClassName: "bg-white hover:bg-gray-50 text-gray-800 border-gray-800"
}, {
  id: 3,
  image: "/homev2-slider02.webp",
  beforeTitle: "PREMIUM COLLECTION",
  title: "Elite Performance\nRedefined",
  description: "High-end laptops for professionals",
  buttonText: "View Collection",
  backgroundColor: "#d7c9c5",
  buttonVariant: "outline",
  buttonClassName: "bg-white hover:bg-gray-50 text-gray-800 border-gray-800"
}];
export default function LaptopBanner() {
  return <div className="relative h-[200px] md:h-[300px]">
      <Carousel className="w-full h-full" opts={{
      align: "start",
      loop: true
    }}>
        <CarouselContent className="h-full">
          {slides.map(slide => <CarouselItem key={slide.id} className="h-full">
              <div className="p-3 md:p-6 relative overflow-hidden h-full w-full" style={{
            backgroundColor: slide.backgroundColor
          }}>
                {}
                <Image src={slide.image} alt={slide.title} fill className="object-contain h-full object-right" />

                <div className="relative z-10 max-w-xs h-full">
                  <p className={`text-xs font-bold mb-1 md:mb-2 tracking-wider uppercase ${slide.beforeTitleColor || "text-white"}`}>
                    {slide.beforeTitle}
                  </p>
                  <h2 className={`text-lg md:text-2xl font-bold mb-2 md:mb-3 leading-tight whitespace-pre-line ${slide.textColor || "text-white"}`}>
                    {slide.title}
                  </h2>
                  <p className={`mb-2 md:mb-4 text-xs md:text-sm ${slide.descriptionColor || "text-white"}`}>
                    {slide.description}
                  </p>
                  <Button variant="secondary" size="sm" className={slide.buttonClassName || "bg-white hover:bg-gray-100 text-gray-800 rounded-md text-xs md:text-sm mt-3 md:mt-5"}>
                    {slide.buttonText}
                  </Button>
                </div>

                {}
              </div>
            </CarouselItem>)}
        </CarouselContent>
        <CarouselPrevious className="left-2 md:left-4" />
        <CarouselNext className="right-2 md:right-4" />
      </Carousel>
    </div>;
}