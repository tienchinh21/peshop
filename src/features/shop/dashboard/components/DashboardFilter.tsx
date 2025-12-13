"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { DashboardPeriod } from "../types";
interface DashboardFilterProps {
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
  isLoading?: boolean;
}
export const DashboardFilter: React.FC<DashboardFilterProps> = ({
  period,
  onPeriodChange,
  isLoading
}) => {
  return <div className="flex items-center space-x-4 mb-6">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Thời gian:</span>
        <Select value={period} onValueChange={value => onPeriodChange(value as DashboardPeriod)} disabled={isLoading}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn khoảng thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today_or_yesterday">Hôm nay</SelectItem>
            <SelectItem value="past7days">7 ngày qua</SelectItem>
            <SelectItem value="past30days">30 ngày qua</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>;
};