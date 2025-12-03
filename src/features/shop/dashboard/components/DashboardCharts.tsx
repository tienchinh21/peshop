"use client";

import React, { useState, useMemo } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { DashboardData, DashboardPeriod, TimeSeriesPoint } from "../types";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

interface DashboardChartsProps {
  data: DashboardData;
  period: DashboardPeriod;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  data,
  period,
}) => {
  const [activeTab, setActiveTab] = useState<keyof DashboardData>("sales");

  const chartData = useMemo(() => {
    const metric = data[activeTab];
    if (!metric || !metric.points) return [];

    return metric.points.map((point: TimeSeriesPoint) => ({
      time: point.time,
      value: parseFloat(point.value),
      formattedTime: format(
        parseISO(point.time),
        period === "today_or_yesterday" ? "HH:mm" : "dd/MM",
        { locale: vi }
      ),
    }));
  }, [data, activeTab, period]);

  const getLabel = (key: keyof DashboardData) => {
    switch (key) {
      case "sales":
        return "Doanh thu";
      case "visits":
        return "Lượt truy cập";
      case "orders":
        return "Đơn hàng";
      case "ordersCancelled":
        return "Đơn hủy";
      case "productClicks":
        return "Lượt click";
      case "orderConversionRate":
        return "Tỷ lệ chuyển đổi";
      case "revenuePerOrder":
        return "Doanh thu/Đơn";
      case "cancellationSales":
        return "Doanh thu hủy";
      default:
        return key;
    }
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Biểu đồ thống kê</CardTitle>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as keyof DashboardData)}
          >
            <TabsList>
              <TabsTrigger value="sales">Doanh thu</TabsTrigger>
              <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
              <TabsTrigger value="visits">Truy cập</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="formattedTime"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={30}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  activeTab === "sales" ||
                  activeTab === "revenuePerOrder" ||
                  activeTab === "cancellationSales"
                    ? new Intl.NumberFormat("vi-VN", {
                        notation: "compact",
                      }).format(value)
                    : value
                }
              />
              <Tooltip
                formatter={(value: number) => [
                  activeTab === "sales" ||
                  activeTab === "revenuePerOrder" ||
                  activeTab === "cancellationSales"
                    ? new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(value)
                    : activeTab === "orderConversionRate"
                    ? `${value.toFixed(2)}%`
                    : value,
                  getLabel(activeTab),
                ]}
                labelFormatter={(label) => `Thời gian: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
