import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đơn hàng - PeShop",
  description: "Quản lý đơn hàng của bạn",
};

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Đơn hàng</h1>
      <p className="text-gray-600">Trang đơn hàng - Yêu cầu đăng nhập</p>
    </div>
  );
}
