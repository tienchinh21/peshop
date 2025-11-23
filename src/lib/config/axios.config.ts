import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import {
  API_CONFIG,
  API_CONFIG_JAVA,
  STORAGE_KEYS,
} from "@/lib/config/api.config";
import { getAuthTokenCookie, setAuthTokenCookie, removeAuthTokenCookie } from "@/lib/utils/cookies.utils";

// ============ .NET API Axios Instance ============
const axiosDotnet: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  withCredentials: true, // Enable sending cookies with requests (for refresh token)
});

// ============ Java API Axios Instance ============
const axiosJava: AxiosInstance = axios.create({
  baseURL: API_CONFIG_JAVA.BASE_URL,
  timeout: API_CONFIG_JAVA.TIMEOUT,
  headers: API_CONFIG_JAVA.HEADERS,
  withCredentials: false, // Java API might not need cookies
});

// ============ Request Interceptor for .NET API ============
axiosDotnet.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token to request headers from cookie
    if (typeof window !== "undefined") {
      const token = getAuthTokenCookie();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ============ Request Interceptor for Java API ============
axiosJava.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token to request headers from cookie
    if (typeof window !== "undefined") {
      const token = getAuthTokenCookie();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ============ Response Interceptor for .NET API ============
axiosDotnet.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return response data directly
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token (refresh token is in HTTP-only cookie)
        const response = await axios.post(
          `${API_CONFIG.BASE_URL}/Auth/refresh`,
          {},
          { withCredentials: true } // Send cookies with refresh request
        );

        if (!response.data.error && response.data.data) {
          const newAccessToken = response.data.data;

          // Save new access token to cookie
          setAuthTokenCookie(newAccessToken);

          // Update authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          // Retry original request
          return axiosDotnet(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed - clear cookie and redirect to login
        removeAuthTokenCookie();
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          localStorage.removeItem(STORAGE_KEYS.AUTH_EXPIRES);
        }

        // Redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/xac-thuc";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============ Response Interceptor for Java API ============
axiosJava.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const errorMessage = error.message;
    ("Có lỗi xảy ra, vui lòng thử lại");

    return Promise.reject({
      message: errorMessage,
      code: error.response?.status,
    });
  }
);

// ============ Form Data Support for .NET API ============
export const axiosDotnetFormData = async (
  url: string,
  data: FormData,
  method: "POST" | "PUT" = "POST"
): Promise<any> => {
  if (typeof window === "undefined") {
    throw new Error(
      "axiosDotnetFormData can only be used in browser environment"
    );
  }

  const token = getAuthTokenCookie();

  const config = {
    baseURL: API_CONFIG.BASE_URL,
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    timeout: 60000, // Longer timeout for file uploads
    withCredentials: true,
  };

  const response =
    method === "PUT"
      ? await axios.put(url, data, config)
      : await axios.post(url, data, config);

  return response.data;
};

// ============ Form Data Support for Java API ============
export const axiosJavaFormData = async (
  url: string,
  data: FormData,
  method: "POST" | "PUT" = "POST"
): Promise<any> => {
  if (typeof window === "undefined") {
    throw new Error(
      "axiosJavaFormData can only be used in browser environment"
    );
  }

  const token = getAuthTokenCookie();

  const config = {
    baseURL: API_CONFIG_JAVA.BASE_URL,
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    timeout: 60000, // Longer timeout for file uploads
    withCredentials: false,
  };

  const response =
    method === "PUT"
      ? await axios.put(url, data, config)
      : await axios.post(url, data, config);

  return response.data;
};

// ============ Exports ============
export default axiosDotnet;
export { axiosDotnet, axiosJava };
