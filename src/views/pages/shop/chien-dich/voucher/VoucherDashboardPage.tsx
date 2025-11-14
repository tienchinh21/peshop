"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { VoucherDashboardMetrics } from "./components/VoucherDashboardMetrics";
import { VoucherDashboardCharts } from "./components/VoucherDashboardCharts";
import { useVoucherDashboard } from "@/hooks/shop/useVoucherDashboard";
import type { VoucherDashboardFilters } from "@/types/shops/voucher-dashboard.type";
import { Calendar, TrendingUp } from "lucide-react";
import _ from "lodash";

export default function VoucherDashboardPage() {
  const [filters, setFilters] = useState<VoucherDashboardFilters>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 29); // 30 days total including today

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
      period: "past30days",
    };
  });

  const { data, isLoading, error, refetch } = useVoucherDashboard(filters);

  const dashboardData = _.get(data, "content");

  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePeriodChange = (period: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let startDate: Date;
    let endDate: Date = new Date(today);

    switch (period) {
      case "today_or_yesterday":
        // Default to today for today_or_yesterday period
        startDate = new Date(today);
        endDate = new Date(today);
        break;
      case "past7days":
        // Exactly 7 days: today - 6 days to today (7 days total)
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
        break;
      case "past30days":
      default:
        // Exactly 30 days: today - 29 days to today (30 days total)
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 29);
        break;
    }

    setFilters({
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      period: period as VoucherDashboardFilters["period"],
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Không thể tải dữ liệu dashboard. Vui lòng thử lại.
            </div>
            <div className="text-center mt-4">
              <Button onClick={() => refetch()}>Thử lại</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Voucher Shop
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Thống kê tổng quan về chiến dịch voucher shop
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Bộ lọc thời gian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">Khoảng thời gian</Label>
              <Select value={filters.period} onValueChange={handlePeriodChange}>
                <SelectTrigger id="period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today_or_yesterday">
                    Hôm nay / Hôm qua
                  </SelectItem>
                  <SelectItem value="past7days">7 ngày qua</SelectItem>
                  <SelectItem value="past30days">30 ngày qua</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Từ ngày</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleDateChange("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Đến ngày</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleDateChange("endDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                onClick={() => refetch()}
                className="w-full"
                variant="outline"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <VoucherDashboardMetrics
        sales={dashboardData.sales}
        orders={dashboardData.orders}
        usageRate={dashboardData.usageRate}
        buyers={dashboardData.buyers}
      />

      {/* Charts */}
      <VoucherDashboardCharts
        sales={dashboardData.sales}
        orders={dashboardData.orders}
        usageRate={dashboardData.usageRate}
        buyers={dashboardData.buyers}
      />
    </div>
  );
}
