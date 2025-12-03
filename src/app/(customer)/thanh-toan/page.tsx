import { Metadata } from "next";
import { CheckoutPage } from "@/features/customer/checkout";

export const metadata: Metadata = {
  title: "Thanh toán - PeShop",
  description: "Thanh toán đơn hàng tại PeShop",
};

export default function Page() {
  return <CheckoutPage />;
}
