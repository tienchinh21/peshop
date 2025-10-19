import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function TrailRunningBanner() {
  return (
    <div
      className="p-3 md:p-5 relative overflow-hidden h-[120px] md:h-[160px] group"
      style={{ backgroundColor: "#f9dae0" }}
    >
      <Image
        src="/homev2-weeklypicks.webp"
        alt="Running Shoes"
        fill
        className="object-contain object-right transition-transform duration-300 group-hover:scale-110"
      />

      <div className="relative z-10 max-w-xs">
        <p className="motta-banner__before-title mb-1 md:mb-2">WEEKLY PICKS</p>
        <h3 className="motta-banner__title mb-1 md:mb-2">Trail Running</h3>
        <p className="motta-banner__description mb-2 md:mb-2">
          Comfortable, Confident Fit
        </p>
        <Button
          variant="outline"
          size="sm"
          className="bg-pink-200 hover:bg-pink-300 text-purple-800 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-medium border border-purple-800 transition-colors text-xs md:text-sm"
        >
          Shop Now
        </Button>
      </div>
    </div>
  );
}
