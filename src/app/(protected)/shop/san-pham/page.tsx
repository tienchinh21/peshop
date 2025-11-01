import { Metadata } from "next";
import ProductListPageView from "@/views/pages/shop/san-pham/ProductListPage";

export const metadata: Metadata = {
  title: "Danh sách sản phẩm | PeShop",
  description: "Quản lý danh sách sản phẩm của shop",
};

export default function ProductListPage() {
  return <ProductListPageView />;
}
