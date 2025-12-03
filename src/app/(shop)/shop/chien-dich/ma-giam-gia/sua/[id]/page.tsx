import { EditVoucherPage } from "@/features/shop/campaigns/vouchers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chỉnh sửa mã giảm giá | PeShop",
  description: "Chỉnh sửa thông tin mã giảm giá",
};

interface EditVoucherPageRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditVoucherPageRoute({
  params,
}: EditVoucherPageRouteProps) {
  const { id } = await params;
  return <EditVoucherPage voucherId={id} />;
}
