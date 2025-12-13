"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getGHNProvinces,
  getGHNDistricts,
  getGHNWards,
} from "@/shared/services/external";
import type { GHNProvince, GHNDistrict, GHNWard } from "@/shared/types";

/**
 * Query keys for GHN address data
 * Used for cache management and invalidation
 */
export const ghnAddressKeys = {
  all: ["ghn-address"] as const,
  provinces: () => [...ghnAddressKeys.all, "provinces"] as const,
  districts: (provinceId: number) =>
    [...ghnAddressKeys.all, "districts", provinceId] as const,
  wards: (districtId: number) =>
    [...ghnAddressKeys.all, "wards", districtId] as const,
};

/**
 * Hook to fetch all Vietnamese provinces from GHN API
 * Provinces rarely change, so staleTime is set to 30 minutes
 * @returns React Query result with provinces data
 */
export const useGHNProvinces = () => {
  return useQuery<GHNProvince[]>({
    queryKey: ghnAddressKeys.provinces(),
    queryFn: async () => {
      try {
        return await getGHNProvinces();
      } catch (error) {
        toast.error("Không thể tải danh sách tỉnh/thành phố");
        throw error;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Hook to fetch districts for a specific province from GHN API
 * @param provinceId - The province ID to fetch districts for
 * @param enabled - Whether the query should be enabled (default: true when provinceId > 0)
 * @returns React Query result with districts data
 */
export const useGHNDistricts = (
  provinceId: number,
  enabled: boolean = provinceId > 0
) => {
  return useQuery<GHNDistrict[]>({
    queryKey: ghnAddressKeys.districts(provinceId),
    queryFn: async () => {
      try {
        return await getGHNDistricts(provinceId);
      } catch (error) {
        toast.error("Không thể tải danh sách quận/huyện");
        throw error;
      }
    },
    enabled: enabled && provinceId > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to fetch wards for a specific district from GHN API
 * @param districtId - The district ID to fetch wards for
 * @param enabled - Whether the query should be enabled (default: true when districtId > 0)
 * @returns React Query result with wards data
 */
export const useGHNWards = (
  districtId: number,
  enabled: boolean = districtId > 0
) => {
  return useQuery<GHNWard[]>({
    queryKey: ghnAddressKeys.wards(districtId),
    queryFn: async () => {
      try {
        return await getGHNWards(districtId);
      } catch (error) {
        toast.error("Không thể tải danh sách phường/xã");
        throw error;
      }
    },
    enabled: enabled && districtId > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
