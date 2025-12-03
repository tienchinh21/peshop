import { Metadata } from "next";
import { ShopRegistrationPage as ShopRegistrationView } from "@/features/shop/registration";

export const metadata: Metadata = {
  title: "Đăng ký Shop - Kênh Người Bán | PeShop",
  description:
    "Đăng ký mở cửa hàng trên PeShop và bắt đầu bán hàng ngay hôm nay",
  keywords: ["đăng ký shop", "mở cửa hàng", "bán hàng trực tuyến", "PeShop"],
};

export default function ShopRegistrationPage() {
  return <ShopRegistrationView />;
}
