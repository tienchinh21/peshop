import ProductDetailPageView from "@/views/pages/shop/san-pham/ProductDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi tiết sản phẩm | PeShop",
  description: "Xem chi tiết sản phẩm của shop",
};

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  return <ProductDetailPageView productId={id} />;
}
