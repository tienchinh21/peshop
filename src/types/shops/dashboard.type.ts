export type DashboardPeriod = 'today_or_yesterday' | 'past7days' | 'past30days';

export interface DashboardParams {
  startDate: string; // yyyy-MM-dd
  endDate: string;   // yyyy-MM-dd
  period: DashboardPeriod;
}

export interface TimeSeriesPoint {
  time: string; // yyyy-MM-ddTHH:mm:ss
  value: string;
}

export interface DashboardMetric {
  value: number;
  oldValue: number;
  increment: number;
  changeRate: number;
  points: TimeSeriesPoint[];
}

export interface DashboardData {
  sales: DashboardMetric;
  visits: DashboardMetric;
  orders: DashboardMetric;
  ordersCancelled: DashboardMetric;
  productClicks: DashboardMetric;
  orderConversionRate: DashboardMetric;
  revenuePerOrder: DashboardMetric;
  cancellationSales: DashboardMetric;
}

export interface DashboardResponse {
  error: any;
  content: DashboardData;
}

export interface TodoListContent {
  waitingForDelivery: number;
  processed: number;
  returnsAndCancellations: number;
  productlocked: number;
}

export interface TodoListResponse {
  error: {
    message: string;
    exception: string;
  } | null;
  content: TodoListContent;
}
