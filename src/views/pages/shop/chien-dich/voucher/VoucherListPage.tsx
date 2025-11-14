"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VoucherTable } from "@/components/shop/table/voucherTable/VoucherTable";
import { VoucherListFilter } from "@/components/shop/VoucherListFilter";
import { VoucherDashboardMetrics } from "./components/VoucherDashboardMetrics";
import { VoucherDashboardChart } from "./components/VoucherDashboardChart";
import { VoucherDateRangePicker } from "./components/VoucherDateRangePicker";
import {
  useShopVouchers,
  useDeleteVoucher,
} from "@/hooks/shop/useShopVouchers";
import { useVoucherDashboard } from "@/hooks/shop/useVoucherDashboard";
import type {
  ShopVoucher,
  VoucherListFilters,
} from "@/types/shops/voucher.type";
import type { VoucherDashboardFilters } from "@/types/shops/voucher-dashboard.type";
import { PlusCircle, Ticket, BarChart3, List } from "lucide-react";
import { toast } from "sonner";
import _ from "lodash";

export default function VoucherListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"list" | "dashboard">("list");
  const [filters, setFilters] = useState<VoucherListFilters>({
    page: 1,
    size: 10,
  });

  // Helper function to get date range for period and mode
  const getDateRangeForPeriod = (
    period: VoucherDashboardFilters["period"],
    mode?: "day" | "week" | "month"
  ) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    let startDate: Date;
    let endDate: Date = new Date(today);

    if (mode === "month") {
      // Tháng hiện tại: từ ngày 1 đến ngày cuối của tháng
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (mode === "week") {
      // Tuần hiện tại: từ thứ 2 đến hôm nay
      const dayOfWeek = today.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 = Sunday
      startDate = new Date(today);
      startDate.setDate(today.getDate() - diffToMonday);
      // Set period to past7days when week mode is selected
      period = "past7days";
    } else {
      // Day mode - use period
      switch (period) {
        case "today_or_yesterday":
          // Default to today for today_or_yesterday period
          startDate = new Date(today);
          endDate = new Date(today);
          break;
        case "past7days":
          // Exactly 7 days: today - 6 days to today (7 days total)
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 6);
          break;
        case "past30days":
        default:
          // Exactly 30 days: today - 29 days to today (30 days total)
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 29);
          break;
      }
    }

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      period,
    };
  };

  const [dashboardFilters, setDashboardFilters] =
    useState<VoucherDashboardFilters>(() => {
      const { startDate, endDate, period } = getDateRangeForPeriod(
        "past30days",
        "day"
      );
      return {
        startDate,
        endDate,
        period,
        mode: "day",
      };
    });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    voucher: ShopVoucher | null;
  }>({
    open: false,
    voucher: null,
  });

  const { data, isLoading, error } = useShopVouchers(filters);
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useVoucherDashboard(dashboardFilters);
  const deleteMutation = useDeleteVoucher();

  const vouchers = _.get(data, "content.response", []) as ShopVoucher[];
  const pagination = _.get(data, "content.info");
  const totalVouchers = _.get(pagination, "total", 0);
  const dashboard = _.get(dashboardData, "content");

  React.useEffect(() => {
    console.log("Filters changed:", filters);
    console.log("Data:", data);
    console.log("Pagination:", pagination);
  }, [filters, data]);

  const handleDashboardPeriodChange = (period: string) => {
    const periodType = period as VoucherDashboardFilters["period"];
    const currentMode = dashboardFilters.mode || "day";
    const {
      startDate,
      endDate,
      period: calculatedPeriod,
    } = getDateRangeForPeriod(periodType, currentMode);

    setDashboardFilters({
      startDate,
      endDate,
      period: calculatedPeriod,
      mode: currentMode,
    });
  };

  const handleDashboardModeChange = (mode: "day" | "week" | "month") => {
    const currentPeriod = dashboardFilters.period;
    const { startDate, endDate, period } = getDateRangeForPeriod(
      currentPeriod,
      mode
    );

    setDashboardFilters({
      startDate,
      endDate,
      period,
      mode,
    });
  };

  const handleFiltersChange = (newFilters: VoucherListFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      size: _.get(filters, "size", 10),
    });
  };

  const handlePageChange = (page: number) => {
    const newFilters = _.assign({}, filters, { page });
    console.log("Page change:", { from: filters.page, to: page, newFilters });
    setFilters(newFilters);
  };

  const handlePageSizeChange = (size: number) => {
    const newFilters = _.assign({}, filters, { size, page: 1 });
    console.log("Page size change:", {
      from: filters.size,
      to: size,
      newFilters,
    });
    setFilters(newFilters);
  };

  const handleView = (voucher: ShopVoucher) => {
    router.push(`/shop/chien-dich/ma-giam-gia/${voucher.id}`);
  };

  const handleEdit = (voucher: ShopVoucher) => {
    router.push(`/shop/chien-dich/ma-giam-gia/sua/${voucher.id}`);
  };

  const handleDelete = (voucher: ShopVoucher) => {
    setDeleteDialog({ open: true, voucher });
  };

  const handleAddVoucher = () => {
    router.push("/shop/chien-dich/ma-giam-gia/them");
  };

  const handleConfirmDelete = async () => {
    const voucherToDelete = _.get(deleteDialog, "voucher");
    if (_.isNil(voucherToDelete)) return;

    try {
      await deleteMutation.mutateAsync(voucherToDelete.id);
      setDeleteDialog({ open: false, voucher: null });
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý mã giảm giá
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý các mã giảm giá của shop
          </p>
        </div>
        <Button onClick={handleAddVoucher} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Tạo mã giảm giá
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "list" | "dashboard")}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            Danh sách
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Danh sách mã giảm giá ({totalVouchers})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VoucherListFilter
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={handleResetFilters}
              />

              <div className="mt-6">
                <VoucherTable
                  vouchers={vouchers}
                  pagination={pagination}
                  isLoading={isLoading}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>

              {!_.isNil(error) && (
                <div className="rounded-md bg-red-50 p-4 text-center">
                  <p className="text-sm text-red-800">
                    {_.get(
                      error,
                      "message",
                      "Có lỗi xảy ra khi tải danh sách mã giảm giá. Vui lòng thử lại."
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="mt-6">
          {isDashboardLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  Đang tải dữ liệu dashboard...
                </div>
              </CardContent>
            </Card>
          ) : dashboardError || !dashboard ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-red-600">
                  Không thể tải dữ liệu dashboard. Vui lòng thử lại.
                </div>
                <div className="text-center mt-4">
                  <Button onClick={() => refetchDashboard()}>Thử lại</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Dashboard Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Bộ lọc thời gian
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">
                        Khung Thời Gian
                      </label>
                      <VoucherDateRangePicker
                        filters={dashboardFilters}
                        onFiltersChange={setDashboardFilters}
                      />
                    </div>
                    <div className="pt-6">
                      <Button
                        onClick={() => refetchDashboard()}
                        variant="outline"
                      >
                        Làm mới
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics */}
              <VoucherDashboardMetrics
                sales={dashboard.sales}
                orders={dashboard.orders}
                usageRate={dashboard.usageRate}
                buyers={dashboard.buyers}
              />

              {/* Chart */}
              <VoucherDashboardChart
                data={dashboard}
                mode={dashboardFilters.mode || "day"}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, voucher: deleteDialog.voucher })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa mã giảm giá</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa mã giảm giá{" "}
              <span className="font-semibold">
                {_.get(deleteDialog, "voucher.name")}
              </span>
              ? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, voucher: null })}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
