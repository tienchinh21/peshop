import { OrderManager } from "@/features/shop/orders";
import { OrderStatus } from "@/shared/enums";
export default function ShopProcessingOrdersPage() {
  return <OrderManager title="Đơn hàng đang xử lý" defaultStatus={OrderStatus.CONFIRMED} />;
}