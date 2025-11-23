"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VoucherDashboardMetrics } from "./components/VoucherDashboardMetrics";
import { VoucherDashboardChart } from "./components/VoucherDashboardChart";
import { VoucherDateRangePicker } from "./components/VoucherDateRangePicker";
import { useVoucherDashboard } from "@/hooks/shop/useVoucherDashboard";
import type { VoucherDashboardFilters } from "@/types/shops/voucher-dashboard.type";
import { BarChart3, RefreshCw } from "lucide-react";
import _ from "lodash";

interface VoucherDashboardSectionProps {
  filters: VoucherDashboardFilters;
  onFiltersChange: (filters: VoucherDashboardFilters) => void;
}

export const VoucherDashboardSection: React.FC<VoucherDashboardSectionProps> = ({
  filters,
  onFiltersChange,
}) => {
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useVoucherDashboard(filters);

  const dashboard = _.get(dashboardData, "content");

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6 h-[400px] flex items-center justify-center">
          <div className="text-gray-400">Đang tải dữ liệu thống kê...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !dashboard) {
    return (
      <Card className="border-red-100 bg-red-50">
        <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
          <div className="text-red-600">
            Không thể tải dữ liệu thống kê. Vui lòng thử lại.
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2 bg-white hover:bg-red-50 border-red-200 text-red-600"
          >
            <RefreshCw className="h-4 w-4" />
            Thử lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Tổng quan hiệu quả</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <VoucherDateRangePicker
            filters={filters}
            onFiltersChange={onFiltersChange}
          />
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="h-4 w-4" />
          </Button> */}
        </div>
      </div>

      <VoucherDashboardMetrics
        sales={dashboard.sales}
        orders={dashboard.orders}
        usageRate={dashboard.usageRate}
        buyers={dashboard.buyers}
      />

      <VoucherDashboardChart
        data={dashboard}
        mode={filters.mode || "day"}
      />
    </div>
  );
};
