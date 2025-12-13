"use client";

import React, { useState } from "react";
import { ProductTable } from "./ProductTable";
import type { ShopProduct, ProductListPaginationInfo } from "@/types/shops/product-list.type";
import { toast } from "sonner";
export function ProductTableExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const mockProducts: ShopProduct[] = [{
    id: "03bca444-5834-4060-9b93-f785c2435653",
    name: "Laptop LOQ 2025 + Lenovo",
    imgMain: "http://localhost:8080/images/product/1760876928398.jpg",
    price: 7000000,
    status: 1,
    boughtCount: 150,
    reviewPoint: 4.5,
    slug: "laptop-loq-2025-lenovo-5155",
    category: {
      id: "21691ea5-3a39-44db-b130-2b4d0fe65bf7",
      name: "Thời trang nam",
      type: "MAIN"
    },
    categoryChild: {
      id: "b770dd21-9efd-4bc3-ad4c-0dfc0bbb7ef9",
      name: "Quần nam",
      description: "hihihih"
    }
  }];
  const mockPagination: ProductListPaginationInfo = {
    page: currentPage,
    size: pageSize,
    pages: 8,
    total: 38
  };
  const handleEdit = (product: ShopProduct) => {
    toast.info(`Chỉnh sửa sản phẩm: ${product.name}`);
  };
  const handleDelete = (product: ShopProduct) => {
    toast.error(`Xóa sản phẩm: ${product.name}`);
  };
  const handleView = (product: ShopProduct) => {
    toast.info(`Xem chi tiết: ${product.name}`);
  };
  const handleDuplicate = (product: ShopProduct) => {
    toast.success(`Nhân bản sản phẩm: ${product.name}`);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };
  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Danh sách sản phẩm</h2>
      </div>

      <ProductTable products={mockProducts} pagination={mockPagination} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} onDuplicate={handleDuplicate} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} />
    </div>;
}