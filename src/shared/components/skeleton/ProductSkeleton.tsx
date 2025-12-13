import { Skeleton } from "@/shared/components/ui/skeleton";
export default function ProductSkeleton() {
  return <div className="relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
      {}
      <div className="relative aspect-square overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      {}
      <div className="p-3 flex-1 flex flex-col">
        {}
        <div className="mb-2 h-10 flex items-start">
          <Skeleton className="w-full h-4" />
        </div>

        {}
        <div className="flex items-center gap-2 mb-2 h-6">
          <Skeleton className="w-24 h-5" />
        </div>

        {}
        <div className="flex items-center gap-2 mb-2 h-5">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="w-20 h-3" />
        </div>

        {}
        <div className="flex items-center gap-1 mb-3 h-5">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="w-3 h-3 rounded-sm" />)}
          </div>
          <Skeleton className="w-8 h-3" />
        </div>

        {}
        <div className="flex-1" />

        {}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Skeleton className="w-full h-10 rounded-md" />
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
      </div>
    </div>;
}