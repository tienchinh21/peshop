"use client";

import { useState, useEffect, useCallback } from "react";
import { subDays, format } from "date-fns";
import { toast } from "sonner";
import { getDashboardStats, getTodoList } from "../services";
import {
  DashboardData,
  DashboardPeriod,
  TodoListContent,
} from "../types";

/**
 * Custom hook for managing dashboard data and state
 */
export const useDashboard = (initialPeriod: DashboardPeriod = "past7days") => {
  const [period, setPeriod] = useState<DashboardPeriod>(initialPeriod);
  const [data, setData] = useState<DashboardData | null>(null);
  const [todoData, setTodoData] = useState<TodoListContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTodoLoading, setIsTodoLoading] = useState(true);

  const calculateDateRange = useCallback((period: DashboardPeriod) => {
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
      endDate: format(end, "yyyy-MM-dd"),
    };
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { startDate, endDate } = calculateDateRange(period);
      const response = await getDashboardStats({
        startDate,
        endDate,
        period,
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
  }, [period, calculateDateRange]);

  const fetchTodoList = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchTodoList();
  }, [fetchTodoList]);

  return {
    period,
    setPeriod,
    data,
    todoData,
    isLoading,
    isTodoLoading,
    isAnyLoading: isLoading || isTodoLoading,
    refetchData: fetchData,
    refetchTodoList: fetchTodoList,
  };
};
