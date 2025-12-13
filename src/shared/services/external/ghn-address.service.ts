import { axiosDotnet } from "../http";
import type {
  GHNApiResponse,
  GHNProvince,
  GHNDistrict,
  GHNWard,
} from "@/shared/types";

/**
 * GHN Address Service
 * Fetches Vietnamese provinces, districts, and wards from backend GHN API
 * Replaces the GoShip address service
 */

/**
 * Fetch all Vietnamese provinces from GHN API
 * @returns Promise<GHNProvince[]> List of provinces
 * @throws Error if API call fails
 */
export const getGHNProvinces = async (): Promise<GHNProvince[]> => {
  const response = await axiosDotnet.get<GHNApiResponse<GHNProvince>>(
    "/ghn/get-list-province"
  );
  // Response structure: { error, data: { code, message, data: [...] } }
  return response.data.data?.data ?? [];
};

/**
 * Fetch districts for a specific province from GHN API
 * @param provinceId - The province ID to fetch districts for
 * @returns Promise<GHNDistrict[]> List of districts in the province
 * @throws Error if API call fails
 */
export const getGHNDistricts = async (
  provinceId: number
): Promise<GHNDistrict[]> => {
  const response = await axiosDotnet.get<GHNApiResponse<GHNDistrict>>(
    `/ghn/get-list-district?provinceId=${provinceId}`
  );
  // Response structure: { error, data: { code, message, data: [...] } }
  return response.data.data?.data ?? [];
};

/**
 * Fetch wards for a specific district from GHN API
 * @param districtId - The district ID to fetch wards for
 * @returns Promise<GHNWard[]> List of wards in the district
 * @throws Error if API call fails
 */
export const getGHNWards = async (districtId: number): Promise<GHNWard[]> => {
  const response = await axiosDotnet.get<GHNApiResponse<GHNWard>>(
    `/ghn/get-list-ward?districtId=${districtId}`
  );
  // Response structure: { error, data: { code, message, data: [...] } }
  return response.data.data?.data ?? [];
};
