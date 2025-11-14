"use client";

import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VoucherShopDashboardData } from "@/types/shops/voucher-dashboard.type";

interface VoucherDashboardChartProps {
  data: VoucherShopDashboardData;
  mode?: "day" | "week" | "month";
}

function formatDateLabel(
  dateString: string,
  mode: "day" | "week" | "month" = "day"
): string {
  const date = new Date(dateString);

  if (mode === "month") {
    return date.toLocaleDateString("vi-VN", {
      month: "short",
      year: "numeric",
    });
  }

  if (mode === "week") {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay() + 1); // Monday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Sunday

    return `${weekStart.getDate()}/${
      weekStart.getMonth() + 1
    } - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`;
  }

  // day mode
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function VoucherDashboardChart({
  data,
  mode = "day",
}: VoucherDashboardChartProps) {
  // Combine all metrics into one chart
  const chartData = data.sales.points.map((point, index) => {
    const ordersPoint = data.orders.points[index];
    const usageRatePoint = data.usageRate.points[index];
    const buyersPoint = data.buyers.points[index];

    return {
      time: formatDateLabel(point.time, mode),
      date: point.time,
      DoanhThu: point.value,
      DonHang: ordersPoint?.value || 0,
      TyLeSuDung: usageRatePoint?.value || 0,
      NguoiMua: buyersPoint?.value || 0,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              <span className="font-semibold">
                {entry.name === "DoanhThu"
                  ? new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(entry.value)
                  : entry.name === "TyLeSuDung"
                  ? `${entry.value.toFixed(1)}%`
                  : entry.value.toLocaleString("vi-VN")}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Biểu đồ tổng hợp
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorDoanhThu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDonHang" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNguoiMua" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              yAxisId="left"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`;
                }
                if (value >= 1000) {
                  return `${(value / 1000).toFixed(1)}K`;
                }
                return value.toString();
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="DoanhThu"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorDoanhThu)"
              name="Doanh thu"
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="DonHang"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorDonHang)"
              name="Đơn hàng"
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="NguoiMua"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#colorNguoiMua)"
              name="Người mua"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="TyLeSuDung"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: "#8b5cf6", r: 3 }}
              name="Tỷ lệ sử dụng (%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
