"use client";

import React, { useState } from "react";
import { ProductTable } from "./ProductTable";
import type {
  ShopProduct,
  ProductListPaginationInfo,
} from "@/types/shops/product-list.type";
import { toast } from "sonner";

/**
 * Example usage of ProductTable component
 * This demonstrates how to use the table with mock data
 * 
 * In real usage, you would:
 * 1. Fetch data from API using React Query or similar
 * 2. Handle loading states
 * 3. Implement actual edit/delete/view handlers
 */
export function ProductTableExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with actual API call
  const mockProducts: ShopProduct[] = [
    {
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
        type: "MAIN",
      },
      categoryChild: {
        id: "b770dd21-9efd-4bc3-ad4c-0dfc0bbb7ef9",
        name: "Quần nam",
        description: "hihihih",
      },
    },
    // Add more mock products as needed
  ];

  const mockPagination: ProductListPaginationInfo = {
    page: currentPage,
    size: pageSize,
    pages: 8,
    total: 38,
  };

  // Handlers
  const handleEdit = (product: ShopProduct) => {
    toast.info(`Chỉnh sửa sản phẩm: ${product.name}`);
    // Navigate to edit page or open edit modal
    // router.push(`/shop/san-pham/sua/${product.id}`);
  };

  const handleDelete = (product: ShopProduct) => {
    toast.error(`Xóa sản phẩm: ${product.name}`);
    // Show confirmation dialog then delete
    // if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
    //   deleteProduct(product.id);
    // }
  };

  const handleView = (product: ShopProduct) => {
    toast.info(`Xem chi tiết: ${product.name}`);
    // Navigate to product detail page
    // router.push(`/shop/san-pham/${product.id}`);
  };

  const handleDuplicate = (product: ShopProduct) => {
    toast.success(`Nhân bản sản phẩm: ${product.name}`);
    // Duplicate product logic
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Fetch new page data
    // refetch({ page });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
    // Fetch with new page size
    // refetch({ page: 1, size });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Danh sách sản phẩm</h2>
      </div>

      <ProductTable
        products={mockProducts}
        pagination={mockPagination}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onDuplicate={handleDuplicate}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}

