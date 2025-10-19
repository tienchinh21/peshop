import { Metadata } from "next";
import CreateProductPage from "@/views/pages/shop/san-pham/them/CreateProductPage";

export const metadata: Metadata = {
  title: "Thêm sản phẩm - PeShop",
  description: "Thêm sản phẩm mới vào cửa hàng",
};

export default function AddProductPage() {
  return <CreateProductPage />;
}
