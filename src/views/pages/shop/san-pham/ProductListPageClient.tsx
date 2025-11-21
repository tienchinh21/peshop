"use client";

import React, { useState, useCallback, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/components/shop/table";
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
import _ from "lodash";

const ProductListFilter = lazy(() =>
  import("@/components/shop/ProductListFilter").then((m) => ({
    default: m.ProductListFilter,
  }))
);

const DeleteConfirmDialog = lazy(() => import("./components/DeleteConfirmDialog"));

export default function ProductListPageClient() {
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

  const handleFiltersChange = useCallback((newFilters: ProductListFilters) => {
    setFilters(newFilters);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters((prev) => ({
      page: 1,
      size: _.get(prev, "size", 10),
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setFilters((prev) => ({ ...prev, size, page: 1 }));
  }, []);

  const handleEdit = useCallback((product: ShopProduct) => {
    router.push(`/shop/san-pham/sua/${product.id}`);
  }, [router]);

  const handleDelete = useCallback((product: ShopProduct) => {
    setDeleteDialog({ open: true, product });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    const productToDelete = _.get(deleteDialog, "product");
    if (_.isNil(productToDelete)) return;

    try {
      await deleteMutation.mutateAsync(productToDelete.id);
      setDeleteDialog({ open: false, product: null });
    } catch (error) {
      // Error handled by mutation
    }
  }, [deleteDialog, deleteMutation]);

  const handleView = useCallback((product: ShopProduct) => {
    router.push(`/shop/san-pham/${product.id}`);
  }, [router]);

  const handleDuplicate = useCallback((product: ShopProduct) => {
    toast.info("Tính năng nhân bản sản phẩm đang được phát triển");
  }, []);

  const handleAddProduct = useCallback(() => {
    router.push("/shop/san-pham/them");
  }, [router]);

  return (
    <div className="space-y-6">
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

      <Card>
        <CardContent className="pt-6">
          <Suspense
            fallback={
              <div className="h-20 animate-pulse bg-gray-100 rounded" />
            }
          >
            <ProductListFilter
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleResetFilters}
            />
          </Suspense>
        </CardContent>
      </Card>

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

      <Suspense fallback={null}>
        {deleteDialog.open && (
          <DeleteConfirmDialog
            open={deleteDialog.open}
            productName={_.get(deleteDialog, "product.name", "")}
            isDeleting={deleteMutation.isPending}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteDialog({ open: false, product: null })}
          />
        )}
      </Suspense>
    </div>
  );
}
