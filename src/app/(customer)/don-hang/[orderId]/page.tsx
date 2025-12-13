import { OrderDetailPage } from "@/features/customer/orders";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailRoute({ params }: PageProps) {
  const { orderId } = await params;
  return <OrderDetailPage orderId={orderId} />;
}
