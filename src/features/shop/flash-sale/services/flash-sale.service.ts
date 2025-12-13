import { axiosJava } from "@/shared/services/http";
import type { ShopFlashSale, ShopFlashSaleApiResponse, ParticipatedFlashSale, ParticipatedFlashSaleApiResponse } from "../types";

/**
 * Fetches available Flash Sales for the shop within a date range
 * 
 * @param startDate - Start date filter (ISO string format)
 * @param endDate - End date filter (ISO string format)
 * @returns Promise<ShopFlashSale[]> - List of Flash Sales
 * @throws Error if API returns an error or request fails
 * 
 * Requirements: 1.2, 5.2, 5.4
 */
export const getShopFlashSales = async (startDate: string, endDate: string): Promise<ShopFlashSale[]> => {
  const params = new URLSearchParams();
  params.append("startDate", startDate);
  params.append("endDate", endDate);
  const url = `/shop/flash-sale?${params.toString()}`;
  const response = await axiosJava.get<ShopFlashSaleApiResponse>(url);
  if (response.data.error) {
    throw new Error(response.data.error.message || "Failed to fetch Flash Sales");
  }
  return response.data.content;
};

/**
 * Fetches Flash Sales that the shop has participated in with their products
 * 
 * @returns Promise<ParticipatedFlashSale[]> - List of participated Flash Sales with products
 * @throws Error if API returns an error or request fails
 * 
 * Requirements: 2.1, 5.2, 5.4
 */
export const getParticipatedFlashSales = async (): Promise<ParticipatedFlashSale[]> => {
  const response = await axiosJava.get<ParticipatedFlashSaleApiResponse>("/shop/flash-sale/participated");
  if (response.data.error) {
    throw new Error(response.data.error.message || "Failed to fetch participated Flash Sales");
  }
  return response.data.content;
};
export interface FlashSaleProductRegistration {
  productId: string;
  percentDecrease: number;
  quantity: number;
  orderLimit: number;
}

/**
 * Register products to join a Flash Sale
 * 
 * @param flashSaleId - ID of the Flash Sale to join
 * @param products - Array of products with discount info
 * @returns Promise<void>
 * @throws Error if API returns an error or request fails
 */
export const joinFlashSale = async (flashSaleId: string, products: FlashSaleProductRegistration[]): Promise<void> => {
  const response = await axiosJava.post(`/shop/flash-sale/join/${flashSaleId}`, products);
  if (response.data?.error) {
    throw new Error(response.data.error.message || "Failed to join Flash Sale");
  }
};