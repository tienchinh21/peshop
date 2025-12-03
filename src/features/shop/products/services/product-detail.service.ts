import { axiosJava } from "@/lib/config/axios.config";
import type { ShopProductDetailResponse } from "../types";

export const getShopProductDetail = async (
  productId: string
): Promise<ShopProductDetailResponse> => {
  const response = await axiosJava.get<ShopProductDetailResponse>(
    `/shop/product/${productId}`
  );
  return response.data;
};
