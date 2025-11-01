import { Metadata } from "next";
import CreateVoucherPage from "@/views/pages/shop/chien-dich/voucher/CreateVoucherPage";

export const metadata: Metadata = {
  title: "Tạo mã giảm giá | PeShop",
  description: "Tạo mã giảm giá mới cho shop",
};

export default function CreateVoucherPageRoute() {
  return <CreateVoucherPage />;
}
