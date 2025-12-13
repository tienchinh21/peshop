"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
export function FlashSaleSkeleton() {
  return <div className="bg-white rounded-lg p-4 md:p-6">
      {}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3 md:gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
          {}
          <Skeleton className="h-8 w-32" />

          {}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-10 rounded-lg" />
              <span className="text-gray-300 font-bold">:</span>
              <Skeleton className="h-8 w-10 rounded-lg" />
              <span className="text-gray-300 font-bold">:</span>
              <Skeleton className="h-8 w-10 rounded-lg" />
            </div>
          </div>
        </div>

        {}
        <Skeleton className="h-8 w-28" />
      </div>

      {}
      <div className="flex gap-2 md:gap-4 overflow-hidden">
        {[...Array(5)].map((_, index) => <div key={index} className="flex-shrink-0 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-[calc(33.333%-10px)] lg:w-[calc(25%-12px)] xl:w-[calc(20%-13px)]">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              {}
              <Skeleton className="aspect-square w-full" />

              {}
              <div className="p-3 space-y-2">
                {}
                <Skeleton className="h-10 w-full" />

                {}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>

                {}
                <Skeleton className="h-5 w-20" />

                {}
                <Skeleton className="h-5 w-24" />

                {}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
}
export default FlashSaleSkeleton;