import { Metadata } from "next";
import { Suspense } from "react";
import ProductDetailPageServer from "@/views/pages/shop/san-pham/ProductDetailPageServer";
import { getShopProductDetailServer } from "@/services/api/shops/product-detail.server";

export const metadata: Metadata = {
  title: "Chi tiết sản phẩm | PeShop",
  description: "Xem chi tiết sản phẩm của shop",
};

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  // Fetch product data on server (SSR)
  const productData = await getShopProductDetailServer(id);

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy sản phẩm
          </h2>
          <p className="text-gray-600">
            Sản phẩm không tồn tại hoặc đã bị xóa
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="space-y-6 p-6">
          <div className="h-10 bg-gray-200 animate-pulse rounded" />
          <div className="h-96 bg-gray-200 animate-pulse rounded" />
          <div className="h-64 bg-gray-200 animate-pulse rounded" />
        </div>
      }
    >
      <ProductDetailPageServer productId={id} initialData={productData} />
    </Suspense>
  );
}
