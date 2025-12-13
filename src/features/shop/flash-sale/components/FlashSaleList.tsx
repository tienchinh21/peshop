"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { useShopFlashSales } from "../hooks/useShopFlashSale";
import { FlashSaleCard } from "./FlashSaleCard";
import { FlashSaleListSkeleton } from "./FlashSaleSkeleton";
import { FlashSaleEmptyState } from "./FlashSaleEmptyState";
export interface FlashSaleListProps {
  startDate: string;
  endDate: string;
  onRegister?: (flashSaleId: string) => void;
}
export function FlashSaleList({
  startDate,
  endDate,
  onRegister
}: FlashSaleListProps) {
  const {
    data: flashSales,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useShopFlashSales(startDate, endDate);
  const handleRegister = (flashSaleId: string) => {
    if (onRegister) {
      onRegister(flashSaleId);
    } else {
      toast.info(`Đăng ký tham gia Flash Sale #${flashSaleId}`, {
        description: "Tính năng đăng ký sản phẩm sẽ được cập nhật sau."
      });
    }
  };
  if (isLoading) {
    return <FlashSaleListSkeleton count={6} />;
  }
  if (isError) {
    return <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
        <AlertDescription className="flex flex-col gap-3">
          <span>
            {error instanceof Error ? error.message : "Không thể tải danh sách Flash Sale. Vui lòng thử lại."}
          </span>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
            <RefreshCw className={`size-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Thử lại
          </Button>
        </AlertDescription>
      </Alert>;
  }
  if (!flashSales || flashSales.length === 0) {
    return <FlashSaleEmptyState title="Không có Flash Sale" description="Không tìm thấy chương trình Flash Sale nào trong khoảng thời gian đã chọn." />;
  }
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {flashSales.map(flashSale => <FlashSaleCard key={flashSale.id} id={flashSale.id} startTime={flashSale.startTime} endTime={flashSale.endTime} status={flashSale.status} onRegister={handleRegister} />)}
    </div>;
}