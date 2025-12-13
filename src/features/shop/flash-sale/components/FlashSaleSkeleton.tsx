import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
export function FlashSaleSkeleton() {
  return <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-5 w-24 rounded-md" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </CardContent>
    </Card>;
}
export function FlashSaleListSkeleton({
  count = 3
}: {
  count?: number;
}) {
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({
      length: count
    }).map((_, index) => <FlashSaleSkeleton key={index} />)}
    </div>;
}
export function FlashSaleProductSkeleton() {
  return <Card className="overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="p-3">
        <Skeleton className="h-3 w-16 mb-1" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4 mt-1" />
      </CardContent>
    </Card>;
}