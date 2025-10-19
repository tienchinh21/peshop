import { Metadata } from "next";
import { Suspense } from "react";
import ProductsPage from "@/views/pages/san-pham/ProductsPage";

/**
 * SEO Metadata for Products Page
 * Optimized for search engines and social sharing
 */
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

/**
 * Products Page - Server Component
 * Renders client component with Suspense for better loading UX
 */
export default function SanPhamPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Đang tải sản phẩm...</p>
        </div>
      }
    >
      <ProductsPage />
    </Suspense>
  );
}
