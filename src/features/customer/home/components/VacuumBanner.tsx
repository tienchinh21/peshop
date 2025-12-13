import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
export default function VacuumBanner() {
  return <div className="p-3 md:p-5 relative overflow-hidden h-[120px] md:h-[160px] bg-blue-50 group" style={{
    backgroundColor: "#c2dff4"
  }}>
      {}
      <Image src="/homev2-saveonappliance.webp" alt="Robot Vacuum" fill className="object-contain object-right transition-transform duration-300 group-hover:scale-110" />
      {}

      <div className="relative z-10 max-w-xs">
        <p className="text-xs font-bold text-blue-800 mb-1 tracking-wider uppercase">
          SAVE ON APPLIANCES
        </p>
        <h3 className="text-sm md:text-lg font-bold text-blue-900 mb-1 md:mb-2">
          Vacuum and Mop
        </h3>
        <p className="text-blue-800 mb-2 md:mb-3 text-xs">
          Low prices on vacuums.
        </p>
        <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 text-blue-800 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-medium border border-blue-800 transition-colors text-xs md:text-sm">
          Shop Now
        </Button>
      </div>
    </div>;
}