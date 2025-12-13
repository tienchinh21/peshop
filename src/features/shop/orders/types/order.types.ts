import { OrderStatus } from "@/shared/enums";
export interface OrderProduct {
  name: string;
  imgMain: string;
}
export interface OrderDetail {
  product: OrderProduct;
  propertyValueNames: string[];
  quantity: number;
}
export interface Order {
  id: string;
  orderCode: string | null;
  revenue: number | null;
  statusOrder: OrderStatus;
  createdAt: string;
  note: string | null;
  orderDetails: OrderDetail[];
}
export interface PageInfo {
  page: number;
  size: number;
  pages: number;
  total: number;
}
export interface OrderResponseContent {
  info: PageInfo;
  response: Order[];
}
export interface OrderResponse {
  error: any;
  content: OrderResponseContent;
}
export interface OrderFilterParams {
  page?: number;
  size?: number;
  sort?: string;
  filter?: string;
}
export interface UpdateOrderStatusRequest {
  orderId: string;
}