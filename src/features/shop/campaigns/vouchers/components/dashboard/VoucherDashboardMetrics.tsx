"use client";

import React from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { MetricData } from "../../types";
interface MetricCardProps {
  title: string;
  data: MetricData;
  formatValue: (value: number) => string;
  icon?: React.ReactNode;
  color?: string;
}
export function MetricCard({
  title,
  data,
  formatValue,
  icon,
  color = "text-blue-600"
}: MetricCardProps) {
  const {
    value,
    oldValue,
    increment,
    changeRate
  } = data;
  const isPositive = increment >= 0;
  const hasChange = oldValue !== 0;
  return <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className={`text-3xl font-bold ${color} mb-2`}>
              {formatValue(value)}
            </p>
            {hasChange && <div className="flex items-center gap-2">
                {isPositive ? <TrendingUp className="h-4 w-4 text-green-600" /> : increment < 0 ? <TrendingDown className="h-4 w-4 text-red-600" /> : <Minus className="h-4 w-4 text-gray-400" />}
                <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                  {isPositive ? "+" : ""}
                  {changeRate.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">so với kỳ trước</span>
              </div>}
            {!hasChange && <p className="text-sm text-gray-500">Chưa có dữ liệu kỳ trước</p>}
          </div>
          {icon && <div className="ml-4">{icon}</div>}
        </div>
      </CardContent>
    </Card>;
}
interface VoucherDashboardMetricsProps {
  sales: MetricData;
  orders: MetricData;
  usageRate: MetricData;
  buyers: MetricData;
}
export function VoucherDashboardMetrics({
  sales,
  orders,
  usageRate,
  buyers
}: VoucherDashboardMetricsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(value);
  };
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard title="Doanh thu" data={sales} formatValue={formatCurrency} color="text-green-600" icon={<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-2xl">₫</span>
          </div>} />
      <MetricCard title="Số đơn hàng" data={orders} formatValue={formatNumber} color="text-blue-600" icon={<div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>} />
      <MetricCard title="Tỷ lệ sử dụng" data={usageRate} formatValue={formatPercentage} color="text-purple-600" icon={<div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-2xl">%</span>
          </div>} />
      <MetricCard title="Người mua" data={buyers} formatValue={formatNumber} color="text-orange-600" icon={<div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>} />
    </div>;
}