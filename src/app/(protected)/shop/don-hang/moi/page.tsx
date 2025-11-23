import OrderManager from "@/views/pages/shop/orders/OrderManager";
import { OrderStatus } from "@/enums/order.enum";

export default function ShopNewOrdersPage() {
  return (
    <OrderManager title="Đơn hàng mới" defaultStatus={OrderStatus.PENDING} />
  );
}
