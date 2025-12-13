import axios from "axios";
import { API_CONFIG, STORAGE_KEYS } from "@/lib/config/api.config";
import { getAuthTokenCookie, setAuthTokenCookie, removeAuthTokenCookie } from "@/lib/utils/cookies.utils";
import type { LoginResponse } from "@/features/customer/auth/types";
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return getAuthTokenCookie();
};
export const setAuthToken = (token: string): void => {
  setAuthTokenCookie(token);
};
export const clearAuthToken = (): void => {
  removeAuthTokenCookie();
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.AUTH_EXPIRES);
  }
};
export const refreshAuthToken = async (): Promise<string> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_CONFIG.BASE_URL}/Auth/refresh`, {}, {
      withCredentials: true
    });
    if (!response.data.error && response.data.data) {
      const newAccessToken = response.data.data;
      setAuthToken(newAccessToken);
      return newAccessToken;
    }
    throw new Error("Failed to refresh token");
  } catch (error) {
    clearAuthToken();
    throw error;
  }
};
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
export const redirectToAuth = (): void => {
  if (typeof window !== "undefined") {
    window.location.href = "/xac-thuc";
  }
};