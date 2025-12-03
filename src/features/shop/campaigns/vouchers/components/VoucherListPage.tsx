"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { VoucherTable } from "./table/VoucherTable";
import { VoucherListFilter } from "./VoucherListFilter";
import { VoucherDashboardSection } from "./VoucherDashboardSection";
import { useShopVouchers, useDeleteVoucher } from "../hooks";
import type {
  ShopVoucher,
  VoucherListFilters,
  VoucherDashboardFilters,
} from "../types";
import { PlusCircle, Ticket } from "lucide-react";
import _ from "lodash";

export default function VoucherListPage() {
  const router = useRouter();

  // List Filters
  const [filters, setFilters] = useState<VoucherListFilters>({
    page: 1,
    size: 10,
  });

  // Dashboard Filters Helper
  const getDateRangeForPeriod = (
    period: VoucherDashboardFilters["period"],
    mode?: "day" | "week" | "month"
  ) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate: Date;
    let endDate: Date = new Date(today);

    if (mode === "month") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (mode === "week") {
      const dayOfWeek = today.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(today);
      startDate.setDate(today.getDate() - diffToMonday);
      period = "past7days";
    } else {
      switch (period) {
        case "today_or_yesterday":
          startDate = new Date(today);
          endDate = new Date(today);
          break;
        case "past7days":
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 6);
          break;
        case "past30days":
        default:
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

  // Dashboard Filters State
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

  // Queries
  const { data, isLoading, error } = useShopVouchers(filters);
  const deleteMutation = useDeleteVoucher();

  const vouchers = _.get(data, "content.response", []) as ShopVoucher[];
  const pagination = _.get(data, "content.info");
  const totalVouchers = _.get(pagination, "total", 0);

  // Handlers
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
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setFilters((prev) => ({ ...prev, size, page: 1 }));
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
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý mã giảm giá
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi hiệu quả và quản lý các mã giảm giá của shop
          </p>
        </div>
        <Button onClick={handleAddVoucher} className="gap-2 shadow-sm">
          <PlusCircle className="h-4 w-4" />
          Tạo mã giảm giá
        </Button>
      </div>

      {/* Dashboard Section */}
      <section>
        <VoucherDashboardSection
          filters={dashboardFilters}
          onFiltersChange={setDashboardFilters}
        />
      </section>

      {/* List Section */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-primary" />
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
              <div className="mt-4 rounded-md bg-red-50 p-4 text-center">
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
      </section>

      {/* Delete Dialog */}
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
              <span className="font-semibold text-gray-900">
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
