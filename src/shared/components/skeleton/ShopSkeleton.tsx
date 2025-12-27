import ProductSkeleton from "./ProductSkeleton";
import { Skeleton } from "@/shared/components/ui/skeleton";
export default function ShopSkeleton() {
  return (
    <div className="min-h-screen">
      {}
      <Skeleton className="h-48 w-full rounded-none" />

      <div className="container mx-auto px-4 py-8 space-y-6">
        {}
        <div className="bg-white rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
        </div>

        {}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
