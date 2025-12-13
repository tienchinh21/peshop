export enum FlashSaleStatus {
  NotStarted = 0,
  Active = 1,
  Ended = 2,
}
export interface ShopFlashSale {
  id: string;
  startTime: string;
  endTime: string;
  status: FlashSaleStatus;
}
export interface FlashSaleProduct {
  id: string;
  name: string;
  imgMain: string;
}
export interface ParticipatedFlashSale {
  flashSale: {
    id: string;
    startTime: string;
    endTime: string;
    status: FlashSaleStatus;
  };
  products: FlashSaleProduct[];
}
export interface ApiError {
  message: string;
  exception: string;
}
export interface ShopFlashSaleApiResponse {
  error: ApiError | null;
  content: ShopFlashSale[];
}
export interface ParticipatedFlashSaleApiResponse {
  error: ApiError | null;
  content: ParticipatedFlashSale[];
}
export interface FlashSaleListFilters {
  startDate: string;
  endDate: string;
}