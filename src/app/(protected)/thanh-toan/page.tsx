import { Metadata } from "next";
import CheckoutPage from "@/views/pages/thanh-toan/CheckoutPage";

export const metadata: Metadata = {
  title: "Thanh toán - PeShop",
  description: "Thanh toán đơn hàng tại PeShop",
};

export default function Page() {
  return <CheckoutPage />;
}

