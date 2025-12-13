import { VoucherDetailPage } from "@/features/shop/campaigns/vouchers";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Chi tiết mã giảm giá | PeShop",
  description: "Xem chi tiết mã giảm giá"
};
interface VoucherDetailPageRouteProps {
  params: Promise<{
    id: string;
  }>;
}
export default async function VoucherDetailPageRoute({
  params
}: VoucherDetailPageRouteProps) {
  const {
    id
  } = await params;
  return <VoucherDetailPage voucherId={id} />;
}