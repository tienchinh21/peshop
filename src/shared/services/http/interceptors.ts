import { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { API_CONFIG, STORAGE_KEYS } from "@/lib/config/api.config";
import { getAuthTokenCookie, setAuthTokenCookie, removeAuthTokenCookie } from "@/lib/utils/cookies.utils";

// List of API endpoints that should NOT trigger redirect on 401
const NON_CRITICAL_ENDPOINTS = [
  '/view-product',
  '/Products/view',
  '/track',
];

const isNonCriticalEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return NON_CRITICAL_ENDPOINTS.some(endpoint => url.toLowerCase().includes(endpoint.toLowerCase()));
};

export const setupAuthRequestInterceptor = (client: AxiosInstance): void => {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = getAuthTokenCookie();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  }, (error: AxiosError) => {
    return Promise.reject(error);
  });
};
export const setupDotnetAuthResponseInterceptor = (client: AxiosInstance): void => {
  client.interceptors.response.use((response: AxiosResponse) => {
    return response;
  }, async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    
    // Don't redirect for non-critical endpoints
    if (error.response?.status === 401 && isNonCriticalEndpoint(originalRequest?.url)) {
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(`${API_CONFIG.BASE_URL}/Auth/refresh`, {}, {
          withCredentials: true
        });
        if (!response.data.error && response.data.data) {
          const newAccessToken = response.data.data;
          setAuthTokenCookie(newAccessToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return client(originalRequest);
        }
      } catch (refreshError) {
        removeAuthTokenCookie();
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          localStorage.removeItem(STORAGE_KEYS.AUTH_EXPIRES);
          // Remove user_data cookie as well
          document.cookie = "user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location.href = "/xac-thuc";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  });
};
export const setupJavaErrorResponseInterceptor = (client: AxiosInstance): void => {
  client.interceptors.response.use((response: AxiosResponse) => {
    return response;
  }, (error: AxiosError) => {
    const errorMessage = error.message;
    "Có lỗi xảy ra, vui lòng thử lại";
    return Promise.reject({
      message: errorMessage,
      code: error.response?.status
    });
  });
};