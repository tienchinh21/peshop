import type { ApiError, File } from "@/shared/types";
export interface Shop {
  name: string;
  description: string;
  oldProviceId: string;
  oldDistrictId: string;
  oldWardId: string;
  newProviceId?: string;
  newWardId?: string;
  streetLine: string;
  fullOldAddress: string;
  fullNewAddress?: string;
}
export interface CreateShopRequest {
  name: string;
  description: string;
  oldProviceId: string;
  oldDistrictId: string;
  oldWardId: string;
  newProviceId?: string;
  newWardId?: string;
  streetLine: string;
  fullOldAddress: string;
  fullNewAddress?: string;
  logofile?: globalThis.File;
}
export interface ShopResponse {
  error: ApiError;
  data: Shop[];
  file: File;
}