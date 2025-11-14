"use client";

import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MetricData } from "@/types/shops/voucher-dashboard.type";

interface ChartCardProps {
  title: string;
  data: MetricData;
  formatValue?: (value: number) => string;
  chartType?: "line" | "area" | "bar";
  color?: string;
}

function formatDateLabel(dateString: string, period: string): string {
  const date = new Date(dateString);

  if (period === "today_or_yesterday") {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function ChartCard({
  title,
  data,
  formatValue,
  chartType = "area",
  color = "#3b82f6",
}: ChartCardProps) {
  const chartData = data.points.map((point) => ({
    time: formatDateLabel(point.time, "past30days"), // Default, can be dynamic
    value: point.value,
    date: point.time,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-medium mb-1">{label}</p>
          <p className="text-sm text-gray-600">
            Giá trị:{" "}
            <span className="font-semibold">
              {formatValue
                ? formatValue(payload[0].value)
                : payload[0].value.toLocaleString("vi-VN")}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) =>
                formatValue ? formatValue(value) : value.toLocaleString("vi-VN")
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        );
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) =>
                formatValue ? formatValue(value) : value.toLocaleString("vi-VN")
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      default: // area
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient
                id={`gradient-${title}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) =>
                formatValue ? formatValue(value) : value.toLocaleString("vi-VN")
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${title})`}
            />
          </AreaChart>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface VoucherDashboardChartsProps {
  sales: MetricData;
  orders: MetricData;
  usageRate: MetricData;
  buyers: MetricData;
}

export function VoucherDashboardCharts({
  sales,
  orders,
  usageRate,
  buyers,
}: VoucherDashboardChartsProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const formatNumber = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <ChartCard
        title="Doanh thu theo thời gian"
        data={sales}
        formatValue={formatCurrency}
        chartType="area"
        color="#10b981"
      />
      <ChartCard
        title="Số đơn hàng theo thời gian"
        data={orders}
        formatValue={formatNumber}
        chartType="bar"
        color="#3b82f6"
      />
      <ChartCard
        title="Tỷ lệ sử dụng theo thời gian"
        data={usageRate}
        formatValue={(value) => `${value}%`}
        chartType="line"
        color="#8b5cf6"
      />
      <ChartCard
        title="Người mua theo thời gian"
        data={buyers}
        formatValue={formatNumber}
        chartType="area"
        color="#f97316"
      />
    </div>
  );
}
