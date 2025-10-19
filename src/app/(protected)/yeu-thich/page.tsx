import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yêu thích - PeShop",
  description: "Danh sách sản phẩm yêu thích",
};

export default function WishlistPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Yêu thích</h1>
      <p className="text-gray-600">Danh sách yêu thích - Yêu cầu đăng nhập</p>
    </div>
  );
}
