import { Metadata } from "next";
import { WishlistPage } from "@/features/customer/wishlist";
export const metadata: Metadata = {
  title: "Yêu thích - PeShop",
  description: "Danh sách sản phẩm yêu thích"
};
export default function WishlistRoute() {
  return <WishlistPage />;
}