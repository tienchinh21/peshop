import { Metadata } from "next";
import VoucherListPage from "@/views/pages/shop/chien-dich/voucher/VoucherListPage";

export const metadata: Metadata = {
  title: "Quản lý mã giảm giá | PeShop",
  description: "Quản lý các mã giảm giá của shop",
};

export default function VoucherListPageRoute() {
  return <VoucherListPage />;
}
