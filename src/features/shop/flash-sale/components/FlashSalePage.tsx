"use client";

import { useState } from "react";
import { Zap, Calendar, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { DateRangeFilter } from "./DateRangeFilter";
import { FlashSaleList } from "./FlashSaleList";
import { ParticipatedFlashSaleList } from "./ParticipatedFlashSaleList";
export function FlashSalePage() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };
  const [dateRange, setDateRange] = useState({
    startDate: formatDateForInput(firstDayOfMonth),
    endDate: formatDateForInput(lastDayOfMonth)
  });
  const handleFilter = (startDate: string, endDate: string) => {
    setDateRange({
      startDate,
      endDate
    });
  };
  return <div className="space-y-6">
      {}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-orange-100">
          <Zap className="size-5 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Flash Sale</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý các chương trình Flash Sale của shop
          </p>
        </div>
      </div>

      {}
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="available" className="flex items-center gap-2">
            <Calendar className="size-4" />
            Flash Sale có sẵn
          </TabsTrigger>
          <TabsTrigger value="participated" className="flex items-center gap-2">
            <Package className="size-4" />
            Đã tham gia
          </TabsTrigger>
        </TabsList>

        {}
        <TabsContent value="available" className="space-y-6">
          <div className="rounded-lg border bg-card p-4">
            <h2 className="mb-4 text-lg font-semibold">Lọc theo thời gian</h2>
            <DateRangeFilter onFilter={handleFilter} defaultStartDate={dateRange.startDate} defaultEndDate={dateRange.endDate} />
          </div>
          <FlashSaleList startDate={dateRange.startDate} endDate={dateRange.endDate} />
        </TabsContent>

        {}
        <TabsContent value="participated" className="space-y-6">
          <ParticipatedFlashSaleList />
        </TabsContent>
      </Tabs>
    </div>;
}