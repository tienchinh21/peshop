import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tài khoản - PeShop",
  description: "Quản lý tài khoản của bạn",
};

export default function AccountPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tài khoản</h1>
      <p className="text-gray-600">Trang tài khoản - Yêu cầu đăng nhập</p>
    </div>
  );
}
