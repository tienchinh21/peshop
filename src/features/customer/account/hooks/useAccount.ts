"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, changePassword } from "../services";
import type { UpdateProfileRequest, ChangePasswordRequest } from "../types";

const ACCOUNT_QUERY_KEY = ["account", "profile"];

/**
 * Hook for fetching user profile
 */
export function useProfile() {
  return useQuery({
    queryKey: ACCOUNT_QUERY_KEY,
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for updating user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onSuccess: (response) => {
      if (!response.error) {
        // Invalidate profile query to refetch
        queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
      }
    },
  });
}

/**
 * Hook for changing password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
  });
}
