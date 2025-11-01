import { Metadata } from "next";
import CartPage from "@/views/pages/gio-hang/CartPage";

export const metadata: Metadata = {
  title: "Giỏ hàng - PeShop",
  description: "Giỏ hàng của bạn tại PeShop",
};

export default function Page() {
  return <CartPage />;
}
