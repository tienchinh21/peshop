import { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { API_CONFIG, STORAGE_KEYS } from "@/lib/config/api.config";
import { getAuthTokenCookie, setAuthTokenCookie, removeAuthTokenCookie } from "@/lib/utils/cookies.utils";
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