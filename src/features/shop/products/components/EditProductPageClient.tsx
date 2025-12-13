"use client";

import { lazy, Suspense } from "react";
import type { ShopProductDetailResponse } from "@/features/shop/products/types";
const EditProductPage = lazy(() => import("./EditProductPage"));
interface EditProductPageClientProps {
  productId: string;
  initialData: ShopProductDetailResponse;
}
export function EditProductPageClient({
  productId,
  initialData
}: EditProductPageClientProps) {
  return <Suspense fallback={<div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="h-12 bg-gray-200 animate-pulse rounded" />
            <div className="h-96 bg-gray-200 animate-pulse rounded" />
            <div className="h-96 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>}>
      <EditProductPage productId={productId} />
    </Suspense>;
}
export default EditProductPageClient;