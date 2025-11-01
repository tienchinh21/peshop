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
import { VoucherTable } from "@/components/shop/table/voucherTable/VoucherTable";
import { VoucherListFilter } from "@/components/shop/VoucherListFilter";
import {
  useShopVouchers,
  useDeleteVoucher,
} from "@/hooks/shop/useShopVouchers";
import type {
  ShopVoucher,
  VoucherListFilters,
} from "@/types/shops/voucher.type";
import { PlusCircle, Ticket } from "lucide-react";
import { toast } from "sonner";
import _ from "lodash";

export default function VoucherListPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<VoucherListFilters>({
    page: 1,
    size: 10,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    voucher: ShopVoucher | null;
  }>({
    open: false,
    voucher: null,
  });

  const { data, isLoading, error } = useShopVouchers(filters);
  const deleteMutation = useDeleteVoucher();

  const vouchers = _.get(data, "content.response", []) as ShopVoucher[];
  const pagination = _.get(data, "content.info");
  const totalVouchers = _.get(pagination, "total", 0);

  React.useEffect(() => {
    console.log("Filters changed:", filters);
    console.log("Data:", data);
    console.log("Pagination:", pagination);
  }, [filters, data]);

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
