import axios from "axios";
import { API_CONFIG, STORAGE_KEYS } from "@/lib/config/api.config";
import {
  getAuthTokenCookie,
  setAuthTokenCookie,
  removeAuthTokenCookie,
} from "@/lib/utils/cookies.utils";
import type { LoginResponse } from "@/features/customer/auth/types";

/**
 * Retrieves the current authentication token from cookies
 */
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return getAuthTokenCookie();
};

/**
 * Stores authentication token in cookies
 */
export const setAuthToken = (token: string): void => {
  setAuthTokenCookie(token);
};

/**
 * Removes authentication token from cookies and clears user data
 */
export const clearAuthToken = (): void => {
  removeAuthTokenCookie();
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.AUTH_EXPIRES);
  }
};

/**
 * Refreshes the authentication token using the refresh token stored in HTTP-only cookie
 * Returns new access token or throws error if refresh fails
 */
export const refreshAuthToken = async (): Promise<string> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_CONFIG.BASE_URL}/Auth/refresh`,
      {},
      { withCredentials: true }
    );

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

/**
 * Checks if user is authenticated by verifying token existence
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Redirects to authentication page
 * Used when token refresh fails or user is unauthorized
 */
export const redirectToAuth = (): void => {
  if (typeof window !== "undefined") {
    window.location.href = "/xac-thuc";
  }
};
