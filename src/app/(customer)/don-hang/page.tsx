import { Metadata } from "next";
import { OrdersPage } from "@/features/customer/orders";
export const metadata: Metadata = {
  title: "Đơn hàng - PeShop",
  description: "Quản lý đơn hàng của bạn"
};
export default function OrdersPageRoute() {
  return <OrdersPage />;
}