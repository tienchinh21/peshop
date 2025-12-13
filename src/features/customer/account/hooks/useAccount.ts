"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, changePassword } from "../services";
import type { UpdateProfileRequest, ChangePasswordRequest } from "../types";
const ACCOUNT_QUERY_KEY = ["account", "profile"];
export function useProfile() {
  return useQuery({
    queryKey: ACCOUNT_QUERY_KEY,
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000
  });
}
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onSuccess: response => {
      if (!response.error) {
        queryClient.invalidateQueries({
          queryKey: ACCOUNT_QUERY_KEY
        });
      }
    }
  });
}
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data)
  });
}