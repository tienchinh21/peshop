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
import { PromotionTable } from "./table/PromotionTable";
import { PromotionListFilter } from "./PromotionListFilter";
import type { Promotion, PromotionListFilters } from "../types";
import { PlusCircle, Gift } from "lucide-react";
import _ from "lodash";
import { useShopPromotions, useDeletePromotion } from "../hooks";

export default function PromotionListPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<PromotionListFilters>({
    page: 1,
    size: 10,
  });

  const { data, isLoading } = useShopPromotions(filters);
  const deleteMutation = useDeletePromotion();

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    promotion: Promotion | null;
  }>({
    open: false,
    promotion: null,
  });

  const handleFiltersChange = (newFilters: PromotionListFilters) => {
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
    setFilters(newFilters);
  };

  const handlePageSizeChange = (size: number) => {
    const newFilters = _.assign({}, filters, { size, page: 1 });
    setFilters(newFilters);
  };

  const handleView = (promotion: Promotion) => {
    sessionStorage.setItem(
      `promotion_${promotion.id}`,
      JSON.stringify(promotion)
    );
    router.push(`/shop/chien-dich/muaXtangY/${promotion.id}`);
  };

  const handleEdit = (promotion: Promotion) => {
    sessionStorage.setItem(
      `promotion_${promotion.id}`,
      JSON.stringify(promotion)
    );
    router.push(`/shop/chien-dich/muaXtangY/sua/${promotion.id}`);
  };

  const handleDelete = (promotion: Promotion) => {
    setDeleteDialog({ open: true, promotion });
  };

  const handleAddPromotion = () => {
    router.push("/shop/chien-dich/muaXtangY/them");
  };

  const handleConfirmDelete = async () => {
    const promotionToDelete = _.get(deleteDialog, "promotion");
    if (_.isNil(promotionToDelete)) return;

    try {
      await deleteMutation.mutateAsync(promotionToDelete.id);
      setDeleteDialog({ open: false, promotion: null });
    } catch (error) {
      setDeleteDialog({ open: false, promotion: null });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý Mua X Tặng Y
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý các chương trình khuyến mãi mua X tặng Y của shop
          </p>
        </div>
        <Button onClick={handleAddPromotion} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Tạo chương trình
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Danh sách chương trình ({_.get(data, "content.info.total", 0)})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PromotionListFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />

          <div className="mt-6">
            <PromotionTable
              promotions={_.get(data, "content.response", [])}
              pagination={_.get(data, "content.info")}
              isLoading={isLoading}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, promotion: deleteDialog.promotion })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa chương trình</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa chương trình{" "}
              <span className="font-semibold">
                {_.get(deleteDialog, "promotion.name")}
              </span>
              ? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, promotion: null })}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
