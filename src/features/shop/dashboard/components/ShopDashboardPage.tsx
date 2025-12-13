"use client";

import React, { useEffect, useState } from "react";
import { DashboardFilter } from "./DashboardFilter";
import { DashboardStats } from "./DashboardStats";
import { DashboardCharts } from "./DashboardCharts";
import { TodoList } from "./TodoList";
import { DashboardPageSkeleton } from "@/shared/components/skeleton";
import { getDashboardStats, getTodoList } from "../services";
import { DashboardData, DashboardPeriod, TodoListContent } from "../types";
import { subDays, format } from "date-fns";
import { toast } from "sonner";
const ShopDashboardPage: React.FC = () => {
  const [period, setPeriod] = useState<DashboardPeriod>("past7days");
  const [data, setData] = useState<DashboardData | null>(null);
  const [todoData, setTodoData] = useState<TodoListContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTodoLoading, setIsTodoLoading] = useState(true);
  const calculateDateRange = (period: DashboardPeriod) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();
    switch (period) {
      case "today_or_yesterday":
        start = today;
        end = today;
        break;
      case "past7days":
        start = subDays(today, 6);
        end = today;
        break;
      case "past30days":
        start = subDays(today, 29);
        end = today;
        break;
    }
    return {
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd")
    };
  };
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const {
        startDate,
        endDate
      } = calculateDateRange(period);
      const response = await getDashboardStats({
        startDate,
        endDate,
        period
      });
      if (response.content) {
        setData(response.content);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      toast.error("Không thể tải dữ liệu thống kê");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchTodoList = async () => {
    setIsTodoLoading(true);
    try {
      const response = await getTodoList();
      if (response.content) {
        setTodoData(response.content);
      }
    } catch (error) {
      console.error("Failed to fetch todo list:", error);
      toast.error("Không thể tải danh sách công việc");
    } finally {
      setIsTodoLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [period]);
  useEffect(() => {
    fetchTodoList();
  }, []);
  const isAnyLoading = isLoading || isTodoLoading;
  if (isAnyLoading) {
    return <DashboardPageSkeleton />;
  }
  return <div className="max-w-7xl mx-auto">
      {}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Shop
        </h1>
        <p className="text-gray-600">Quản lý cửa hàng của bạn</p>
      </div>

      {}
      <DashboardFilter period={period} onPeriodChange={setPeriod} isLoading={isLoading} />

      {}
      {todoData && <TodoList data={todoData} />}

      {}
      {data ? <>
          <DashboardStats data={data} />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <DashboardCharts data={data} period={period} />
          </div>
        </> : <div className="text-center py-12 text-gray-500">Không có dữ liệu</div>}
    </div>;
};
export default ShopDashboardPage;