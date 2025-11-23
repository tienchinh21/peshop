import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  getShopServer,
  getProductsByShopIdServer,
} from "@/services/api/users/get-shop.server";
import { getTopShopIds } from "@/services/api/users/product.server.cached";
import ShopPageClient from "@/views/pages/shop/ShopPageClient";

interface ShopPageProps {
  params: Promise<{ shopId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const revalidate = 3600;

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const shopIds = await getTopShopIds(50);
    return shopIds.map((shopId) => ({ shopId }));
  } catch (error) {
    console.error("Failed to generate static params for shops:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: ShopPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const shopData = await getShopServer(shopId);

  if (!shopData) {
    return {
      title: "Shop không tồn tại | PeShop",
      description: "Shop bạn đang tìm kiếm không tồn tại",
    };
  }

  return {
    title: `${shopData.name} | PeShop`,
    description: `Xem sản phẩm của ${shopData.name}. Mua sắm online uy tín, giao hàng nhanh chóng.`,
    openGraph: {
      title: `${shopData.name} | PeShop`,
      description: `Xem sản phẩm của ${shopData.name}`,
      type: "website",
    },
  };
}

export default async function ShopPage({
  params,
  searchParams,
}: ShopPageProps) {
  const { shopId } = await params;
  const query = await searchParams;
  const currentPage = Number(query.page) || 1;
  const pageSize = 20;

  // Fetch shop data and products in parallel (SSR)
  const [shopData, productsData] = await Promise.all([
    getShopServer(shopId),
    getProductsByShopIdServer(shopId, currentPage, pageSize),
  ]);

  // If shop not found, show 404
  if (!shopData) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <div className="h-48 bg-gray-200 animate-pulse" />
          <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="h-32 bg-gray-200 animate-pulse rounded-lg" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-200 animate-pulse rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ShopPageClient
        shopData={shopData}
        initialProducts={productsData?.products || []}
        initialPage={currentPage}
        initialTotalPages={productsData?.totalPages || 1}
      />
    </Suspense>
  );
}
