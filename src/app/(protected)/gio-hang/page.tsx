import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giỏ hàng - PeShop",
  description: "Giỏ hàng của bạn tại PeShop",
};

export default function CartPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
      <p className="text-gray-600">Trang giỏ hàng - Yêu cầu đăng nhập</p>
    </div>
  );
}
