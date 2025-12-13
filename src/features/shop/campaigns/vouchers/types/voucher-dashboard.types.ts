export interface TimeSeriesPoint {
  time: string;
  value: number;
}
export interface MetricData {
  value: number;
  oldValue: number;
  increment: number;
  changeRate: number;
  points: TimeSeriesPoint[];
}
export interface VoucherShopDashboardData {
  sales: MetricData;
  orders: MetricData;
  usageRate: MetricData;
  buyers: MetricData;
}
export interface VoucherShopDashboardResponse {
  error: string | null;
  content: VoucherShopDashboardData;
}
export interface VoucherDashboardFilters {
  startDate: string;
  endDate: string;
  period: "today_or_yesterday" | "past7days" | "past30days";
  mode?: "day" | "week" | "month";
}