import { Metadata } from "next";
import { Suspense } from "react";
import { ProductListPageClient } from "@/features/shop/products";

export const metadata: Metadata = {
  title: "Danh sách sản phẩm | PeShop",
  description: "Quản lý danh sách sản phẩm của shop",
};

export default function ProductListPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-24 animate-pulse bg-gray-100 rounded" />
          <div className="h-32 animate-pulse bg-gray-100 rounded" />
          <div className="h-96 animate-pulse bg-gray-100 rounded" />
        </div>
      }
    >
      <ProductListPageClient />
    </Suspense>
  );
}
