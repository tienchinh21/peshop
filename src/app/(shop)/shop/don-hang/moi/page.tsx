import { OrderManager } from "@/features/shop/orders";
import { OrderStatus } from "@/shared/enums";

export default function ShopNewOrdersPage() {
  return (
    <OrderManager title="Đơn hàng mới" defaultStatus={OrderStatus.PENDING} />
  );
}
