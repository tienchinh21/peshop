import { Metadata } from "next";
import { ShopDashboardPage } from "@/features/shop/dashboard";

export const metadata: Metadata = {
  title: "Dashboard - Quản lý Shop | PeShop",
  description: "Quản lý sản phẩm, đơn hàng và doanh thu của cửa hàng",
  keywords: ["quản lý shop", "dashboard", "bán hàng", "PeShop"],
};

/**
 * Shop Dashboard Page (Protected)
 * Server component - handles metadata and renders client view
 */
export default function DashboardPage() {
  return <ShopDashboardPage />;
}
