import { Metadata } from "next";
import { ShopDashboardPage } from "@/features/shop/dashboard";

export const metadata: Metadata = {
  title: "Quản lý Shop - PeShop",
  description: "Quản lý cửa hàng của bạn trên PeShop",
};

export default async function ShopPage() {
  return <ShopDashboardPage />;
}
