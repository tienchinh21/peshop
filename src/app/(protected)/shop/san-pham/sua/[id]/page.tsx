import EditProductPage from "@/views/pages/shop/san-pham/sua/EditProductPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chỉnh sửa sản phẩm | PeShop",
  description: "Chỉnh sửa thông tin sản phẩm",
};

interface EditProductPageRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPageRoute({
  params,
}: EditProductPageRouteProps) {
  const { id } = await params;
  return <EditProductPage productId={id} />;
}

