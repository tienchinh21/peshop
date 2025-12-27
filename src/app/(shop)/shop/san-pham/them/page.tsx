import { Metadata } from "next";
import { Suspense } from "react";
import { CreateProductPageClient } from "@/features/shop/products";
export const metadata: Metadata = {
  title: "Thêm sản phẩm - PeShop",
  description: "Thêm sản phẩm mới vào cửa hàng",
};
export default function AddProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="h-12 bg-gray-200 animate-pulse rounded" />
            <div className="h-96 bg-gray-200 animate-pulse rounded" />
            <div className="h-96 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      }
    >
      <CreateProductPageClient />
    </Suspense>
  );
}
