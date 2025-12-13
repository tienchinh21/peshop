import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
export default function SpringRevivalBanner() {
  return <div className="p-3 md:p-6 relative overflow-hidden h-[200px] md:h-[300px]">
      {}
      <Image src="/homev2-limited-time-offer.webp" alt="Furniture" fill className="object-cover" />

      {}
      <div className="absolute top-2 md:top-4 right-2 md:right-4 z-20">
        <div className="bg-black text-white px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs md:text-sm font-mono font-bold">
          15 : 33 : 26
        </div>
      </div>

      <div className="relative z-10 max-w-xs">
        <p className="text-xs font-bold text-gray-800 mb-1 md:mb-2 tracking-wider uppercase">
          LIMITED TIME OFFER
        </p>

        <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-3 leading-tight">
          Spring Revival
        </h2>
        <p className="text-gray-800 mb-2 md:mb-4 text-xs md:text-sm">
          Save up to 25% on All Furniture.
        </p>
        <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 text-gray-800 px-3 md:px-5 py-1.5 md:py-2.5 rounded-full font-medium border border-gray-800 transition-colors text-xs md:text-sm">
          Shop Now
        </Button>
      </div>
    </div>;
}