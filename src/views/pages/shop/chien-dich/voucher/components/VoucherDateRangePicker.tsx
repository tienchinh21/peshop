"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar } from "lucide-react";
import type { VoucherDashboardFilters } from "@/types/shops/voucher-dashboard.type";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { vi } from "date-fns/locale";
import _ from "lodash";

interface VoucherDateRangePickerProps {
  filters: VoucherDashboardFilters;
  onFiltersChange: (filters: VoucherDashboardFilters) => void;
}

export function VoucherDateRangePicker({
  filters,
  onFiltersChange,
}: VoucherDateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateRange = (start: string, end: string) => {
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const getDisplayText = () => {
    const { period, mode, startDate, endDate } = filters;
    const currentMode = mode || "day";

    if (currentMode === "month") {
      const start = new Date(startDate);
      return `Tháng ${start.getMonth() + 1}/${start.getFullYear()}`;
    }

    if (currentMode === "week") {
      return formatDateRange(startDate, endDate);
    }

    // Day mode
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const todayStr = today.toISOString().split("T")[0];
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (startDate === yesterdayStr && endDate === yesterdayStr) {
      return `Hôm qua ${formatDate(startDate)}`;
    }

    if (startDate === todayStr && endDate === todayStr) {
      return `Hôm nay ${formatDate(startDate)}`;
    }

    switch (period) {
      case "past7days":
        return `Trong 7 ngày qua ${formatDateRange(startDate, endDate)}`;
      case "past30days":
        return `Trong 30 ngày qua ${formatDateRange(startDate, endDate)}`;
      default:
        return formatDateRange(startDate, endDate);
    }
  };

  const handleQuickSelect = (
    period: VoucherDashboardFilters["period"],
    mode?: "day" | "week" | "month"
  ) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate: Date;
    let endDate: Date = new Date(today);
    let calculatedPeriod = period;

    if (mode === "month") {
      // Theo tháng: từ ngày 1 của tháng hiện tại đến ngày cuối tháng
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      calculatedPeriod = "past30days";
    } else if (mode === "week") {
      // Theo tuần: từ thứ 2 tuần này đến hôm nay
      const dayOfWeek = today.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(today);
      startDate.setDate(today.getDate() - diffToMonday);
      calculatedPeriod = "past7days";
    } else {
      // Theo ngày
      switch (period) {
        case "today_or_yesterday":
          // Không set date range ở đây, sẽ được xử lý riêng cho "Hôm nay" và "Hôm qua"
          startDate = new Date(today);
          break;
        case "past7days":
          // 7 ngày qua: từ 6 ngày trước đến hôm nay (tổng 7 ngày)
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 6);
          break;
        case "past30days":
        default:
          // 30 ngày qua: từ 29 ngày trước đến hôm nay (tổng 30 ngày)
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 29);
          break;
      }
    }

    onFiltersChange({
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      period: calculatedPeriod,
      mode: mode || "day",
    });
    setIsOpen(false);
  };

  const handleModeSelect = (mode: "day" | "week" | "month") => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate: Date;
    let endDate: Date = new Date(today);
    let period: VoucherDashboardFilters["period"] = filters.period;

    if (mode === "month") {
      // Theo tháng: từ ngày 1 của tháng hiện tại đến ngày cuối tháng
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      period = "past30days";
    } else if (mode === "week") {
      // Theo tuần: từ thứ 2 tuần này đến hôm nay
      const dayOfWeek = today.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(today);
      startDate.setDate(today.getDate() - diffToMonday);
      period = "past7days";
    } else {
      // Theo ngày: giữ nguyên period hiện tại hoặc mặc định là past30days
      const currentPeriod = period || "past30days";

      if (currentPeriod === "past7days") {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
      } else if (currentPeriod === "past30days") {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 29);
      } else {
        // today_or_yesterday - giữ nguyên startDate hiện tại nếu có
        startDate = filters.startDate
          ? new Date(filters.startDate)
          : new Date(today);
      }

      period = currentPeriod;
    }

    onFiltersChange({
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      period,
      mode,
    });
    setIsOpen(false);
  };

  const isSelected = (
    period?: VoucherDashboardFilters["period"],
    mode?: "day" | "week" | "month"
  ) => {
    const currentMode = filters.mode || "day";
    if (mode) {
      return currentMode === mode;
    }
    if (period) {
      return filters.period === period && currentMode === "day";
    }
    return false;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-left font-normal"
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{getDisplayText()}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 p-0">
        <div className="p-2">
          {/* Quick Select Options */}
          <div className="space-y-1">
            <DropdownMenuItem
              className="flex items-center justify-between cursor-pointer"
              onClick={() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayStr = today.toISOString().split("T")[0];
                onFiltersChange({
                  startDate: todayStr,
                  endDate: todayStr,
                  period: "today_or_yesterday",
                  mode: "day",
                });
                setIsOpen(false);
              }}
            >
              <span
                className={
                  (() => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const todayStr = today.toISOString().split("T")[0];
                    return (
                      filters.mode === "day" &&
                      filters.startDate === todayStr &&
                      filters.endDate === todayStr
                    );
                  })()
                    ? "font-semibold text-red-600"
                    : ""
                }
              >
                Hôm nay
              </span>
              {(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayStr = today.toISOString().split("T")[0];
                return (
                  filters.mode === "day" &&
                  filters.startDate === todayStr &&
                  filters.endDate === todayStr
                );
              })() && (
                <span className="text-red-600 text-sm">
                  {formatDate(filters.startDate)}
                </span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center justify-between cursor-pointer"
              onClick={() => {
                const yesterday = new Date();
                yesterday.setHours(0, 0, 0, 0);
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split("T")[0];
                onFiltersChange({
                  startDate: yesterdayStr,
                  endDate: yesterdayStr,
                  period: "today_or_yesterday",
                  mode: "day",
                });
                setIsOpen(false);
              }}
            >
              <span
                className={
                  (() => {
                    const yesterday = new Date();
                    yesterday.setHours(0, 0, 0, 0);
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayStr = yesterday.toISOString().split("T")[0];
                    return (
                      filters.mode === "day" &&
                      filters.startDate === yesterdayStr &&
                      filters.endDate === yesterdayStr
                    );
                  })()
                    ? "font-semibold text-red-600"
                    : ""
                }
              >
                Hôm qua
              </span>
              {(() => {
                const yesterday = new Date();
                yesterday.setHours(0, 0, 0, 0);
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split("T")[0];
                return (
                  filters.mode === "day" &&
                  filters.startDate === yesterdayStr &&
                  filters.endDate === yesterdayStr
                );
              })() && (
                <span className="text-red-600 text-sm">
                  {formatDate(filters.startDate)}
                </span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleQuickSelect("past7days")}
            >
              <span
                className={
                  isSelected("past7days") ? "font-semibold text-red-600" : ""
                }
              >
                Trong 7 ngày qua
              </span>
              {isSelected("past7days") && (
                <span className="text-red-600 text-sm">
                  {formatDateRange(filters.startDate, filters.endDate)}
                </span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleQuickSelect("past30days")}
            >
              <span
                className={
                  isSelected("past30days") ? "font-semibold text-red-600" : ""
                }
              >
                Trong 30 ngày qua
              </span>
              {isSelected("past30days") && (
                <span className="text-red-600 text-sm">
                  {formatDateRange(filters.startDate, filters.endDate)}
                </span>
              )}
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator className="my-2" />

          {/* Mode Selection with SubMenus */}
          <div className="space-y-1">
            {/* Theo ngày */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <span
                  className={
                    isSelected(undefined, "day")
                      ? "font-semibold text-red-600"
                      : ""
                  }
                >
                  Theo ngày
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0" sideOffset={8}>
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={(range: any) => {
                    if (range?.from && range?.to) {
                      setDateRange(range);
                      onFiltersChange({
                        startDate: format(range.from, "yyyy-MM-dd"),
                        endDate: format(range.to, "yyyy-MM-dd"),
                        period: "past7days",
                        mode: "day",
                      });
                      setIsOpen(false);
                    } else if (range?.from) {
                      setDateRange(range);
                    }
                  }}
                  numberOfMonths={2}
                  locale={vi}
                />
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Theo tuần */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <span
                  className={
                    isSelected(undefined, "week")
                      ? "font-semibold text-red-600"
                      : ""
                  }
                >
                  Theo tuần
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0" sideOffset={8}>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date: Date | undefined) => {
                    if (date) {
                      setSelectedDate(date);
                      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
                      const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
                      onFiltersChange({
                        startDate: format(weekStart, "yyyy-MM-dd"),
                        endDate: format(weekEnd, "yyyy-MM-dd"),
                        period: "past7days",
                        mode: "week",
                      });
                      setIsOpen(false);
                    }
                  }}
                  locale={vi}
                />
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Theo tháng */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <span
                  className={
                    isSelected(undefined, "month")
                      ? "font-semibold text-red-600"
                      : ""
                  }
                >
                  Theo tháng
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0" sideOffset={8}>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date: Date | undefined) => {
                    if (date) {
                      setSelectedDate(date);
                      const monthStart = startOfMonth(date);
                      const monthEnd = endOfMonth(date);
                      onFiltersChange({
                        startDate: format(monthStart, "yyyy-MM-dd"),
                        endDate: format(monthEnd, "yyyy-MM-dd"),
                        period: "past30days",
                        mode: "month",
                      });
                      setIsOpen(false);
                    }
                  }}
                  locale={vi}
                />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
