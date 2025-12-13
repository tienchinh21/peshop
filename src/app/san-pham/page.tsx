import { Metadata } from "next";
import { Suspense } from "react";
import { ProductsPageWithFilters } from "@/features/customer/products";
import { ProductSkeleton } from "@/shared/components/skeleton";
export const metadata: Metadata = {
  title: "Tất cả sản phẩm - PeShop | Mua sắm trực tuyến",
  description: "Khám phá hàng nghìn sản phẩm chất lượng cao với giá tốt nhất tại PeShop. Giao hàng nhanh, thanh toán an toàn, đổi trả dễ dàng.",
  keywords: ["mua sắm trực tuyến", "sản phẩm chất lượng", "giá tốt", "giao hàng nhanh", "PeShop"],
  openGraph: {
    title: "Tất cả sản phẩm - PeShop",
    description: "Khám phá hàng nghìn sản phẩm chất lượng cao với giá tốt nhất",
    type: "website",
    locale: "vi_VN"
  },
  twitter: {
    card: "summary_large_image",
    title: "Tất cả sản phẩm - PeShop",
    description: "Khám phá hàng nghìn sản phẩm chất lượng cao với giá tốt nhất"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};
export default function SanPhamPage() {
  return <Suspense fallback={<div className="container mx-auto sm:px-6 md:px-8 lg:px-12 xl:px-15 max-w-7xl py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 h-96 animate-pulse" />
            </aside>
            <main className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            </main>
          </div>
        </div>}>
      <ProductsPageWithFilters />
    </Suspense>;
}