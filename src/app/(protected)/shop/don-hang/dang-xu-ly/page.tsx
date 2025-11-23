import OrderManager from "@/views/pages/shop/orders/OrderManager";
import { OrderStatus } from "@/enums/order.enum";

export default function ShopProcessingOrdersPage() {
  return (
    <OrderManager
      title="Đơn hàng đang xử lý"
      defaultStatus={OrderStatus.CONFIRMED}
    />
  );
}
