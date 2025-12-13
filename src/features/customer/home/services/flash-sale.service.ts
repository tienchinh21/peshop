import { axiosDotnet } from "@/shared/services/http";
import type { FlashSaleToday, FlashSaleProductsResponse } from "../types/flash-sale.types";
const FLASH_SALE_ENDPOINTS = {
  TODAY: "/FlashSale/today",
  GET_PAGE: "/FlashSale/get-page"
} as const;
interface ApiResponse<T> {
  error: string | null;
  data: T;
}

/**
 * Fetches the list of Flash Sales for today
 * @returns Promise<FlashSaleToday[]> - Array of Flash Sales with their status
 * @requirements 1.1 - Fetch Flash Sale data from /FlashSale/today API endpoint
 */
export const getFlashSaleToday = async (): Promise<FlashSaleToday[]> => {
  const response = await axiosDotnet.get<ApiResponse<FlashSaleToday[]>>(FLASH_SALE_ENDPOINTS.TODAY);
  return response.data.data ?? [];
};

/**
 * Fetches products for a specific Flash Sale
 * @param flashSaleId - The ID of the Flash Sale
 * @param page - Page number (optional, defaults to 1)
 * @param pageSize - Number of items per page (optional, defaults to 10)
 * @returns Promise<FlashSaleProductsResponse> - Flash Sale details with products
 * @requirements 1.3 - Fetch products from /FlashSale/get-page API with active flashSaleId
 */
export const getFlashSaleProducts = async (flashSaleId: string, page: number = 1, pageSize: number = 10): Promise<FlashSaleProductsResponse> => {
  const params = new URLSearchParams();
  params.append("FlashSaleId", flashSaleId);
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());
  const url = `${FLASH_SALE_ENDPOINTS.GET_PAGE}?${params.toString()}`;
  const response = await axiosDotnet.get<ApiResponse<FlashSaleProductsResponse>>(url);
  return response.data.data;
};