import { Suspense } from "react";
import { Metadata } from "next";
import {
  EditProductPageClient,
  getShopProductDetailServer,
} from "@/features/shop/products";

export const metadata: Metadata = {
  title: "Chỉnh sửa sản phẩm | PeShop",
  description: "Chỉnh sửa thông tin sản phẩm",
};

interface EditProductPageRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPageRoute({
  params,
}: EditProductPageRouteProps) {
  const { id } = await params;

  // Fetch initial product data on server
  const initialData = await getShopProductDetailServer(id);

  if (!initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy sản phẩm
          </h2>
          <p className="text-gray-600">Sản phẩm không tồn tại hoặc đã bị xóa</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="h-12 bg-gray-200 animate-pulse rounded" />
            <div className="h-96 bg-gray-200 animate-pulse rounded" />
            <div className="h-96 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      }
    >
      <EditProductPageClient productId={id} initialData={initialData} />
    </Suspense>
  );
}
