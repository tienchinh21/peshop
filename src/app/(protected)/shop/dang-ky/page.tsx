import { Metadata } from "next";
import ShopRegistrationView from "@/views/pages/shop/dang-ky/ShopRegistrationPage";

export const metadata: Metadata = {
  title: "Đăng ký Shop - Kênh Người Bán | PeShop",
  description:
    "Đăng ký mở cửa hàng trên PeShop và bắt đầu bán hàng ngay hôm nay",
  keywords: ["đăng ký shop", "mở cửa hàng", "bán hàng trực tuyến", "PeShop"],
};

export default function ShopRegistrationPage() {
  return <ShopRegistrationView />;
}
