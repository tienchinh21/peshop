import { Metadata } from "next";
import { Suspense } from "react";
import ProductsPageClient from "@/views/pages/san-pham/ProductsPageClient";
import { getProductsServer } from "@/services/api/users/product.server";
import { ProductSkeleton } from "@/components/skeleton";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm - PeShop | Mua sắm trực tuyến",
  description:
    "Khám phá hàng nghìn sản phẩm chất lượng cao với giá tốt nhất tại PeShop. Giao hàng nhanh, thanh toán an toàn, đổi trả dễ dàng.",
  keywords: [
    "mua sắm trực tuyến",
    "sản phẩm chất lượng",
    "giá tốt",
    "giao hàng nhanh",
    "PeShop",
  ],
  openGraph: {
    title: "Tất cả sản phẩm - PeShop",
    description: "Khám phá hàng nghìn sản phẩm chất lượng cao với giá tốt nhất",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tất cả sản phẩm - PeShop",
    description: "Khám phá hàng nghìn sản phẩm chất lượng cao với giá tốt nhất",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function SanPhamPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 20;

  let products = [];
  let totalPages = 1;
  let error = null;

  try {
    const data = await getProductsServer({
      page: currentPage,
      pageSize,
    });
    //@ts-ignore
    products = data.data.data || [];
    totalPages = data.data.totalPages || 1;
  } catch (err) {
    error = err;
    console.error("Failed to fetch products:", err);
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Có lỗi xảy ra khi tải sản phẩm</p>
          <p className="text-gray-500">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(20)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ProductsPageClient
        initialProducts={products}
        initialPage={currentPage}
        initialTotalPages={totalPages}
      />
    </Suspense>
  );
}
