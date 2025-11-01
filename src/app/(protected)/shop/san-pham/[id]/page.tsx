import ProductDetailPageView from "@/views/pages/shop/san-pham/ProductDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi tiết sản phẩm | PeShop",
  description: "Xem chi tiết sản phẩm của shop",
};

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return <ProductDetailPageView productId={params.id} />;
}
