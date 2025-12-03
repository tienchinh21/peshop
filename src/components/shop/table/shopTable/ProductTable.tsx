"use client";

import React from "react";
import { Table, TableBody } from "@/shared/components/ui/table";
import { ProductTableHeader } from "./ProductTableHeader";
import { ProductTableEmpty } from "./ProductTableEmpty";
import { ProductTableLoading } from "./ProductTableLoading";
import { ProductTablePagination } from "./ProductTablePagination";
import type {
  ShopProduct,
  ProductListPaginationInfo,
} from "@/types/shops/product-list.type";
import { ProductTableRow } from "./ProductTableRow";

interface ProductTableProps {
  products: ShopProduct[];
  pagination?: ProductListPaginationInfo;
  isLoading?: boolean;
  onEdit?: (product: ShopProduct) => void;
  onDelete?: (product: ShopProduct) => void;
  onView?: (product: ShopProduct) => void;
  onDuplicate?: (product: ShopProduct) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function ProductTable({
  products,
  pagination,
  isLoading = false,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  onPageChange,
  onPageSizeChange,
}: ProductTableProps) {
  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <ProductTableHeader />
          <TableBody>
            {isLoading ? (
              <ProductTableLoading rows={pagination?.size || 5} />
            ) : products.length === 0 ? (
              <ProductTableEmpty />
            ) : (
              products.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  onDuplicate={onDuplicate}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination &&
        !isLoading &&
        products.length > 0 &&
        onPageChange &&
        onPageSizeChange && (
          <ProductTablePagination
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
    </div>
  );
}
