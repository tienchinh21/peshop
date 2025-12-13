"use client";

import { AlertCircle, RefreshCw, Package } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useParticipatedFlashSales } from "../hooks/useShopFlashSale";
import { FlashSaleCard } from "./FlashSaleCard";
import { FlashSaleProductCard } from "./FlashSaleProductCard";
import { FlashSaleListSkeleton, FlashSaleProductSkeleton } from "./FlashSaleSkeleton";
import { FlashSaleEmptyState } from "./FlashSaleEmptyState";
export function ParticipatedFlashSaleList() {
  const {
    data: participatedFlashSales,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useParticipatedFlashSales();
  if (isLoading) {
    return <div className="space-y-6">
        <FlashSaleListSkeleton count={2} />
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({
          length: 4
        }).map((_, index) => <FlashSaleProductSkeleton key={index} />)}
        </div>
      </div>;
  }
  if (isError) {
    return <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
        <AlertDescription className="flex flex-col gap-3">
          <span>
            {error instanceof Error ? error.message : "Không thể tải danh sách Flash Sale đã tham gia. Vui lòng thử lại."}
          </span>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
            <RefreshCw className={`size-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Thử lại
          </Button>
        </AlertDescription>
      </Alert>;
  }
  if (!participatedFlashSales || participatedFlashSales.length === 0) {
    return <FlashSaleEmptyState title="Chưa tham gia Flash Sale" description="Shop của bạn chưa đăng ký tham gia chương trình Flash Sale nào." />;
  }
  return <div className="space-y-6">
      {participatedFlashSales.map(participated => <Card key={participated.flashSale.id} className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              <FlashSaleCard id={participated.flashSale.id} startTime={participated.flashSale.startTime} endTime={participated.flashSale.endTime} status={participated.flashSale.status} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Package className="size-4" />
                <span>
                  Sản phẩm đã đăng ký ({participated.products.length})
                </span>
              </div>
              {participated.products.length > 0 ? <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                  {participated.products.map(product => <FlashSaleProductCard key={product.id} id={product.id} name={product.name} imgMain={product.imgMain} />)}
                </div> : <p className="text-sm text-muted-foreground py-4 text-center">
                  Chưa có sản phẩm nào được đăng ký cho Flash Sale này.
                </p>}
            </div>
          </CardContent>
        </Card>)}
    </div>;
}