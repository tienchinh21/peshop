import { axiosJava } from "@/lib/config/axios.config";
import { API_ENDPOINTS_JAVA } from "@/lib/config/api.config";
import { DashboardParams, DashboardResponse, TodoListResponse } from "@/types/shops/dashboard.type";
export const getDashboardStats = async (params: DashboardParams) => {
  const response = await axiosJava.get<DashboardResponse>(API_ENDPOINTS_JAVA.SHOPS.DASHBOARD, {
    params: {
      startDate: params.startDate,
      endDate: params.endDate,
      period: params.period
    }
  });
  return response.data;
};
export const getTodoList = async () => {
  const response = await axiosJava.get<TodoListResponse>(API_ENDPOINTS_JAVA.SHOPS.TODO_LIST);
  return response.data;
};