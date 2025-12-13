"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { DashboardData, DashboardMetric } from "../types";
import { ArrowDownIcon, ArrowUpIcon, DollarSign, ShoppingBag, Users, MousePointer, AlertCircle, Percent } from "lucide-react";
interface DashboardStatsProps {
  data: DashboardData;
}
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(value);
};
const formatNumber = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};
interface StatCardProps {
  title: string;
  metric: DashboardMetric;
  icon: React.ReactNode;
  isCurrency?: boolean;
  isPercentage?: boolean;
}
const StatCard: React.FC<StatCardProps> = ({
  title,
  metric,
  icon,
  isCurrency,
  isPercentage
}) => {
  const isPositive = metric.changeRate >= 0;
  return <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-gray-500">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isCurrency ? formatCurrency(metric.value) : isPercentage ? `${metric.value.toFixed(2)}%` : formatNumber(metric.value)}
        </div>
        <div className="flex items-center text-xs mt-1">
          <span className={`flex items-center ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
            {Math.abs(metric.changeRate).toFixed(2)}%
          </span>
          <span className="text-gray-500 ml-2">so với kỳ trước</span>
        </div>
      </CardContent>
    </Card>;
};
export const DashboardStats: React.FC<DashboardStatsProps> = ({
  data
}) => {
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard title="Doanh thu" metric={data.sales} icon={<DollarSign />} isCurrency />
      <StatCard title="Đơn hàng" metric={data.orders} icon={<ShoppingBag />} />
      <StatCard title="Lượt truy cập" metric={data.visits} icon={<Users />} />
      <StatCard title="Tỷ lệ chuyển đổi" metric={data.orderConversionRate} icon={<Percent />} isPercentage />
      <StatCard title="Lượt click sản phẩm" metric={data.productClicks} icon={<MousePointer />} />
      <StatCard title="Đơn hàng bị hủy" metric={data.ordersCancelled} icon={<AlertCircle />} />
      <StatCard title="Doanh thu/Đơn" metric={data.revenuePerOrder} icon={<DollarSign />} isCurrency />
      <StatCard title="Doanh thu hủy" metric={data.cancellationSales} icon={<DollarSign />} isCurrency />
    </div>;
};