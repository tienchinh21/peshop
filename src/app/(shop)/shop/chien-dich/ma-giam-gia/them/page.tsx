import { Metadata } from "next";
import { CreateVoucherPage } from "@/features/shop/campaigns/vouchers";

export const metadata: Metadata = {
  title: "Tạo mã giảm giá | PeShop",
  description: "Tạo mã giảm giá mới cho shop",
};

export default function CreateVoucherPageRoute() {
  return <CreateVoucherPage />;
}
