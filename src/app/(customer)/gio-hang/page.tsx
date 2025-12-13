import { Metadata } from "next";
import { CartPage } from "@/features/customer/cart";
export const metadata: Metadata = {
  title: "Giỏ hàng - PeShop",
  description: "Giỏ hàng của bạn tại PeShop"
};
export default function Page() {
  return <CartPage />;
}