import { Metadata } from "next";
import { CheckoutFlowWrapper } from "@/features/customer/orders";
export const metadata: Metadata = {
  title: "Thanh toán - PeShop",
  description: "Thanh toán đơn hàng tại PeShop"
};
export default function CheckoutV2Page() {
  return <CheckoutFlowWrapper />;
}