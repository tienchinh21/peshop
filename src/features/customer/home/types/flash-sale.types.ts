export enum FlashSaleStatus {
  NotStarted = 0,
  Active = 1,
  Ended = 2,
}
export interface FlashSaleToday {
  flashSaleId: string;
  startTime: string;
  endTime: string;
  status: FlashSaleStatus;
  statusText: string;
}
export interface FlashSaleProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  priceDiscount: number;
  percentDecrease: number;
  quantity: number;
  usedQuantity: number;
  reviewCount: number;
  reviewPoint: number;
  boughtCount: number;
  addressShop: string;
  slug: string;
  shopId: string;
  shopName: string;
}
export interface FlashSaleProductsResponse {
  flashSaleId: string;
  startTime: string;
  endTime: string;
  products: FlashSaleProduct[];
}
export interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}