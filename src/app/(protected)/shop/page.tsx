import { redirect } from "next/navigation";
import { Metadata } from "next";
import ShopDashboardPage from "@/views/pages/shop/dashboard/ShopDashboardPage";

export const metadata: Metadata = {
  title: "Quản lý Shop - PeShop",
  description: "Quản lý cửa hàng của bạn trên PeShop",
};

export default async function ShopPage() {
  return <ShopDashboardPage />;
}
