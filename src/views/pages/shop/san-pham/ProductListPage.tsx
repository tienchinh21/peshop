"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/components/shop/table";
import { ProductListFilter } from "@/components/shop/ProductListFilter";
import {
  useShopProducts,
  useDeleteProduct,
} from "@/hooks/shop/useShopProducts";
import type {
  ShopProduct,
  ProductListFilters,
} from "@/types/shops/product-list.type";
import { PlusCircle, Package } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import _ from "lodash";

export default function ProductListPage() {
  const router = useRouter();

  const [filters, setFilters] = useState<ProductListFilters>({
    page: 1,
    size: 10,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    product: ShopProduct | null;
  }>({
    open: false,
    product: null,
  });

  const { data, isLoading, error } = useShopProducts(filters);

  const deleteMutation = useDeleteProduct();

  const products = _.get(data, "content.response", []) as ShopProduct[];
  const pagination = _.get(data, "content.info");
  const totalProducts = _.get(pagination, "total", 0);

  // Debug: Log when data changes
  React.useEffect(() => {
    console.log("Filters changed:", filters);
    console.log("Data:", data);
    console.log("Pagination:", pagination);
  }, [filters, data]);

  // Handlers
  const handleFiltersChange = (newFilters: ProductListFilters) => {
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

  const handleEdit = (product: ShopProduct) => {
    router.push(`/shop/san-pham/sua/${product.id}`);
  };

  const handleDelete = (product: ShopProduct) => {
    setDeleteDialog({ open: true, product });
  };

  const handleConfirmDelete = async () => {
    const productToDelete = _.get(deleteDialog, "product");
    if (_.isNil(productToDelete)) return;

    try {
      await deleteMutation.mutateAsync(productToDelete.id);
      setDeleteDialog({ open: false, product: null });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleView = (product: ShopProduct) => {
    router.push(`/shop/san-pham/${product.id}`);
  };

  const handleDuplicate = (product: ShopProduct) => {
    toast.info("Tính năng nhân bản sản phẩm đang được phát triển");
    // TODO: Implement duplicate functionality
  };

  const handleAddProduct = () => {
    router.push("/shop/san-pham/them");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý danh sách sản phẩm của shop
          </p>
        </div>
        <Button onClick={handleAddProduct} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <ProductListFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />
        </CardContent>
      </Card>

      {/* Product Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Danh sách sản phẩm
            {!_.isNil(pagination) && (
              <span className="text-sm font-normal text-gray-500">
                ({totalProducts} sản phẩm)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProductTable
            products={products}
            pagination={pagination}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onDuplicate={handleDuplicate}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />

          {/* Error State */}
          {!_.isNil(error) && (
            <div className="rounded-md bg-red-50 p-4 text-center">
              <p className="text-sm text-red-800">
                {_.get(
                  error,
                  "message",
                  "Có lỗi xảy ra khi tải danh sách sản phẩm. Vui lòng thử lại."
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, product: deleteDialog.product })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <span className="font-semibold">
                {_.get(deleteDialog, "product.name", "")}
              </span>
              ? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, product: null })}
              disabled={deleteMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={_.get(deleteMutation, "isPending", false)}
            >
              {_.get(deleteMutation, "isPending", false)
                ? "Đang xóa..."
                : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
